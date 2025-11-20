# Google Sheet Setup Guide

This guide will help you create a Google Sheet for the Smoocho Expense Tracker.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click on **"Blank"** to create a new spreadsheet
3. You can name it something like "Smoocho Expense Tracker" (optional - the app will create the necessary sheets automatically)

## Step 2: Get Your Sheet ID

1. Look at the URL in your browser's address bar
2. The URL will look like this:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
3. The **Sheet ID** is the long string of characters between `/d/` and `/edit`
   - In the example above, the Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
4. **Copy this Sheet ID** - you'll need it for the app setup

## Step 3: Share with Service Account

After you create your Google Cloud Service Account (see main README), you need to share this sheet with it:

1. Click the **"Share"** button (top right corner of your Google Sheet)
2. In the "Share with people and groups" dialog, paste the **service account email** (from your JSON credentials file, it looks like: `your-service-account@project-id.iam.gserviceaccount.com`)
3. Make sure to give it **"Editor"** access (not just Viewer)
4. Click **"Send"** (you can uncheck "Notify people" if you want)
5. Click **"Done"**

## Step 4: Use in the App

1. Open the Smoocho Expense Tracker app
2. On the Setup page, paste:
   - Your **Service Account JSON credentials** (the entire contents of the downloaded JSON file)
   - Your **Sheet ID** (from Step 2)
3. Click **"Connect to Google Sheets"**

## What Happens Next

The app will automatically create three sheets in your Google Sheet:

1. **DailyEntries** - Stores all daily entry data
2. **Payouts** - Stores Swiggy/Zomato payout records  
3. **MonthlySummary** - Auto-calculated monthly summaries and profits

You don't need to create these manually - the app will create them with the correct headers automatically!

## Troubleshooting

### "Cannot access sheet" error
- Make sure you shared the sheet with the service account email
- Verify the service account has **Editor** access (not Viewer)
- Double-check the Sheet ID is correct

### "Failed to initialize" error
- Verify your JSON credentials are complete and valid
- Make sure Google Sheets API is enabled in your Google Cloud project
- Check that the service account email matches the one you shared the sheet with

## Quick Checklist

- [ ] Created a new Google Sheet
- [ ] Copied the Sheet ID from the URL
- [ ] Created a Google Cloud Service Account
- [ ] Downloaded the JSON credentials file
- [ ] Shared the Google Sheet with the service account email (Editor access)
- [ ] Enabled Google Sheets API in Google Cloud Console
- [ ] Pasted credentials and Sheet ID in the app setup page

---

**Note:** The Google Sheet can be completely empty when you start - the app will create all necessary sheets and headers automatically!

