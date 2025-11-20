# Google Cloud Service Account Setup - Detailed Guide

This guide will walk you through creating a Service Account and downloading the JSON credentials file.

## Prerequisites
- A Google account (Gmail account works fine)
- Access to Google Cloud Console

---

## Step 1: Go to Google Cloud Console

1. Open your web browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account if prompted

---

## Step 2: Create or Select a Project

### Option A: Create a New Project (Recommended for first time)

1. Click on the **project dropdown** at the top of the page (it might say "Select a project" or show a project name)
2. Click **"New Project"** button
3. Enter a project name (e.g., "Smoocho Expense Tracker")
4. Click **"Create"**
5. Wait a few seconds for the project to be created
6. Select your new project from the dropdown

### Option B: Use Existing Project

1. Click on the **project dropdown** at the top
2. Select an existing project from the list

---

## Step 3: Enable Google Sheets API

1. In the left sidebar, click **"APIs & Services"** (or search for it in the top search bar)
2. Click **"Library"** (in the left menu)
3. In the search box, type: **"Google Sheets API"**
4. Click on **"Google Sheets API"** from the results
5. Click the blue **"Enable"** button
6. Wait for it to enable (you'll see a green checkmark when done)

---

## Step 4: Create a Service Account

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**
2. At the top of the page, click **"+ CREATE CREDENTIALS"**
3. From the dropdown menu, select **"Service account"**

### Fill in Service Account Details:

4. **Service account name**: Enter a name (e.g., "smoocho-expense-tracker")
5. **Service account ID**: This will auto-fill (you can leave it as is)
6. **Description** (optional): "Service account for Smoocho Expense Tracker"
7. Click **"Create and Continue"**

### Grant Access (Optional - You can skip this):

8. On the "Grant this service account access to project" page:
   - You can **skip this step** by clicking **"Continue"** at the bottom
   - Or assign a role if you want (not required for our use case)
9. Click **"Done"**

---

## Step 5: Create and Download JSON Key

1. You should now see your service account in the list
2. **Click on the service account name** (the email address) to open it

### Create Key:

3. Click on the **"Keys"** tab (at the top)
4. Click **"Add Key"** → **"Create new key"**
5. A dialog box will appear:
   - Select **"JSON"** (should be selected by default)
   - Click **"Create"**
6. **The JSON file will automatically download** to your computer
   - Usually goes to your "Downloads" folder
   - File name looks like: `your-project-123456-abc123def456.json`

---

## Step 6: Find Your Service Account Email

1. **Open the downloaded JSON file** in a text editor (Notepad, VS Code, etc.)
2. Look for the field `"client_email"` in the file
3. It will look something like:
   ```json
   "client_email": "smoocho-expense-tracker@your-project.iam.gserviceaccount.com"
   ```
4. **Copy this email address** - this is what you'll use to share your Google Sheet

---

## Step 7: Share Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1eIu6vmqLEJRdsH-TGkymQVeuuPkOrbkCW2hZckO1ssU/edit
2. Click the **"Share"** button (top right, blue button)
3. In the "Share with people and groups" box:
   - **Paste the service account email** (from Step 6)
   - Change permission from "Viewer" to **"Editor"**
   - Click **"Send"**
   - (You can uncheck "Notify people" if you want)
4. Click **"Done"**

---

## Step 8: Use in Your App

1. Open your Smoocho Expense Tracker app (http://localhost:5173)
2. On the Setup page:
   - **Service Account Credentials**: Open your JSON file, select all (Ctrl+A), copy (Ctrl+C), and paste it here
   - **Google Sheet ID**: `1eIu6vmqLEJRdsH-TGkymQVeuuPkOrbkCW2hZckO1ssU`
3. Click **"Connect to Google Sheets"**

---

## Troubleshooting

### "Failed to enable API"
- Make sure you're signed in with a Google account
- Try refreshing the page and enabling again

### "Cannot find Credentials"
- Make sure you're in the correct project (check the project dropdown at top)
- Go to: APIs & Services → Credentials

### "JSON file won't download"
- Check your browser's download settings
- Try a different browser
- Check if pop-up blocker is enabled

### "Cannot access sheet" error in app
- Make sure you shared the sheet with the service account email
- Verify the permission is set to "Editor" (not "Viewer")
- Double-check the email address matches exactly

### "Invalid credentials" error
- Make sure you copied the ENTIRE JSON file contents
- Don't modify the JSON file
- Make sure there are no extra spaces or characters

---

## Security Note

⚠️ **Important**: Keep your JSON credentials file secure!
- Don't share it publicly
- Don't commit it to GitHub or version control
- The app stores it in browser localStorage (only on your computer)

---

## Quick Checklist

- [ ] Created/selected a Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created a Service Account
- [ ] Downloaded the JSON key file
- [ ] Found the `client_email` in the JSON file
- [ ] Shared Google Sheet with service account email (Editor access)
- [ ] Pasted JSON and Sheet ID in the app setup

---

**You're all set!** Once you complete these steps, your app will be able to read and write to your Google Sheet automatically.

