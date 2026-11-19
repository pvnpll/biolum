import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${day} ${months[month]} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

export function calculateAge(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 1) {
      const birthYear = parseInt(parts[0], 10);
      if (!isNaN(birthYear) && birthYear > 1900) {
        // Safe static base year for SSR, client hydrates accurately
        const currentYear = 2026;
        const approximateAge = currentYear - birthYear;
        return `${approximateAge} Years`;
      }
    }
  } catch (e) {
    // fallback
  }
  return '';
}

export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

export function generateShareableUrl(id: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/view/${id}`;
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}
