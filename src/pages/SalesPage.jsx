/**
 * Sales Entry Page - With Cash Sale, Bank Sale, and Cash Balance Tracking
 * Mobile-optimized with clear buttons
 */
import { useState, useEffect } from 'react';
import { getCurrentDate } from '../utils/dateFormatter';
import { submitSales, submitExpense, getCashBalance } from '../services/appsScriptService';
import { getStaffName, saveOffline } from '../utils/storage';
import { calculateTotalSale, calculateNetSale, formatCurrency } from '../utils/calculations';
import { isReady } from '../services/appsScriptService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import HeroSection from '@/components/HeroSection';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const SalesPage = () => {
  const [date, setDate] = useState(getCurrentDate());
  const [cashSale, setCashSale] = useState('');
  const [bankSale, setBankSale] = useState('');
  const [cashInHand, setCashInHand] = useState('');
  const [cashInBank, setCashInBank] = useState('');
  const [cashWithdrawal, setCashWithdrawal] = useState('');
  const [swiggy, setSwiggy] = useState('');
  const [zomato, setZomato] = useState('');
  const [swiggyPayout, setSwiggyPayout] = useState('');
  const [zomatoPayout, setZomatoPayout] = useState('');
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [cashBalance, setCashBalance] = useState(null);
  
  // Quick expense fields
  const [oil, setOil] = useState('');
  const [waterCan, setWaterCan] = useState('');
  const [water, setWater] = useState('');
  const [miscExpense, setMiscExpense] = useState('');

  useEffect(() => {
    setStaffName(getStaffName());
  }, []);

  useEffect(() => {
    if (isReady() && date) {
      fetchCashBalance();
    }
  }, [date]);

  const fetchCashBalance = async () => {
    try {
      console.log('Fetching cash balance for date:', date);
      const balance = await getCashBalance(date);
      console.log('Cash balance received:', balance);
      
      if (balance) {
        setCashBalance(balance);
        if (typeof balance.cashWithdrawal !== 'undefined') {
          setCashWithdrawal(balance.cashWithdrawal ? String(balance.cashWithdrawal) : '');
        }
      } else {
        // Set default if no data
        setCashBalance({
          yesterdayClosing: 0,
          todayCashExpense: 0,
          cashWithdrawal: 0,
        });
        setCashWithdrawal('');
      }
    } catch (err) {
      console.error('Failed to fetch cash balance:', err);
      setCashBalance({
        yesterdayClosing: 0,
        todayCashExpense: 0,
        cashWithdrawal: 0,
      });
      setCashWithdrawal('');
    }
  };

  // Calculate totals
  const cashBankTotal = (parseFloat(cashSale) || 0) + (parseFloat(bankSale) || 0);
  const totalSaleWithPlatforms = cashBankTotal + (parseFloat(swiggy) || 0) + (parseFloat(zomato) || 0);
  const netSale = calculateNetSale(totalSaleWithPlatforms, swiggyPayout, zomatoPayout);
  
  const yesterdayClosing = cashBalance?.yesterdayClosing || 0;
  const todayCashSale = parseFloat(cashSale) || 0;
  const todayCashExpense = cashBalance?.todayCashExpense || 0;
  const withdrawalAmount = parseFloat(cashWithdrawal) || 0;
  const enteredCashInHand = parseFloat(cashInHand) || 0;
  const cashAfterWithdrawal = enteredCashInHand - withdrawalAmount;
  
  // Add quick expenses to total cash expense
  const quickExpenses = (parseFloat(oil) || 0) + (parseFloat(waterCan) || 0) + 
                        (parseFloat(water) || 0) + (parseFloat(miscExpense) || 0);
  const totalCashExpense = todayCashExpense + quickExpenses;
  
  const todayCashBalance = yesterdayClosing + todayCashSale - totalCashExpense;
  const cashCheckValue = todayCashBalance - cashAfterWithdrawal;

  const handlePreviousDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    setDate(currentDate.toISOString().substring(0, 10));
  };

  const handleNextDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    setDate(currentDate.toISOString().substring(0, 10));
  };

  const handleToday = () => {
    setDate(getCurrentDate());
  };

  const handleClearAll = () => {
    setCashSale('');
    setBankSale('');
    setCashInHand('');
    setCashInBank('');
    setCashWithdrawal('');
    setSwiggy('');
    setZomato('');
    setSwiggyPayout('');
    setZomatoPayout('');
    setOil('');
    setWaterCan('');
    setWater('');
    setMiscExpense('');
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const entry = {
        date,
        staffName: staffName || 'Unknown',
        cashSale: parseFloat(cashSale) || 0,
        bankSale: parseFloat(bankSale) || 0,
        cashInHand: parseFloat(cashInHand) || 0,
        cashInBank: parseFloat(cashInBank) || 0,
        cashWithdrawal: parseFloat(cashWithdrawal) || 0,
        swiggy: parseFloat(swiggy) || 0,
        zomato: parseFloat(zomato) || 0,
        swiggyPayout: parseFloat(swiggyPayout) || 0,
        zomatoPayout: parseFloat(zomatoPayout) || 0,
      };

      if (isReady()) {
        try {
          await submitSales(entry);
          
          // Also submit quick expenses if any
          if (quickExpenses > 0) {
            const expensePromises = [];
            
            if (parseFloat(oil) > 0) {
              expensePromises.push(submitExpense({
                date, staffName: staffName || 'Unknown', paymentMethod: 'cash',
                category: 'Oil', amount: parseFloat(oil)
              }));
            }
            if (parseFloat(waterCan) > 0) {
              expensePromises.push(submitExpense({
                date, staffName: staffName || 'Unknown', paymentMethod: 'cash',
                category: 'Water Can', amount: parseFloat(waterCan)
              }));
            }
            if (parseFloat(water) > 0) {
              expensePromises.push(submitExpense({
                date, staffName: staffName || 'Unknown', paymentMethod: 'cash',
                category: 'Water Bottle', amount: parseFloat(water)
              }));
            }
            if (parseFloat(miscExpense) > 0) {
              expensePromises.push(submitExpense({
                date, staffName: staffName || 'Unknown', paymentMethod: 'cash',
                category: 'Misc', amount: parseFloat(miscExpense)
              }));
            }
            
            await Promise.all(expensePromises);
          }
          
          setMessage({ type: 'success', text: 'Sales and expenses saved successfully!' });
          setTimeout(() => fetchCashBalance(), 1000);
        } catch (err) {
          setMessage({ type: 'warning', text: 'Saved offline. Will sync when online.' });
        }
      } else {
        saveOffline('sales', entry);
        setMessage({ type: 'warning', text: 'Saved offline. Please complete setup.' });
      }

      setTimeout(() => {
        handleClearAll();
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const compactInputClass = "h-11 text-sm";

  return (
    <div className="space-y-3 sm:space-y-5 max-w-4xl mx-auto pb-10">
      <HeroSection />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Daily Sales Entry</CardTitle>
          <CardDescription className="text-sm">Enter today's sales information</CardDescription>
        </CardHeader>
      </Card>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : message.type === 'error' ? 'destructive' : 'warning'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-semibold">Date</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handlePreviousDay}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="h-12 text-base pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                
                <Button
                  type="button"
                  onClick={handleNextDay}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <Button
                  type="button"
                  onClick={handleToday}
                  variant="secondary"
                  size="lg"
                  className="h-12 px-4 text-sm font-bold"
                >
                  Today
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="cashSale" className="text-sm font-semibold">Cash Sale (₹)</Label>
                <Input
                  id="cashSale"
                  type="text"
                  inputMode="decimal"
                  value={cashSale}
                  onChange={(e) => setCashSale(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bankSale" className="text-sm font-semibold">Bank Sale (₹)</Label>
                <Input
                  id="bankSale"
                  type="text"
                  inputMode="decimal"
                  value={bankSale}
                  onChange={(e) => setBankSale(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cashInHand" className="text-sm font-semibold">Cash in hand (₹)</Label>
                <Input
                  id="cashInHand"
                  type="text"
                  inputMode="decimal"
                  value={cashInHand}
                  onChange={(e) => setCashInHand(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cashInBank" className="text-sm font-semibold">Cash in bank (₹)</Label>
                <Input
                  id="cashInBank"
                  type="text"
                  inputMode="decimal"
                  value={cashInBank}
                  onChange={(e) => setCashInBank(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cashWithdrawal" className="text-sm font-semibold">Cash Withdrawal (₹)</Label>
                <Input
                  id="cashWithdrawal"
                  type="text"
                  inputMode="decimal"
                  value={cashWithdrawal}
                  onChange={(e) => setCashWithdrawal(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="swiggy" className="text-sm font-semibold">Swiggy (₹)</Label>
                <Input
                  id="swiggy"
                  type="text"
                  inputMode="decimal"
                  value={swiggy}
                  onChange={(e) => setSwiggy(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zomato" className="text-sm font-semibold">Zomato (₹)</Label>
                <Input
                  id="zomato"
                  type="text"
                  inputMode="decimal"
                  value={zomato}
                  onChange={(e) => setZomato(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="swiggyPayout" className="text-sm font-semibold">Swiggy Payout (₹)</Label>
                <Input
                  id="swiggyPayout"
                  type="text"
                  inputMode="decimal"
                  value={swiggyPayout}
                  onChange={(e) => setSwiggyPayout(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zomatoPayout" className="text-sm font-semibold">Zomato Payout (₹)</Label>
                <Input
                  id="zomatoPayout"
                  type="text"
                  inputMode="decimal"
                  value={zomatoPayout}
                  onChange={(e) => setZomatoPayout(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className={compactInputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
            {/* Quick Cash Expenses */}
            <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-slate-900 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg text-slate-900">💰 Quick Cash Expenses</CardTitle>
                <CardDescription className="text-xs text-slate-600">Enter common daily expenses</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="oil" className="text-sm font-semibold">Oil (₹)</Label>
                    <Input
                      id="oil"
                      type="text"
                      inputMode="decimal"
                      value={oil}
                      onChange={(e) => setOil(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="waterCan" className="text-sm font-semibold">Water Can (₹)</Label>
                    <Input
                      id="waterCan"
                      type="text"
                      inputMode="decimal"
                      value={waterCan}
                      onChange={(e) => setWaterCan(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="water" className="text-sm font-semibold">Water Bottle (₹)</Label>
                    <Input
                      id="water"
                      type="text"
                      inputMode="decimal"
                      value={water}
                      onChange={(e) => setWater(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="miscExpense" className="text-sm font-semibold">Misc (₹)</Label>
                    <Input
                      id="miscExpense"
                      type="text"
                      inputMode="decimal"
                      value={miscExpense}
                      onChange={(e) => setMiscExpense(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
                {quickExpenses > 0 && (
                  <div className="mt-3 p-2 bg-orange-100 dark:bg-orange-900 rounded text-center">
                    <span className="text-sm font-semibold">Total: {formatCurrency(quickExpenses)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cash Balance Calculation */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-slate-900 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900">💰 Cash Balance Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Sales Summary */}
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">TODAY'S SALES</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-700">Cash + Bank Sale</span>
                    <span className="font-bold text-sm text-slate-900">{formatCurrency(cashBankTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-700">Total (with Swiggy/Zomato)</span>
                    <span className="font-bold text-sm text-green-600">{formatCurrency(totalSaleWithPlatforms)}</span>
                  </div>
                </div>

                {/* Cash Balance Calculation */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">💼 Yesterday's Cash</span>
                  <span className="font-bold text-base text-purple-600 float-right">{formatCurrency(yesterdayClosing)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">+ Today's Cash Sale</span>
                  <span className="font-semibold text-green-600">+{formatCurrency(todayCashSale)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">- Today's Cash Expenses</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(totalCashExpense)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">- Cash Withdrawals</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(withdrawalAmount)}</span>
                </div>
                {quickExpenses > 0 && (
                  <div className="flex justify-between items-center pl-4">
                    <span className="text-xs text-muted-foreground">  (includes quick expenses)</span>
                    <span className="text-xs font-semibold text-red-500">-{formatCurrency(quickExpenses)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-300 dark:border-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900">Today's Cash in Hand (after withdrawal)</span>
                    <span className={`text-xl font-bold ${cashAfterWithdrawal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cashAfterWithdrawal)}
                    </span>
                  </div>
                  {withdrawalAmount > 0 && (
                    <p className="text-xs text-slate-600">
                      Entered cash: {formatCurrency(enteredCashInHand)} − withdrawal {formatCurrency(withdrawalAmount)}
                    </p>
                  )}
                </div>
                {cashInHand && (
                  <div className="pt-2 border-t border-blue-300 dark:border-blue-700 mt-2">
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-slate-700">Yesterday's Cash Balance</span>
                      <span className="font-semibold">{formatCurrency(yesterdayClosing)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                      <span className="text-sm font-bold">💸 Cash Check</span>
                      <span className={`text-lg font-bold ${
                        Math.abs(cashCheckValue) < 0.01 
                          ? 'text-green-600' 
                          : cashCheckValue > 0 
                            ? 'text-red-600' 
                            : 'text-blue-600'
                      }`}>
                        {formatCurrency(cashCheckValue)}
                      </span>
                    </div>
                    <p className="text-xs text-center mt-1 font-semibold">
                      {Math.abs(cashCheckValue) < 0.01 
                        ? '✅ Perfect! No money missing' 
                        : cashCheckValue > 0 
                          ? '⚠️ Money Missing (positive)' 
                          : '💰 Surplus Money (negative)'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Cash + Bank</div>
                <div className="text-xl font-bold">{formatCurrency(cashBankTotal)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Total (with platforms)</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(totalSaleWithPlatforms)}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearAll}
                className="flex-1 h-14 text-lg font-bold"
                disabled={loading}
              >
                🗑️ Clear All
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-14 text-lg font-bold" 
                size="lg"
              >
                {loading ? 'Saving...' : '💾 Save Sales Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
