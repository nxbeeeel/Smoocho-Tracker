/**
 * Smoocho Expense Tracker - Google Apps Script Backend
 * Handles sales/expense capture + sheet automation
 */

// ---- Configuration ----
const EXPENSES_SHEET_ID = '1E_cql_XMCl1SBNTW-NV3gDl4yugMAMAxQ9CMATTo3nk'; // Existing expenses sheet ID
const SALES_SHEET_ID = '1sNeX9Ex7eZdiqpJ7sMWHpfc2FpIZcbruRwLPZxQVSi0'; // Existing daily account sheet ID

const EXPENSES_SHEET_NAME = 'Smoocho Expenses';
const SALES_SHEET_NAME = 'Smoocho Daily Account';

// Expense categories – must match sheet headers exactly
const EXPENSE_CATEGORIES = [
  'Rent', 'Staff', 'Bake', 'Store', 'Biscoff', 'Ice crm', 'Oil',
  'Disposbl', 'Smoocho Disposable', 'Water Can', 'Water Bottle', 'Good Life', 'Wipping',
  'Promotion', 'Nuts', 'Custard', 'Kiwi', 'Strawberry', 'Mango', 'Robst', 'pinaple', 'Misc'
];

const FRUIT_COLUMNS = ['Kiwi', 'Strawberry', 'Mango', 'Robst', 'pinaple'];

