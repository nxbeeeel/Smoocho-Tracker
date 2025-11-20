# Google Apps Script Setup Guide

## Step 1: Copy Apps Script Code

1. Open [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy the entire contents of `APPS_SCRIPT_CODE.gs` file
5. Paste into Apps Script editor

## Step 2: Update Sheet IDs (Optional)

The Sheet IDs are already set in the code:
- Expenses Sheet: `1E_cql_XMCl1SBNTW-NV3gDl4yugMAMAxQ9CMATTo3nk`
- Sales Sheet: `1sNeX9Ex7eZdiqpJ7sMWHpfc2FpIZcbruRwLPZxQVSi0`

If you need to change them, edit lines 7-8 in the Apps Script code.

## Step 3: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon (⚙️) next to "Select type"
3. Choose "Web app"
4. Set:
   - **Description**: "Smoocho Expense Tracker Backend"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click "Deploy"
6. **Copy the Web app URL** - you'll need this for the web app setup

## Step 4: Authorize the Script

1. When you first run it, Google will ask for authorization
2. Click "Review Permissions"
3. Choose your Google account
4. Click "Advanced" → "Go to [Project Name] (unsafe)"
5. Click "Allow"

## Step 5: Use in Web App

1. Open the web app
2. Go to Setup page
3. Paste the Apps Script Web app URL
4. Click "Connect"

## Security Benefits

- ✅ No credentials stored in browser
- ✅ All authentication handled by Google
- ✅ Apps Script runs on Google servers
- ✅ Much more secure than service account keys

## Troubleshooting

- **"Cannot connect"**: Make sure web app is deployed with "Anyone" access
- **"Authorization required"**: Run the script once manually to authorize
- **"Sheet not found"**: Check Sheet IDs in Apps Script code

