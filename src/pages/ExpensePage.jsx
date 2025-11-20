/**
 * Expense Entry Page - Mobile Optimized with Premium Glass Design
 */
import { useState, useEffect } from 'react';
import { getCurrentDate } from '../utils/dateFormatter';
import { submitExpense } from '../services/appsScriptService';
import { getStaffName, saveOffline } from '../utils/storage';
import { EXPENSE_CATEGORIES, FRUIT_CATEGORIES } from '../constants';
import { isReady } from '../services/appsScriptService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeft, ChevronRight, Calendar, Wallet, Building2 } from 'lucide-react';

const ExpensePage = () => {
  const [date, setDate] = useState(getCurrentDate());
  const [activeTab, setActiveTab] = useState('fruits');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amount, setAmount] = useState('');
  const [misc, setMisc] = useState('');
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setStaffName(getStaffName());
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('');
    setAmount('');
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setAmount('');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!selectedCategory) {
      setMessage({ type: 'error', text: 'Please select a category' });
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setLoading(false);
      return;
    }

    try {
      const entry = {
        date,
        staffName: staffName || 'Unknown',
        paymentMethod,
        category: selectedCategory, // Send which category
        amount: parseFloat(amount) || 0, // Send the amount
      };

      if (isReady()) {
        try {
          await submitExpense(entry);
          setMessage({ type: 'success', text: 'Expense saved successfully!' });
        } catch (err) {
          setMessage({ type: 'warning', text: 'Saved offline. Will sync when online.' });
        }
      } else {
        saveOffline('expense', entry);
        setMessage({ type: 'warning', text: 'Saved offline. Please complete setup.' });
      }

      setTimeout(() => {
        setSelectedCategory('');
        setAmount('');
        setMessage(null);
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const otherCategories = EXPENSE_CATEGORIES.filter(cat => !FRUIT_CATEGORIES.includes(cat));

  return (
    <div className="space-y-3 pb-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">💰 Expense Entry</CardTitle>
          <CardDescription className="text-sm">Quick expense entry</CardDescription>
        </CardHeader>
      </Card>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : message.type === 'error' ? 'destructive' : 'warning'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">Date</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handlePreviousDay}
                  variant="outline"
                  className="h-11 w-11"
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
                    className="h-11 text-sm pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                
                <Button
                  type="button"
                  onClick={handleNextDay}
                  variant="outline"
                  className="h-11 w-11"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <Button
                  type="button"
                  onClick={handleToday}
                  variant="secondary"
                  className="h-11 px-3 text-xs font-bold"
                >
                  Today
                </Button>
              </div>
            </div>

            {/* Payment Method Selection - Enhanced Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className={`h-12 text-base font-semibold transition-all ${
                    paymentMethod === 'cash' 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'bg-background/60'
                  }`}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Cash
                  {paymentMethod === 'cash' && <span className="ml-2">✓</span>}
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('bank')}
                  className={`h-12 text-base font-semibold transition-all ${
                    paymentMethod === 'bank' 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'bg-background/60'
                  }`}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Bank
                  {paymentMethod === 'bank' && <span className="ml-2">✓</span>}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Selected: <span className="font-bold capitalize">{paymentMethod}</span>
              </p>
            </div>
            </div>

            {/* Category Selection - Tabs */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold block">Category</Label>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full h-12">
                  <TabsTrigger value="fruits" className="flex-1 text-sm font-semibold">
                    🍓 Fruits
                  </TabsTrigger>
                  <TabsTrigger value="others" className="flex-1 text-sm font-semibold">
                    📦 Others
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fruits" className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="fruitCategory" className="text-sm font-medium">Select Fruit</Label>
                    <Select
                      id="fruitCategory"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="h-11 text-sm"
                    >
                      <option value="">-- Choose fruit --</option>
                      {FRUIT_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="others" className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="otherCategory" className="text-sm font-medium">Select Category</Label>
                    <Select
                      id="otherCategory"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="h-11 text-sm"
                    >
                      <option value="">-- Choose category --</option>
                      {otherCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Amount Input - Shows when category is selected */}
            {selectedCategory && (
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold">
                  Amount for <span className="text-primary">{selectedCategory}</span> (₹)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  required
                  className="h-14 text-xl font-bold text-center"
                  autoFocus
                />
              </div>
            )}


            {/* Summary Card */}
            {selectedCategory && amount && (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-semibold">{selectedCategory}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-semibold capitalize">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-primary/20">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading || !selectedCategory || !amount} 
              className="w-full h-14 text-base font-semibold"
            >
              {loading ? '⏳ Saving...' : '💾 Save Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensePage;
