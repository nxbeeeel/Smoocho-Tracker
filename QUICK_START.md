# 🚀 Quick Start Guide

## Step 1: Share Your Google Sheets

You have two sheets:
- **Expenses Sheet**: `1E_cql_XMCl1SBNTW-NV3gDl4yugMAMAxQ9CMATTo3nk`
- **Daily Sales Sheet**: `1sNeX9Ex7eZdiqpJ7sMWHpfc2FpIZcbruRwLPZxQVSi0`

**Action Required:**
1. Open each Google Sheet
2. Click "Share" button (top right)
3. Add your service account email (from JSON credentials)
4. Give **Editor** access
5. Click "Send"

## Step 2: Run the App

```bash
npm run dev
```

## Step 3: First-Time Setup

1. **Enter Staff Name** (first time only - saved in browser)
2. **Configure Google Sheets**:
   - Click "⚙️ Setup" in navigation
   - Paste your Service Account JSON credentials
   - Enter Sales Sheet ID: `1sNeX9Ex7eZdiqpJ7sMWHpfc2FpIZcbruRwLPZxQVSi0`
   - Enter Expenses Sheet ID: `1E_cql_XMCl1SBNTW-NV3gDl4yugMAMAxQ9CMATTo3nk`
   - Click "Connect"

## Step 4: Start Using

- **Sales Entry**: Click "📊 Sales" → Enter daily sales → Save
- **Expense Entry**: Click "💸 Expense" → Enter expense or scan receipt → Save

## Features Working:

✅ **AI Receipt Scanner** - Upload photo, auto-fills amount & category
✅ **Smart Suggestions** - AI suggests common amounts and categories
✅ **Anomaly Detection** - Flags unusual entries
✅ **Daily Insights** - Shows today's summary with AI analysis
✅ **Offline Mode** - Works without internet, syncs when online
✅ **Auto Sync** - Sync button appears when offline data exists

## Troubleshooting

- **"Google Sheets not initialized"**: Complete setup first
- **"Cannot access sheets"**: Make sure sheets are shared with service account
- **Data not syncing**: Check internet connection, click sync button
- **Build errors**: Run `npm install` then `npm run build`

Everything is production-ready and fully functional! 🎉

