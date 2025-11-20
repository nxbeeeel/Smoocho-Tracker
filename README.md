# 🍓 Smoocho Daily Sales & Expense Tracker

A minimal, fast, staff-friendly web app for daily sales and expense tracking with AI receipt scanning.

## ✨ Features

- ✅ **No Login Required** - Staff name saved in browser
- ✅ **Two Simple Pages** - Sales Entry & Expense Entry
- ✅ **AI Receipt Scanner** - Upload receipt photo, auto-fills amount and category
- ✅ **Offline Mode** - Works without internet, syncs when online
- ✅ **Auto Calculations** - Total sales, differences calculated automatically
- ✅ **Mobile Optimized** - Big buttons, simple interface, 1-minute workflow
- ✅ **Smoocho Theme** - Strawberry Pink & Chocolate Brown colors

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📋 Setup Instructions

### 1. Create Google Sheets

Create **two** Google Sheets:

1. **Sales Sheet** - For daily sales entries
2. **Expenses Sheet** - For expense entries

### 2. Set Up Headers

#### Sales Sheet (Row 1):
```
Date | Time | Staff Name | Cash Sales | Online/UPI Sales | Swiggy Sales | Zomato Sales | Total Sales | Cash Balance | Difference
```

#### Expenses Sheet (Row 1):
```
Date | Time | Staff Name | Amount | Category | Note | Receipt Image URL
```

### 3. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Sheets API**
4. Create a **Service Account**
5. Download the JSON key file
6. **Share both Google Sheets** with the service account email (give **Editor** access)

### 4. Configure App (Optional)

The app works **offline by default**. To enable Google Sheets sync:

1. The app will automatically detect saved credentials
2. If not configured, data is saved locally and can be synced later

## 📱 Usage

1. **First Visit**: Enter your name (saved in browser)
2. **Sales Entry**: Click "📊 Sales" → Enter daily sales → Save
3. **Expense Entry**: Click "💸 Expense" → Enter expense or scan receipt → Save

## 🎨 Design

- **Colors**: Strawberry Pink (#FF69B4) & Chocolate Brown (#8B4513)
- **Mobile-First**: Optimized for phones and tablets
- **Big Buttons**: Easy to tap on mobile
- **Simple UI**: Zero confusion, 1-minute workflow

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **OCR**: Tesseract.js (browser-based)
- **Storage**: Google Sheets API + localStorage
- **Deployment**: Vercel/Firebase Hosting

## 📁 Project Structure

```
src/
├── pages/
│   ├── SalesEntry.jsx      # Sales input page
│   └── ExpenseEntry.jsx     # Expense input page
├── components/
│   ├── ReceiptScanner.jsx   # AI receipt OCR
│   ├── StaffNameInput.jsx   # First-time name input
│   └── OfflineIndicator.jsx # Connection status
├── services/
│   └── googleSheets.js      # Google Sheets API
├── utils/
│   ├── storage.js           # localStorage utilities
│   ├── calculations.js      # Auto-calculations
│   └── dateFormatter.js     # Date/time formatting
└── constants/
    ├── colors.js            # Theme colors
    └── index.js             # App constants
```

## 🔧 Configuration

No environment variables needed! Everything works client-side.

## 📦 Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## 🐛 Troubleshooting

- **Check browser console** (F12) for errors
- **Verify Google Sheets** are shared with service account
- **Check network tab** for API errors
- **Offline data** is saved in localStorage

## 📝 License

Private - Smoocho Internal Use

---

**Made with ❤️ for Smoocho Team**
