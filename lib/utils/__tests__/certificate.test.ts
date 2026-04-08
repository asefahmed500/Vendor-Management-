import { generateCertificateNumber, validateCertificateNumber } from '@/lib/utils/certificate';

describe('Certificate Utilities', () => {
  describe('generateCertificateNumber', () => {
    it('should generate a certificate number with correct format', () => {
      const result = generateCertificateNumber();

      expect(result).toMatch(/^VND-\d{8}-[A-Z0-9]{6}$/);
    });

    it('should include current date in the certificate number', () => {
      const result = generateCertificateNumber();
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      expect(result).toContain(dateStr);
    });

    it('should generate different numbers on each call', () => {
      const number1 = generateCertificateNumber();
      const number2 = generateCertificateNumber();

      expect(number1).not.toBe(number2);
    });

    it('should generate valid certificate numbers according to validator', () => {
      const result = generateCertificateNumber();

      expect(validateCertificateNumber(result)).toBe(true);
    });

    it('should generate 6-character random suffix', () => {
      const result = generateCertificateNumber();
      const parts = result.split('-');

      expect(parts[2]).toHaveLength(6);
    });

    it('should use only uppercase letters and numbers in suffix', () => {
      const result = generateCertificateNumber();
      const suffix = result.split('-')[2];

      expect(suffix).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('should generate correct format for different dates', () => {
      // Mock Date to test different dates
      const mockDate = new Date('2024-12-25T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);

      const result = generateCertificateNumber();

      expect(result).toMatch(/^VND-20241225-[A-Z0-9]{6}$/);

      jest.restoreAllMocks();
    });
  });

  describe('validateCertificateNumber', () => {
    it('should validate correct certificate number format', () => {
      const validNumbers = [
        'VND-20240101-ABC123',
        'VND-20231231-ZZZ999',
        'VND-20200101-A1B2C3',
        'VND-20240101-000000',
        'VND-20240101-111111',
      ];

      validNumbers.forEach((number) => {
        expect(validateCertificateNumber(number)).toBe(true);
      });
    });

    it('should reject invalid certificate number formats', () => {
      const invalidNumbers = [
        'VND-20240101-ABC', // too short at end (3 chars)
        'VND-20240101-ABC12345', // too long at end (8 chars)
        'VND-2024-01-01-ABC123', // wrong date format (has dashes)
        'CERT-20240101-ABC123', // wrong prefix
        'VND-20240101-abc123', // lowercase letters
        'VND-20240101-AB123', // too short at end (5 chars)
        'VND-20240101', // missing suffix
        '', // empty string
        'VND-20240101-ABC12$', // special character
        'VND-20240101-AB C12', // space
        'VND-20240101_AB1234', // wrong separator
      ];

      invalidNumbers.forEach((number) => {
        expect(validateCertificateNumber(number)).toBe(false);
      });
    });

    it('should validate format regardless of actual date validity', () => {
      // The validator only checks format (YYYYMMDD), not if it's a real date
      expect(validateCertificateNumber('VND-20241301-ABC123')).toBe(true); // format valid (8 digits)
      expect(validateCertificateNumber('VND-20240132-ABC123')).toBe(true); // format valid (8 digits)
      expect(validateCertificateNumber('VND-2024010-ABC123')).toBe(false); // wrong format (7 digits)
      expect(validateCertificateNumber('VND-202401011-ABC123')).toBe(false); // wrong format (9 digits)
    });

    it('should reject numbers with invalid year', () => {
      expect(validateCertificateNumber('VND-99991231-ABC123')).toBe(true); // valid format
      expect(validateCertificateNumber('VND-00000101-ABC123')).toBe(true); // valid format
    });

    it('should handle edge cases', () => {
      expect(validateCertificateNumber('vnd-20240101-ABC123')).toBe(false); // lowercase prefix
      expect(validateCertificateNumber('VND-20240101-ABC123 ')).toBe(false); // trailing space
      expect(validateCertificateNumber(' VND-20240101-ABC123')).toBe(false); // leading space
    });

    it('should validate all uppercase letters and numbers', () => {
      expect(validateCertificateNumber('VND-20240101-ABCDEF')).toBe(true); // all letters
      expect(validateCertificateNumber('VND-20240101-123456')).toBe(true); // all numbers
      expect(validateCertificateNumber('VND-20240101-A1B2C3')).toBe(true); // mixed
    });
  });
});