// ---- HTTP Entrypoints ----
function doGet(e) {
  const type = e?.parameter?.type;

  if (type === 'cashBalance' && e.parameter.date) {
    return jsonResponse(getCashBalanceData(e.parameter.date));
  }
  
  if (type === 'monthlySummary' && e.parameter.month) {
    return jsonResponse(getMonthlySummary(e.parameter.month));
  }

  if (type === 'entries') {
    const sheetType = e.parameter.sheet || 'sales';
    const month = e.parameter.month;
    return jsonResponse(getEntries(sheetType, month));
  }

  return jsonResponse({
    success: true,
    message: 'Smoocho Apps Script is running',
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const { type, entry, date, month } = data;

    let result;
    switch (type) {
      case 'expense':
        result = handleExpense(entry);
        break;
      case 'sales':
        result = handleSales(entry);
        break;
      case 'getCashBalance':
        result = getCashBalanceData(date);
        break;
      case 'monthlySummary':
        result = getMonthlySummary(month);
        break;
      case 'adjustments':
        result = handleAdjustments(entry);
        break;
      case 'test':
        result = { success: true, message: 'Connection OK' };
        break;
      default:
        result = { success: false, error: `Unknown type ${type}` };
    }

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ---- Expense Handling ----
function handleExpense(entry) {
  const expensesSpreadsheet = getOrCreateSpreadsheet(EXPENSES_SHEET_ID, EXPENSES_SHEET_NAME);
  const expensesSheetId = expensesSpreadsheet.getId();
  const monthName = getMonthName(entry.date);
  const sheet = getOrCreateSheet(expensesSpreadsheet, monthName);

  ensureExpenseHeaders(sheet);

  const entryDate = formatDate(entry.date);
  const rowIndex = findOrCreateRow(sheet, entryDate);
  
  // Get category and amount from entry
  const category = entry.category;
  const amount = parseFloat(entry.amount) || 0;
  
  if (!category) {
    throw new Error('No category provided');
  }
  
  // Find column index for this category
  const categoryIndex = EXPENSE_CATEGORIES.indexOf(category);
  if (categoryIndex === -1) {
    throw new Error('Invalid category: ' + category);
  }
  
  const colIndex = categoryIndex + 2; // Date is col 1, categories start at col 2
  
  // Update the specific category cell
  sheet.getRange(rowIndex, colIndex).setValue(amount);
  
  // Update payment method
  const paymentMethodCol = 2 + EXPENSE_CATEGORIES.length + 2; // Date + categories + Fruit_Sum + Total + Payment
  sheet.getRange(rowIndex, paymentMethodCol).setValue(entry.paymentMethod || 'cash');

  // Ensure formulas are in place
  ensureRowFormulas(sheet, rowIndex);

  // Get total expense for syncing (use formula evaluation to avoid recalc)
  SpreadsheetApp.flush(); // Force calculation
  const totalExpenseCol = 2 + EXPENSE_CATEGORIES.length + 1;
  const totalExpenseValue = sheet.getRange(rowIndex, totalExpenseCol).getValue() || 0;
  const paymentMethod = (entry.paymentMethod || 'cash').toLowerCase();

  // Update single TOTAL row at bottom
  updateMonthTotals(sheet);

  // Sync to daily account
  try {
    syncExpenseToDailyAccount(entryDate, totalExpenseValue, paymentMethod);
  } catch (e) {
    Logger.log('Sync error (non-critical): ' + e.toString());
  }

  return {
    success: true,
    message: 'Expense saved',
    expensesSheetId,
    expensesSheetUrl: expensesSpreadsheet.getUrl(),
  };
}

function ensureRowFormulas(sheet, rowIndex) {
  // Check if formulas exist, if not, create them
  const fruitSumCol = 2 + EXPENSE_CATEGORIES.length; // Date + categories + Fruit_Sum (no Misc anymore)
  const totalExpenseCol = fruitSumCol + 1;
  
  // Fruit_Sum formula
  const fruitSumCell = sheet.getRange(rowIndex, fruitSumCol);
  if (!fruitSumCell.getFormula()) {
    const fruitStart = 2 + EXPENSE_CATEGORIES.indexOf(FRUIT_COLUMNS[0]);
    const fruitEnd = 2 + EXPENSE_CATEGORIES.indexOf(FRUIT_COLUMNS[FRUIT_COLUMNS.length - 1]);
    fruitSumCell.setFormula(`=SUM(${getColumnLetter(fruitStart)}${rowIndex}:${getColumnLetter(fruitEnd)}${rowIndex})`);
  }
  
  // Total Expense formula (sum all categories from col 2 to end of categories)
  const totalExpenseCell = sheet.getRange(rowIndex, totalExpenseCol);
  const totalStartCol = 2;
  const totalEndCol = 2 + EXPENSE_CATEGORIES.length - 1; // Last category column
  totalExpenseCell.setFormula(`=SUM(${getColumnLetter(totalStartCol)}${rowIndex}:${getColumnLetter(totalEndCol)}${rowIndex})`);
}

// ---- Sales Handling ----
function handleSales(entry) {
  const salesSpreadsheet = getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
  const salesSheetId = salesSpreadsheet.getId();
  const monthName = getMonthName(entry.date);
  const sheet = getOrCreateSheet(salesSpreadsheet, monthName);

  ensureSalesHeaders(sheet);

  const entryDate = formatDate(entry.date);
  const rowIndex = findOrCreateRow(sheet, entryDate);
  
  // Get yesterday's Cash in Hand for calculation
  const yesterday = shiftDate(entryDate, -1);
  const yesterdayInfo = findRowAndIndex(sheet, yesterday);
  const yesterdayCashInHand = yesterdayInfo.rowIndex > 0
    ? sheet.getRange(yesterdayInfo.rowIndex, 8).getValue() || 0
    : 0;

  const rowData = buildSalesRowData(entryDate, entry, rowIndex, yesterdayCashInHand);
  sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  formatSalesRow(sheet, rowIndex);
  
  // Update single TOTAL row at bottom
  updateMonthTotals(sheet);

  return {
    success: true,
    message: 'Sales saved',
    salesSheetId,
    salesSheetUrl: salesSpreadsheet.getUrl(),
  };
}

function buildSalesRowData(entryDate, entry, rowIndex, yesterdayCashInHand) {
  const cashSale = parseFloat(entry.cashSale) || 0;
  const bankSale = parseFloat(entry.bankSale) || 0;
  const swiggy = parseFloat(entry.swiggy) || 0;
  const zomato = parseFloat(entry.zomato) || 0;
  const swiggyPayout = parseFloat(entry.swiggyPayout) || 0;
  const zomatoPayout = parseFloat(entry.zomatoPayout) || 0;
  const cashInBank = parseFloat(entry.cashInBank) || 0;
  const cashWithdrawal = parseFloat(entry.cashWithdrawal) || 0;
  const enteredCashInHand = parseFloat(entry.cashInHand) || 0;
  const netCashInHand = enteredCashInHand - cashWithdrawal;

  const row = [
    entryDate,
    cashSale,
    bankSale,
    swiggy,
    zomato,
    swiggyPayout,
    zomatoPayout,
    netCashInHand,
    cashInBank,
    cashWithdrawal,
  ];

  // Total Sale = Cash Sale + Bank Sale + Swiggy + Zomato
  row.push(`=B${rowIndex}+C${rowIndex}+D${rowIndex}+E${rowIndex}`); // Column K: Total Sale (All sales)

  row.push(0); // Column L: Expense Cash placeholder
  row.push(0); // Column M: Expense Bank placeholder
  row.push(`=L${rowIndex}+M${rowIndex}`); // Column N: Total Expense
  
  // Profit = Cash Sale + Bank Sale + Swiggy Payout + Zomato Payout - Total Expense
  row.push(`=B${rowIndex}+C${rowIndex}+F${rowIndex}+G${rowIndex}-N${rowIndex}`); // Column O: Profit
  
  // Difference = (Yesterday Cash in Hand + Today Cash Sale - Cash Expense) - Today Cash in Hand (after withdrawal)
  // Shows missing money: positive = missing, negative = surplus
  const yesterdayBalance = yesterdayCashInHand || 0;
  row.push(`=(${yesterdayBalance}+B${rowIndex}-L${rowIndex})-H${rowIndex}`); // Column P: Difference

  return row;
}

// ---- Cash Balance ----
function getCashBalanceData(dateString) {
  if (!dateString) {
    return { success: false, error: 'Date not provided' };
  }

  const salesSpreadsheet = getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
  const monthName = getMonthName(dateString);
  const sheet = getOrCreateSheet(salesSpreadsheet, monthName);
  const entryDate = formatDate(dateString);

  const rowInfo = findRowAndIndex(sheet, entryDate);
  const yesterdayInfo = findRowAndIndex(sheet, shiftDate(entryDate, -1));

  // Get yesterday's Cash in Hand (column H = 8)
  const yesterdayClosing = yesterdayInfo.rowIndex > 0
    ? sheet.getRange(yesterdayInfo.rowIndex, 8).getValue() || 0
    : 0;

  // Get today's cash withdrawal (column J = 10)
  const cashWithdrawal = rowInfo.rowIndex > 0
    ? sheet.getRange(rowInfo.rowIndex, 10).getValue() || 0
    : 0;

  // Get today's swiggy / zomato payout (columns F,G)
  const swiggyPayout = rowInfo.rowIndex > 0
    ? sheet.getRange(rowInfo.rowIndex, 6).getValue() || 0
    : 0;
  const zomatoPayout = rowInfo.rowIndex > 0
    ? sheet.getRange(rowInfo.rowIndex, 7).getValue() || 0
    : 0;

  // Get today's total cash expenses (column L = 12)
  const todayCashExpense = rowInfo.rowIndex > 0
    ? sheet.getRange(rowInfo.rowIndex, 12).getValue() || 0
    : 0;

  return {
    success: true,
    balance: {
      yesterdayClosing,
      todayCashExpense,
      cashWithdrawal,
      swiggyPayout,
      zomatoPayout,
    },
  };
}

// ---- Sync Helpers ----
function syncExpenseToDailyAccount(entryDate, totalExpense, paymentMethod) {
  const salesSpreadsheet = getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
  const monthName = getMonthName(entryDate);
  const sheet = getOrCreateSheet(salesSpreadsheet, monthName);

  ensureSalesHeaders(sheet);

  const rowIndex = findOrCreateRow(sheet, entryDate);
  const expenseCashCol = 12; // Column L
  const expenseBankCol = 13; // Column M

  if (paymentMethod === 'bank') {
    sheet.getRange(rowIndex, expenseCashCol).setValue(0);
    sheet.getRange(rowIndex, expenseBankCol).setValue(totalExpense);
  } else {
    sheet.getRange(rowIndex, expenseCashCol).setValue(totalExpense);
    sheet.getRange(rowIndex, expenseBankCol).setValue(0);
  }

  sheet.getRange(rowIndex, 14).setFormula(`=L${rowIndex}+M${rowIndex}`); // Total Expense (Column N)
  // Profit formula already set in buildSalesRowData
}

// ---- Sheet Utilities ----
function ensureExpenseHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;

  const headers = [
    'Date',
    ...EXPENSE_CATEGORIES,
    'Fruit_Sum',
    'Total Expense',
    'Payment Method',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet);
}

function ensureSalesHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;

  const headers = [
    'Date', 'Cash Sale', 'Bank Sale', 'Swiggy', 'Zomato',
    'Swiggy Payout', 'Zomato Payout', 'Cash in hand', 'Cash in bank',
    'Cash Withdrawal', 'Total Sale', 'Expense Cash', 'Expense Bank',
    'Total Expense', 'Profit', 'Difference',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaderRow(sheet);
}

function findOrCreateRow(sheet, entryDate) {
  const info = findRowAndIndex(sheet, entryDate);
  if (info.rowIndex > 0) {
    return info.rowIndex;
  }

  // New date not found, add at end (before TOTAL row will be handled by updateMonthTotals)
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  sheet.getRange(newRow, 1).setValue(entryDate);
  return newRow;
}

function findRowAndIndex(sheet, entryDate) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { rowIndex: -1 };
  }

  const dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < dates.length; i++) {
    if (!dates[i][0]) continue;
    const cellDate = formatDate(dates[i][0]);
    if (
      cellDate.getFullYear() === entryDate.getFullYear() &&
      cellDate.getMonth() === entryDate.getMonth() &&
      cellDate.getDate() === entryDate.getDate()
    ) {
      return { rowIndex: i + 2 };
    }
  }

  return { rowIndex: -1 };
}

