import { generateCertificatePDF, validateCertificateNumber } from '@/lib/services/certificate.service';
import { IVendor } from '@/lib/types/vendor';

// Mock jsPDF
jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(297),
          getHeight: jest.fn().mockReturnValue(210),
        },
      },
      setFillColor: jest.fn(),
      rect: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      setTextColor: jest.fn(),
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      text: jest.fn(),
      line: jest.fn(),
      roundedRect: jest.fn(),
      output: jest.fn().mockReturnValue(new Blob(['test'], { type: 'application/pdf' })),
    })),
  };
});

describe('Certificate Service', () => {
  const mockVendor: IVendor = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    companyName: 'Test Company Inc.',
    contactPerson: 'John Doe',
    phone: '+1234567890',
    email: 'test@company.com',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      country: 'Test Country',
      postalCode: '12345',
    },
    status: 'APPROVED',
    certificateNumber: 'VND-20240101-ABC123',
    registrationDate: new Date('2024-01-01'),
    approvalDate: new Date('2024-01-15'),
    businessRegistrationNumber: 'BR123456',
    taxId: 'TAX123456',
    documents: [],
  };

  describe('generateCertificatePDF', () => {
    it('should generate a PDF blob', () => {
      const result = generateCertificatePDF(mockVendor);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });

    it('should use landscape orientation', async () => {
      const jsPDF = await import('jspdf');
      generateCertificatePDF(mockVendor);

      expect(jsPDF.default).toHaveBeenCalledWith(
        expect.objectContaining({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        })
      );
    });

    it('should handle vendor without approval date', () => {
      const vendorWithoutApproval = { ...mockVendor, approvalDate: undefined };
      const result = generateCertificatePDF(vendorWithoutApproval);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle vendor without certificate number', () => {
      const vendorWithoutCertNumber = { ...mockVendor, certificateNumber: undefined };
      const result = generateCertificatePDF(vendorWithoutCertNumber);

      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('validateCertificateNumber', () => {
    it('should validate correct certificate number format', () => {
      const validNumbers = [
        'VND-20240101-ABC123',
        'VND-20231231-ZZZ999',
        'VND-20200101-A1B2C3',
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
      ];

      invalidNumbers.forEach((number) => {
        expect(validateCertificateNumber(number)).toBe(false);
      });
    });

    it('should reject numbers with invalid characters', () => {
      expect(validateCertificateNumber('VND-20240101-ABC@123')).toBe(false);
      expect(validateCertificateNumber('VND-20240101-AB C123')).toBe(false);
    });

    it('should validate format regardless of actual date validity', () => {
      // The validator uses [A-Z0-9]+ for date portion, so accepts any alphanumeric
      expect(validateCertificateNumber('VND-20241301-ABC123')).toBe(true); // format valid
      expect(validateCertificateNumber('VND-2024010-ABC123')).toBe(true); // format valid (7 chars)
      expect(validateCertificateNumber('VND-202401-ABC123')).toBe(true); // format valid (6 chars)
      expect(validateCertificateNumber('VND-2-ABC123')).toBe(true); // format valid (1 char)
    });
  });
});
