# Smoocho Daily Sales & Expense Tracker - Architecture

## System Overview

A minimal, fast, staff-friendly web app for daily sales and expense tracking with AI receipt scanning.

## Tech Stack

- **Frontend**: React 18 + Vite (fast, modern, lightweight)
- **Styling**: Tailwind CSS (utility-first, mobile-optimized)
- **OCR**: Tesseract.js (browser-based, no backend needed)
- **Storage**: Google Sheets API (real-time sync)
- **Offline**: localStorage (draft saving)
- **Deployment**: Vercel (simple, fast)

## Component Structure

```
src/
├── App.jsx                 # Main router
├── pages/
│   ├── SalesEntry.jsx      # Daily sales input page
│   └── ExpenseEntry.jsx    # Daily expense input page
├── components/
│   ├── ReceiptScanner.jsx  # OCR receipt upload component
│   ├── StaffNameInput.jsx  # Staff name input (first time)
│   └── OfflineIndicator.jsx # Connection status
├── services/
│   ├── googleSheets.js     # Google Sheets API integration
│   └── storage.js          # localStorage utilities
├── utils/
│   ├── calculations.js     # Auto-calculations
│   └── dateFormatter.js    # Date/time formatting
└── constants/
    └── colors.js           # Smoocho theme colors
```

## Google Sheets Schema

### Sales Sheet
| Date | Time | Staff Name | Cash Sales | Online/UPI Sales | Swiggy Sales | Zomato Sales | Total Sales | Cash Balance | Difference |
|------|------|------------|------------|-----------------|--------------|--------------|-------------|--------------|------------|

### Expenses Sheet
| Date | Time | Staff Name | Amount | Category | Note | Receipt Image URL |
|------|------|------------|--------|----------|------|-------------------|

## Data Flow

1. Staff enters data → Form validation
2. Data saved to localStorage (offline backup)
3. Google Sheets API call (if online)
4. Success confirmation
5. Form reset

## Features

- ✅ No login required
- ✅ Staff name saved in localStorage
- ✅ Auto-calculations
- ✅ AI receipt OCR
- ✅ Offline mode
- ✅ Mobile-first design
- ✅ Fast, simple UI

