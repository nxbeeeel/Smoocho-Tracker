/**
 * Setup Page - Apps Script URL Configuration
 */
import { useState, useEffect } from 'react';
import { getAppsScriptUrl, saveAppsScriptUrl } from '../utils/storage';
import { initialize } from '../services/appsScriptService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SetupPage = ({ onComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = getAppsScriptUrl();
    if (saved) {
      setUrl(saved);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('Please enter Apps Script web app URL');
      setLoading(false);
      return;
    }

    // Validate URL format - check if it contains the Apps Script pattern
    const appsScriptPattern = /^https:\/\/script\.google\.com\/macros\/s\/[^\/\s]+\/exec/;
    if (!appsScriptPattern.test(trimmedUrl)) {
      setError('Invalid Apps Script URL. Should be in format: https://script.google.com/macros/s/.../exec');
      setLoading(false);
      return;
    }

    try {
      // Test the URL with GET first (simpler)
      const testResponse = await fetch(trimmedUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (!testResponse.ok) {
        throw new Error('Cannot connect to Apps Script. Please check the URL and ensure the web app is deployed.');
      }

      const testResult = await testResponse.json();
      if (!testResult.success) {
        throw new Error('Apps Script returned an error. Please check the deployment.');
      }

      // Save and initialize
      saveAppsScriptUrl(trimmedUrl);
      initialize(trimmedUrl);
      
      setSuccess(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to connect. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
          <CardDescription>Enter your Google Apps Script web app URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to get Apps Script URL:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Open APPS_SCRIPT_CODE.gs file in Google Apps Script</li>
              <li>Click "Deploy" → "New deployment"</li>
              <li>Select type: "Web app"</li>
              <li>Execute as: "Me"</li>
              <li>Who has access: "Anyone"</li>
              <li>Click "Deploy" and copy the web app URL</li>
            </ol>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>Connected successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Apps Script Web App URL</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://script.google.com/macros/s/..."
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
