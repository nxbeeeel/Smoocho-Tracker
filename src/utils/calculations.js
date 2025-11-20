/**
 * Calculation utilities
 */

/**
 * Calculate total sale
 */
export const calculateTotalSale = (cashInHand, cashInBank, swiggy, zomato) => {
  return (parseFloat(cashInHand) || 0) + 
         (parseFloat(cashInBank) || 0) + 
         (parseFloat(swiggy) || 0) + 
         (parseFloat(zomato) || 0);
};

/**
 * Calculate net sale (after payouts)
 */
export const calculateNetSale = (totalSale, swiggyPayout, zomatoPayout) => {
  return totalSale - (parseFloat(swiggyPayout) || 0) - (parseFloat(zomatoPayout) || 0);
};

/**
 * Calculate profit
 */
export const calculateProfit = (netSale, totalExpense) => {
  return netSale - (parseFloat(totalExpense) || 0);
};

/**
 * Calculate total expense from category values
 */
export const calculateTotalExpense = (categoryValues) => {
  return Object.values(categoryValues).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
};

/**
 * Calculate fruit sum
 */
export const calculateFruitSum = (categoryValues) => {
  const fruitCategories = ['Kiwi', 'Strawberry', 'Mango', 'Robst', 'pinaple'];
  return fruitCategories.reduce((sum, cat) => {
    const key = cat.toLowerCase().replace(/\s+/g, '_');
    return sum + (parseFloat(categoryValues[key] || categoryValues[cat]) || 0);
  }, 0);
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

