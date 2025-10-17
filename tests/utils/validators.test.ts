import { describe, it, expect } from 'vitest';

/**
 * Unit tests for validators.js
 * Tests all validation functions
 */

const validators = {
  required(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  email(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone(value: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(value);
  },

  number(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  range(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  length(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  },

  url(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  date(value: string): boolean {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  certificateNumber(value: string): boolean {
    // Format: CAL-YYYYMMDD-XXX
    const certRegex = /^CAL-\d{8}-\d{3}$/;
    return certRegex.test(value);
  },

  serialNumber(value: string): boolean {
    return value.length >= 3 && /^[A-Z0-9\-]+$/i.test(value);
  },

  positive(value: number): boolean {
    return this.number(value) && value > 0;
  },

  integer(value: number): boolean {
    return this.number(value) && Number.isInteger(value);
  },
};

describe('Validators', () => {
  describe('required', () => {
    it('should return true for non-empty strings', () => {
      expect(validators.required('hello')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(validators.required('')).toBe(false);
      expect(validators.required('   ')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validators.required(null)).toBe(false);
      expect(validators.required(undefined)).toBe(false);
    });

    it('should return true for numbers', () => {
      expect(validators.required(0)).toBe(true);
      expect(validators.required(123)).toBe(true);
    });
  });

  describe('email', () => {
    it('should validate correct email addresses', () => {
      expect(validators.email('test@example.com')).toBe(true);
      expect(validators.email('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validators.email('invalid')).toBe(false);
      expect(validators.email('test@')).toBe(false);
      expect(validators.email('@example.com')).toBe(false);
      expect(validators.email('test @example.com')).toBe(false);
    });
  });

  describe('phone', () => {
    it('should validate phone numbers', () => {
      expect(validators.phone('1234567890')).toBe(true);
      expect(validators.phone('+1 (555) 123-4567')).toBe(true);
      expect(validators.phone('+44 20 1234 5678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validators.phone('123')).toBe(false);
      expect(validators.phone('abc')).toBe(false);
    });
  });

  describe('number', () => {
    it('should validate numbers', () => {
      expect(validators.number(123)).toBe(true);
      expect(validators.number(123.456)).toBe(true);
      expect(validators.number('123')).toBe(true);
    });

    it('should reject non-numbers', () => {
      expect(validators.number('abc')).toBe(false);
      expect(validators.number(NaN)).toBe(false);
      expect(validators.number(Infinity)).toBe(false);
    });
  });

  describe('range', () => {
    it('should validate numbers within range', () => {
      expect(validators.range(5, 0, 10)).toBe(true);
      expect(validators.range(0, 0, 10)).toBe(true);
      expect(validators.range(10, 0, 10)).toBe(true);
    });

    it('should reject numbers outside range', () => {
      expect(validators.range(-1, 0, 10)).toBe(false);
      expect(validators.range(11, 0, 10)).toBe(false);
    });
  });

  describe('length', () => {
    it('should validate string length within range', () => {
      expect(validators.length('hello', 3, 10)).toBe(true);
      expect(validators.length('hi', 2, 5)).toBe(true);
    });

    it('should reject strings with invalid length', () => {
      expect(validators.length('hi', 3, 10)).toBe(false);
      expect(validators.length('hello world', 3, 5)).toBe(false);
    });
  });

  describe('url', () => {
    it('should validate URLs', () => {
      expect(validators.url('https://example.com')).toBe(true);
      expect(validators.url('http://localhost:3000')).toBe(true);
      expect(validators.url('https://example.com/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validators.url('not a url')).toBe(false);
      expect(validators.url('example.com')).toBe(false);
    });
  });

  describe('date', () => {
    it('should validate date strings', () => {
      expect(validators.date('2024-01-15')).toBe(true);
      expect(validators.date('2024/01/15')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(validators.date('invalid')).toBe(false);
      expect(validators.date('2024-13-01')).toBe(false);
    });
  });

  describe('certificateNumber', () => {
    it('should validate certificate numbers', () => {
      expect(validators.certificateNumber('CAL-20240115-001')).toBe(true);
      expect(validators.certificateNumber('CAL-20241015-999')).toBe(true);
    });

    it('should reject invalid certificate numbers', () => {
      expect(validators.certificateNumber('CAL-2024-001')).toBe(false);
      expect(validators.certificateNumber('CERT-20240115-001')).toBe(false);
      expect(validators.certificateNumber('CAL-20240115-1')).toBe(false);
    });
  });

  describe('serialNumber', () => {
    it('should validate serial numbers', () => {
      expect(validators.serialNumber('SN12345')).toBe(true);
      expect(validators.serialNumber('ABC-123-XYZ')).toBe(true);
    });

    it('should reject invalid serial numbers', () => {
      expect(validators.serialNumber('AB')).toBe(false); // Too short
      expect(validators.serialNumber('ABC 123')).toBe(false); // Contains space
    });
  });

  describe('positive', () => {
    it('should validate positive numbers', () => {
      expect(validators.positive(1)).toBe(true);
      expect(validators.positive(123.45)).toBe(true);
    });

    it('should reject zero and negative numbers', () => {
      expect(validators.positive(0)).toBe(false);
      expect(validators.positive(-5)).toBe(false);
    });
  });

  describe('integer', () => {
    it('should validate integers', () => {
      expect(validators.integer(123)).toBe(true);
      expect(validators.integer(0)).toBe(true);
      expect(validators.integer(-5)).toBe(true);
    });

    it('should reject decimals', () => {
      expect(validators.integer(123.45)).toBe(false);
    });
  });
});