function formatExpenseRow(sheet, rowIndex) {
  sheet.getRange(rowIndex, 1).setNumberFormat('mmm d');
  const lastCol = sheet.getLastColumn();
  if (lastCol > 1) {
    // Format all number columns with rupee symbol (₹)
    sheet.getRange(rowIndex, 2, 1, lastCol - 1).setNumberFormat('"₹"#,##0.00');
  }
}

function formatSalesRow(sheet, rowIndex) {
  sheet.getRange(rowIndex, 1).setNumberFormat('mmm d');
  const lastCol = Math.min(sheet.getLastColumn(), 16); // Updated: 16 columns now (includes Cash Withdrawal)
  if (lastCol > 1) {
    // Format all number columns with rupee symbol (₹)
    sheet.getRange(rowIndex, 2, 1, lastCol - 1).setNumberFormat('"₹"#,##0.00');
  }
}


function updateMonthTotals(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return; // No data rows
  
  const lastCol = sheet.getLastColumn();
  
  // Delete ALL existing TOTAL rows first
  for (let i = lastRow; i >= 2; i--) {
    const cellValue = sheet.getRange(i, 1).getValue();
    if (cellValue && cellValue.toString().toUpperCase() === 'TOTAL') {
      sheet.deleteRow(i);
    }
  }
  
  // Now add fresh TOTAL row at the very end
  const currentLastRow = sheet.getLastRow();
  const totalsRow = currentLastRow + 1;
  
  // Add "TOTAL" label
  sheet.getRange(totalsRow, 1).setValue('TOTAL');
  sheet.getRange(totalsRow, 1).setFontWeight('bold');
  sheet.getRange(totalsRow, 1).setBackground('#FFD966');
  
  // Add SUM formulas for all numeric columns
  for (let col = 2; col <= lastCol; col++) {
    const columnLetter = getColumnLetter(col);
    // Sum from row 2 (after header) to currentLastRow (all data)
    sheet.getRange(totalsRow, col).setFormula(`=SUM(${columnLetter}2:${columnLetter}${currentLastRow})`);
    sheet.getRange(totalsRow, col).setFontWeight('bold');
    sheet.getRange(totalsRow, col).setBackground('#FFD966');
    sheet.getRange(totalsRow, col).setNumberFormat('"₹"#,##0.00');
  }
}

