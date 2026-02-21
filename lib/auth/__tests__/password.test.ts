import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateRandomPassword,
} from '@/lib/auth/password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', async () => {
      const hash = await hashPassword('');
      expect(hash).toBeDefined();
    });

    it('should handle special characters', async () => {
      const password = 'P@$$w0rd!@#$%^&*()';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);

      const result = await comparePassword(wrongPassword, hash);
      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const result = await comparePassword('', hash);
      expect(result).toBe(false);
    });

    it('should handle comparison with invalid hash', async () => {
      const password = 'TestPassword123!';
      const invalidHash = 'invalid-hash';

      const result = await comparePassword(password, invalidHash);
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    const validPassword = 'Test123!@';

    it('should validate a strong password', () => {
      const result = validatePasswordStrength(validPassword);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePasswordStrength('Test1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePasswordStrength('TEST123!@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePasswordStrength('test123!@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('TestPassword!@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePasswordStrength('TestPassword123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)');
    });

    it('should return multiple errors for weak password', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should accept only specified special characters', () => {
      const result = validatePasswordStrength('Test123!@'); // @ and ! are valid
      expect(result.isValid).toBe(true);
    });

    it('should reject unsupported special characters', () => {
      const result = validatePasswordStrength('Test123#'); // # is NOT in the allowed list
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)');
    });

    it('should handle empty string', () => {
      const result = validatePasswordStrength('');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(5); // All 5 validation rules should fail
    });
  });

  describe('generateRandomPassword', () => {
    it('should generate password with default length', () => {
      const password = generateRandomPassword();
      expect(password.length).toBe(16);
    });

    it('should generate password with custom length', () => {
      const password = generateRandomPassword(24);
      expect(password.length).toBe(24);
    });

    it('should generate password containing lowercase', () => {
      const password = generateRandomPassword();
      expect(/[a-z]/.test(password)).toBe(true);
    });

    it('should generate password containing uppercase', () => {
      const password = generateRandomPassword();
      expect(/[A-Z]/.test(password)).toBe(true);
    });

    it('should generate password containing numbers', () => {
      const password = generateRandomPassword();
      expect(/\d/.test(password)).toBe(true);
    });

    it('should generate password containing special characters', () => {
      const password = generateRandomPassword();
      expect(/[@$!%*?&]/.test(password)).toBe(true);
    });

    it('should generate valid password according to validator', () => {
      const password = generateRandomPassword();
      const validation = validatePasswordStrength(password);
      expect(validation.isValid).toBe(true);
    });

    it('should generate different passwords on each call', () => {
      const password1 = generateRandomPassword();
      const password2 = generateRandomPassword();
      expect(password1).not.toBe(password2);
    });

    it('should handle minimum length', () => {
      const password = generateRandomPassword(4);
      expect(password.length).toBe(4);
    });
  });
});
