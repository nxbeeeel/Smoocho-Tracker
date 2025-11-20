/**
 * Dashboard Page - Simple summary view with download
 * Mobile and tablet optimized
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '../utils/calculations';
import { getCurrentDate, normalizeMonthValue } from '../utils/dateFormatter';
import { getMonthlySummary, isReady } from '../services/appsScriptService';
import { getCachedData, cacheData, CACHE_KEYS } from '../services/cacheService';
import { Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDate().substring(0, 7)); // YYYY-MM format
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
    expenseRatio: '0.0',
    profitMargin: '0.0',
    cashSales: 0,
    bankSales: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isReady() && selectedMonth) {
      fetchSummary();
    }
  }, [selectedMonth]);

  const fetchSummary = async () => {
    const { value: safeMonthValue, date } = normalizeMonthValue(selectedMonth);
    if (safeMonthValue !== selectedMonth) {
      setSelectedMonth(safeMonthValue);
    }
    const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    
    // Try to get cached data first for instant display
    const cached = getCachedData(`${CACHE_KEYS.SALES_DATA}_${monthName}`);
    if (cached) {
      setSummaryData(cached);
    }
    
    setLoading(true);
    setError(null);
    try {
      const summary = await getMonthlySummary(monthName);
      if (summary) {
        setSummaryData(summary);
        // Cache the fresh data
        cacheData(`${CACHE_KEYS.SALES_DATA}_${monthName}`, summary);
      } else {
        if (!cached) {
          setError('No data found for this month');
        }
      }
    } catch (err) {
      if (!cached) {
        setError('Failed to load summary. Please try again.');
      }
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Open the sales sheet for download as Excel
    const salesSheetUrl = `https://docs.google.com/spreadsheets/d/1sNeX9Ex7eZdiqpJ7sMWHpfc2FpIZcbruRwLPZxQVSi0/export?format=xlsx`;
    window.open(salesSheetUrl, '_blank');
  };

  const handlePreviousMonth = () => {
    const { date } = normalizeMonthValue(selectedMonth);
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date.toISOString().substring(0, 7));
  };

  const handleNextMonth = () => {
    const { date } = normalizeMonthValue(selectedMonth);
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(date.toISOString().substring(0, 7));
  };

  const getMonthDisplay = () => {
    const { date } = normalizeMonthValue(selectedMonth);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">📊 Dashboard</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Real-time sales and expense summary</CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Month Navigator with Download */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePreviousMonth}
                variant="outline"
                size="lg"
                className="h-14 px-4"
                disabled={loading}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <div className="flex-1 text-center relative">
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {getMonthDisplay()}
                </div>
                <div className="relative">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/95 text-base text-center text-slate-900 shadow-[var(--glass-shadow-sm)] cursor-pointer"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              
              <Button
                onClick={handleNextMonth}
                variant="outline"
                size="lg"
                className="h-14 px-4"
                disabled={loading}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Download Button */}
            <Button 
              onClick={handleDownload}
              className="w-full h-12 text-base font-bold"
              variant="outline"
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Monthly Report (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading real-time data...</p>
        </div>
      )}

      {/* Summary Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Sales Card */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {formatCurrency(summaryData.totalSales)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">For selected month</p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-destructive">
              {formatCurrency(summaryData.totalExpenses)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">All expenses combined</p>
          </CardContent>
        </Card>

        {/* Profit Card - Full Width on Mobile */}
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl sm:text-4xl font-bold ${
              summaryData.profit >= 0 ? 'text-green-600' : 'text-destructive'
            }`}>
              {formatCurrency(summaryData.profit)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Sales - Expenses = Profit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs sm:text-sm text-muted-foreground">Expense Ratio</span>
              <span className="font-semibold text-sm sm:text-base">
                {summaryData.expenseRatio}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs sm:text-sm text-muted-foreground">Profit Margin</span>
              <span className="font-semibold text-green-600 text-sm sm:text-base">
                {summaryData.profitMargin}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
