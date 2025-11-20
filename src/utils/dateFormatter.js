/**
 * Date and time formatting utilities
 */

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current time in HH:MM:SS format
 */
export const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format date for display (e.g., "Jan 1")
 */
export const formatDateDisplay = (dateString) => {
  try {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  } catch {
    return dateString;
  }
};

/**
 * Normalize a YYYY-MM string and return a safe value + Date instance.
 */
export const normalizeMonthValue = (value) => {
  const today = new Date();
  const fallbackValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const fallbackDate = new Date(today.getFullYear(), today.getMonth(), 1);

  if (!value || typeof value !== 'string') {
    return { value: fallbackValue, date: fallbackDate };
  }

  const monthPattern = /^\d{4}-\d{2}$/;
  if (!monthPattern.test(value)) {
    return { value: fallbackValue, date: fallbackDate };
  }

  const [yearStr, monthStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return { value: fallbackValue, date: fallbackDate };
  }

  const parsedDate = new Date(year, month - 1, 1);
  if (Number.isNaN(parsedDate.getTime())) {
    return { value: fallbackValue, date: fallbackDate };
  }

  const normalizedValue = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
  return { value: normalizedValue, date: parsedDate };
};