function formatHeaderRow(sheet) {
  const range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setBackground('#0d7a0d');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  range.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

function getOrCreateSpreadsheet(sheetId, sheetName) {
  if (sheetId && sheetId.trim()) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (error) {
      Logger.log(`Unable to open sheet ${sheetId}: ${error}`);
    }
  }
  return SpreadsheetApp.create(sheetName);
}

function getOrCreateSheet(spreadsheet, name) {
  const sheet = spreadsheet.getSheetByName(name);
  if (sheet) return sheet;
  return spreadsheet.insertSheet(name);
}

// ---- Helpers ----

function formatDate(dateInput) {
  const date = new Date(dateInput);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function shiftDate(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function getMonthName(dateString) {
  const date = new Date(dateString);
  const formatted = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMM yyyy');
  return formatted.toUpperCase(); // NOV 2024, DEC 2024, etc.
}

function getColumnLetter(index) {
  let letter = '';
  while (index > 0) {
    const mod = (index - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    index = Math.floor((index - 1) / 26);
  }
  return letter;
}

// ---- Monthly Summary ----
function getMonthlySummary(monthYear) {
  try {
    const salesSpreadsheet = getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
    const expensesSpreadsheet = getOrCreateSpreadsheet(EXPENSES_SHEET_ID, EXPENSES_SHEET_NAME);
    
    const monthName = monthYear || getMonthName(new Date().toISOString());
    
    // Get sales sheet data
    const salesSheet = salesSpreadsheet.getSheetByName(monthName);
    const expensesSheet = expensesSpreadsheet.getSheetByName(monthName);
    
    let totalSales = 0;
    let totalExpenses = 0;
    let cashSales = 0;
    let bankSales = 0;
    
    if (salesSheet && salesSheet.getLastRow() > 1) {
      const lastRow = salesSheet.getLastRow();
      
      // Check if last row is TOTAL, if so exclude it
      const lastRowLabel = salesSheet.getRange(lastRow, 1).getValue();
      const dataLastRow = lastRowLabel && lastRowLabel.toString().toUpperCase() === 'TOTAL' ? lastRow - 1 : lastRow;
      
      if (dataLastRow > 1) {
        // Get data from row 2 to last data row (excluding TOTAL if exists)
        // Updated column positions after removing Net Sale
        const totalSaleValues = salesSheet.getRange(2, 11, dataLastRow - 1, 1).getValues(); // Column K
        const totalExpenseValues = salesSheet.getRange(2, 14, dataLastRow - 1, 1).getValues(); // Column N
        const cashSaleValues = salesSheet.getRange(2, 2, dataLastRow - 1, 1).getValues();
        const bankSaleValues = salesSheet.getRange(2, 3, dataLastRow - 1, 1).getValues();
        
        for (let i = 0; i < totalSaleValues.length; i++) {
          totalSales += parseFloat(totalSaleValues[i][0]) || 0;
          totalExpenses += parseFloat(totalExpenseValues[i][0]) || 0;
          cashSales += parseFloat(cashSaleValues[i][0]) || 0;
          bankSales += parseFloat(bankSaleValues[i][0]) || 0;
        }
      }
    }
    
    const profit = totalSales - totalExpenses;
    
    return {
      success: true,
      summary: {
        month: monthName,
        totalSales,
        totalExpenses,
        profit,
        cashSales,
        bankSales,
        profitMargin: totalSales > 0 ? ((profit / totalSales) * 100).toFixed(2) : 0,
        expenseRatio: totalSales > 0 ? ((totalExpenses / totalSales) * 100).toFixed(2) : 0,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getEntries(sheetType, monthYear) {
  try {
    const normalizedType = (sheetType || 'sales').toLowerCase();
    const monthName = monthYear ? monthYear.toUpperCase() : getMonthName(new Date().toISOString());
    
    const isExpense = normalizedType === 'expenses';
    const spreadsheet = isExpense
      ? getOrCreateSpreadsheet(EXPENSES_SHEET_ID, EXPENSES_SHEET_NAME)
      : getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
      
    const sheet = spreadsheet.getSheetByName(monthName);
    if (!sheet) {
      return { success: true, headers: [], rows: [] };
    }
    
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      return { success: true, headers: [], rows: [] };
    }
    
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    if (lastRow <= 1) {
      return { success: true, headers, rows: [] };
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      const firstCell = row[0];
      if (typeof firstCell === 'string' && firstCell.toUpperCase() === 'TOTAL') {
        continue;
      }
      
      const formattedRow = row.map((value, index) => {
        if (index === 0 && value) {
          try {
            const dateValue = value instanceof Date ? value : new Date(value);
            if (!isNaN(dateValue.getTime())) {
              return Utilities.formatDate(dateValue, Session.getScriptTimeZone(), 'dd-MMM');
            }
          } catch (e) {
            return value;
          }
        }
        return value;
      });
      
      rows.push(formattedRow);
    }
    
    return {
      success: true,
      headers,
      rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString(),
    };
  }
}

function handleAdjustments(entry) {
  if (!entry || !entry.date) {
    return { success: false, error: 'Date is required' };
  }

  const salesSpreadsheet = getOrCreateSpreadsheet(SALES_SHEET_ID, SALES_SHEET_NAME);
  const monthName = getMonthName(entry.date);
  const sheet = getOrCreateSheet(salesSpreadsheet, monthName);

  ensureSalesHeaders(sheet);

  const entryDate = formatDate(entry.date);
  const rowIndex = findOrCreateRow(sheet, entryDate);

  if (entry.swiggyPayout !== undefined) {
    sheet.getRange(rowIndex, 6).setValue(parseFloat(entry.swiggyPayout) || 0);
  }

  if (entry.zomatoPayout !== undefined) {
    sheet.getRange(rowIndex, 7).setValue(parseFloat(entry.zomatoPayout) || 0);
  }

  if (entry.cashWithdrawal !== undefined) {
    const newWithdrawal = parseFloat(entry.cashWithdrawal) || 0;
    const currentNet = sheet.getRange(rowIndex, 8).getValue() || 0;
    const currentWithdrawal = sheet.getRange(rowIndex, 10).getValue() || 0;
    const actualCash = currentNet + currentWithdrawal;
    const updatedNet = actualCash - newWithdrawal;
    sheet.getRange(rowIndex, 10).setValue(newWithdrawal);
    sheet.getRange(rowIndex, 8).setValue(updatedNet);
  }

  formatSalesRow(sheet, rowIndex);
  updateMonthTotals(sheet);

  return { success: true, message: 'Adjustments saved' };
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
