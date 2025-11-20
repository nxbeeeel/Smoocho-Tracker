/**
 * Application Constants
 */

// Expense categories in exact order from your sheet
export const EXPENSE_CATEGORIES = [
  'Rent',
  'Staff',
  'Bake',
  'Store',
  'Biscoff',
  'Ice crm',
  'Oil',
  'Disposbl',
  'Smoocho Disposable',
  'Water Can',
  'Water Bottle',
  'Good Life',
  'Wipping',
  'Promotion',
  'Nuts',
  'Custard',
  'Kiwi',
  'Strawberry',
  'Mango',
  'Robst',
  'pinaple',
  'Misc',
];

// Fruit categories (for Fruit_Sum calculation)
export const FRUIT_CATEGORIES = ['Kiwi', 'Strawberry', 'Mango', 'Robst', 'pinaple'];

// Other categories (non-fruits)
export const OTHER_CATEGORIES = EXPENSE_CATEGORIES.filter(cat => !FRUIT_CATEGORIES.includes(cat));

// Storage keys
export const STORAGE_KEYS = {
  STAFF_NAME: 'smoocho_staff_name',
  APPS_SCRIPT_URL: 'smoocho_apps_script_url',
  OFFLINE_DATA: 'smoocho_offline_data',
};

// Date format
export const DATE_FORMAT = 'yyyy-MM-dd';

