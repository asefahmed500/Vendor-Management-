/**
 * Generate a unique certificate number
 * Format: VND-{YYYYMMDD}-{RANDOM}
 */
export function generateCertificateNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dateStr = `${year}${month}${day}`;

  // Generate a random 6-character alphanumeric string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `VND-${dateStr}-${random}`;
}

/**
 * Validate certificate number format
 */
export function validateCertificateNumber(number: string): boolean {
  const regex = /^VND-\d{8}-[A-Z0-9]{6}$/;
  return regex.test(number);
}
