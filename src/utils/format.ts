/**
 * Format a number as currency
 * @param amount - The numeric amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number as VND (Vietnamese Dong) currency
 * @param amount - The numeric amount to format
 * @returns Formatted VND currency string
 */
export function formatVND(amount: number): string {
  return formatCurrency(amount, 'VND', 'vi-VN');
}

/**
 * Format a number as currency with a sign for positive/negative
 * @param amount - The numeric amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string with +/- sign
 */
export function formatCurrencyWithSign(
  amount: number,
  currency: string = 'USD'
): string {
  const sign = amount >= 0 ? '+' : '';
  return sign + formatCurrency(amount, currency);
}

/**
 * Format a date as dd/MM HH:mm
 * @param date - The date to format (Date object or string)
 * @returns Formatted date string in dd/MM HH:mm format
 */
export function formatShortDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${day}/${month} ${hours}:${minutes}`;
}

export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  
  return `${day}/${month}`;
}

export const toDateInputValue = (date?: Date | string | null) => (date ? String(date).slice(0, 10) : '');
