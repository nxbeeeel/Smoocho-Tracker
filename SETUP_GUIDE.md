# Smoocho Tracker - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Google Sheets Setup

### Step 1: Create Google Sheets

Create two Google Sheets:

1. **Sales Sheet** - For daily sales entries
2. **Expenses Sheet** - For expense entries

### Step 2: Set Up Headers

#### Sales Sheet Headers (Row 1):
```
Date | Time | Staff Name | Cash Sales | Online/UPI Sales | Swiggy Sales | Zomato Sales | Total Sales | Cash Balance | Difference
```

#### Expenses Sheet Headers (Row 1):
```
Date | Time | Staff Name | Amount | Category | Note | Receipt Image URL
```

### Step 3: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Create a **Service Account**
5. Download the JSON key file
6. Share both Google Sheets with the service account email (Editor access)

### Step 4: Configure App

1. Open the app
2. First time: Enter staff name (saved in browser)
3. The app will work offline - data syncs when online

## Features

- ✅ **No Login Required** - Staff name saved in browser
- ✅ **Offline Mode** - Works without internet, syncs when online
- ✅ **AI Receipt Scanner** - Upload receipt photo, auto-fills amount and category
- ✅ **Auto Calculations** - Total sales, differences calculated automatically
- ✅ **Mobile Optimized** - Big buttons, simple interface
- ✅ **Fast & Simple** - 1-minute workflow

## Deployment

### Vercel

1. Push code to GitHub
2. Import to Vercel
3. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## Environment Variables

No environment variables needed - everything works client-side!

## Support

For issues, check:
- Browser console (F12)
- Network tab for API errors
- localStorage for saved data

