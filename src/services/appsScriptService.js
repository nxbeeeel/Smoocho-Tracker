/**
 * Apps Script Service
 * Makes HTTP calls to Google Apps Script web app (no credentials needed)
 */
import { getAppsScriptUrl, saveOffline } from '../utils/storage';

let appsScriptUrl = null;

/**
 * Initialize with Apps Script URL
 */
export const initialize = (url) => {
  appsScriptUrl = url;
};

/**
 * Check if initialized
 */
export const isReady = () => {
  return !!appsScriptUrl || !!getAppsScriptUrl();
};

/**
 * Make request to Apps Script
 * Uses no-cors mode for Apps Script URLs (CORS not supported from localhost)
 */
const makeRequest = async (data) => {
  const url = appsScriptUrl || getAppsScriptUrl();
  if (!url) {
    throw new Error('Apps Script URL not configured. Please complete setup.');
  }

  try {
    // Apps Script web apps don't support CORS from localhost
    // Use no-cors mode (fire and forget)
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain', // Use text/plain to avoid CORS preflight
      },
      body: JSON.stringify(data),
    });
    
    // In no-cors mode, we can't read the response
    // Apps Script will process the request in the background
    return { success: true };
  } catch (error) {
    console.error('Failed to submit to Apps Script:', error);
    throw error;
  }
};

/**
 * Submit expense entry
 */
export const submitExpense = async (entry) => {
  try {
    await makeRequest({
      type: 'expense',
      entry,
    });
    return true;
  } catch (error) {
    // Save offline if request fails
    saveOffline('expense', entry);
    throw error;
  }
};

/**
 * Submit sales entry
 */
export const submitSales = async (entry) => {
  try {
    await makeRequest({
      type: 'sales',
      entry,
    });
    return true;
  } catch (error) {
    // Save offline if request fails
    saveOffline('sales', entry);
    throw error;
  }
};

export const submitAdjustments = async (entry) => {
  try {
    await makeRequest({
      type: 'adjustments',
      entry,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Get cash balance information for a date
 */
export const getCashBalance = async (date) => {
  const url = appsScriptUrl || getAppsScriptUrl();
  if (!url) {
    console.error('No Apps Script URL configured');
    return null;
  }

  try {
    // Use GET request for cash balance (easier to debug)
    const response = await fetch(`${url}?type=cashBalance&date=${date}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Cash balance result:', result);
    
    if (result.success && result.balance) {
      return result.balance;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get cash balance:', error);
    // Return default values instead of null
    return {
      yesterdayClosing: 0,
      todayCashExpense: 0,
    };
  }
};

/**
 * Get monthly summary
 */
export const getMonthlySummary = async (month) => {
  const url = appsScriptUrl || getAppsScriptUrl();
  if (!url) {
    console.error('No Apps Script URL configured');
    return null;
  }

  try {
    const response = await fetch(`${url}?type=monthlySummary&month=${encodeURIComponent(month)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.success && result.summary) {
      return result.summary;
    }

    return null;
  } catch (error) {
    console.error('Failed to get monthly summary:', error);
    return null;
  }
};

export const getEntriesData = async (sheetType, month) => {
  const url = appsScriptUrl || getAppsScriptUrl();
  if (!url) {
    console.error('No Apps Script URL configured');
    return null;
  }

  try {
    const response = await fetch(
      `${url}?type=entries&sheet=${encodeURIComponent(sheetType)}&month=${encodeURIComponent(month)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.success) {
      return {
        headers: result.headers || [],
        rows: result.rows || [],
      };
    }

    throw new Error(result.error || 'Unknown error fetching entries');
  } catch (error) {
    console.error('Failed to get entries:', error);
    throw error;
  }
};

/**
 * Preload current month data for caching
 */
export const preloadMonthData = async () => {
  try {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    
    // Fetch summary in background (fire and forget)
    getMonthlySummary(monthName).catch(() => {});
    
    // Fetch cash balance for today
    const today = currentDate.toISOString().substring(0, 10);
    getCashBalance(today).catch(() => {});
    
    return true;
  } catch (error) {
    console.error('Preload failed:', error);
    return false;
  }
};

