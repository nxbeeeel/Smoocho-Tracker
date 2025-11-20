/**
 * Entries Page - View and edit all entries
 * Mobile-optimized with inline editing
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '../utils/calculations';
import { isReady, getEntriesData } from '../services/appsScriptService';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const EntriesPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [salesEntries, setSalesEntries] = useState({ headers: [], rows: [] });
  const [expenseEntries, setExpenseEntries] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isReady()) {
      fetchEntries();
    }
  }, [selectedMonth]);

  const fetchEntries = async () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

    setLoading(true);
    setError(null);
    try {
      const [salesData, expenseData] = await Promise.all([
        getEntriesData('sales', monthName),
        getEntriesData('expenses', monthName),
      ]);

      setSalesEntries(salesData || { headers: [], rows: [] });
      setExpenseEntries(expenseData || { headers: [], rows: [] });
    } catch (err) {
      console.error('Failed to load entries:', err);
      setError('Failed to load entries. Please try again.');
      setSalesEntries({ headers: [], rows: [] });
      setExpenseEntries({ headers: [], rows: [] });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date.toISOString().substring(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(date.toISOString().substring(0, 7));
  };

  const renderTable = (data) => {
    if (!data.rows || data.rows.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-6">
          No entries found for this month.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted text-foreground">
              {data.headers.map((header, idx) => (
                <th key={idx} className="px-2 py-2 text-left font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border/40 hover:bg-muted/30">
                {row.map((cell, cellIdx) => (
                  <td key={`${rowIdx}-${cellIdx}`} className="px-2 py-2 whitespace-nowrap">
                    {typeof cell === 'number' ? formatCurrency(cell) : (cell || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">📋 Entered Data</CardTitle>
          <CardDescription className="text-sm">Live data pulled from Google Sheets</CardDescription>
        </CardHeader>
      </Card>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Month</label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handlePreviousMonth}
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background h-12 text-base text-center"
                style={{ color: '#000000' }}
              />
              <Button
                type="button"
                onClick={handleNextMonth}
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {!isReady() && (
            <Alert variant="warning">
              <AlertDescription>Connect to Apps Script in Setup to view entries.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Fetching entries...
        </div>
      )}

      {/* Tabs for Sales/Expenses */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-14">
          <TabsTrigger value="sales" className="text-base font-bold flex-1">
            💰 Sales Entries
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-base font-bold flex-1">
            💸 Expense Entries
          </TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardContent className="pt-6">
              {renderTable(salesEntries)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardContent className="pt-6">
              {renderTable(expenseEntries)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EntriesPage;

