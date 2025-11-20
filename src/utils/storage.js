/**
 * Storage utilities
 */
import { STORAGE_KEYS } from '../constants';

export const getStaffName = () => {
  return localStorage.getItem(STORAGE_KEYS.STAFF_NAME) || '';
};

export const saveStaffName = (name) => {
  localStorage.setItem(STORAGE_KEYS.STAFF_NAME, name);
};

export const getAppsScriptUrl = () => {
  return localStorage.getItem(STORAGE_KEYS.APPS_SCRIPT_URL) || '';
};

export const saveAppsScriptUrl = (url) => {
  localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT_URL, url);
};

export const saveOffline = (type, data) => {
  const queue = getOfflineData();
  queue.push({ type, data, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(queue));
};

export const getOfflineData = () => {
  const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
  return data ? JSON.parse(data) : [];
};

export const clearOffline = () => {
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
};

