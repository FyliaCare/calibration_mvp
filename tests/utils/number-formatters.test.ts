import { describe, it, expect } from 'vitest';

/**
 * Unit tests for number-formatters.js
 * Tests all number formatting utilities
 */

const numberFormatters = {
  toFixed(num: number, decimals: number = 2): string {
    return num.toFixed(decimals);
  },

  withCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  toCurrency(num: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  },

  toPercent(num: number, decimals: number = 2): string {
    return `${(num * 100).toFixed(decimals)}%`;
  },

  withSuffix(num: number): string {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  },

  fileSize(bytes: number): string {
    if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
    if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(2)} KB`;
    return `${bytes} bytes`;
  },

  roundTo(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  },

  clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  },

  percentOf(value: number, total: number): number {
    return total === 0 ? 0 : (value / total) * 100;
  },
};

describe('Number Formatters', () => {
  describe('toFixed', () => {
    it('should format number with 2 decimal places by default', () => {
      expect(numberFormatters.toFixed(123.456)).toBe('123.46');
    });

    it('should format number with custom decimal places', () => {
      expect(numberFormatters.toFixed(123.456, 1)).toBe('123.5');
      expect(numberFormatters.toFixed(123.456, 3)).toBe('123.456');
    });

    it('should handle integers', () => {
      expect(numberFormatters.toFixed(123, 2)).toBe('123.00');
    });
  });

  describe('withCommas', () => {
    it('should add commas to large numbers', () => {
      expect(numberFormatters.withCommas(1234567)).toBe('1,234,567');
    });

    it('should handle small numbers without commas', () => {
      expect(numberFormatters.withCommas(123)).toBe('123');
    });

    it('should handle negative numbers', () => {
      expect(numberFormatters.withCommas(-1234567)).toBe('-1,234,567');
    });
  });

  describe('toCurrency', () => {
    it('should format as USD currency by default', () => {
      const result = numberFormatters.toCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should handle different currencies', () => {
      const result = numberFormatters.toCurrency(1234.56, 'EUR');
      expect(result).toContain('1,234.56');
    });

    it('should handle zero', () => {
      expect(numberFormatters.toCurrency(0)).toBe('$0.00');
    });
  });

  describe('toPercent', () => {
    it('should convert decimal to percentage', () => {
      expect(numberFormatters.toPercent(0.1234)).toBe('12.34%');
    });

    it('should handle whole numbers', () => {
      expect(numberFormatters.toPercent(1)).toBe('100.00%');
    });

    it('should use custom decimal places', () => {
      expect(numberFormatters.toPercent(0.1234, 1)).toBe('12.3%');
    });
  });

  describe('withSuffix', () => {
    it('should add K suffix for thousands', () => {
      expect(numberFormatters.withSuffix(1500)).toBe('1.5K');
    });

    it('should add M suffix for millions', () => {
      expect(numberFormatters.withSuffix(2_500_000)).toBe('2.5M');
    });

    it('should add B suffix for billions', () => {
      expect(numberFormatters.withSuffix(3_500_000_000)).toBe('3.5B');
    });

    it('should not add suffix for small numbers', () => {
      expect(numberFormatters.withSuffix(500)).toBe('500');
    });
  });

  describe('fileSize', () => {
    it('should format bytes', () => {
      expect(numberFormatters.fileSize(512)).toBe('512 bytes');
    });

    it('should format KB', () => {
      expect(numberFormatters.fileSize(1536)).toBe('1.50 KB');
    });

    it('should format MB', () => {
      expect(numberFormatters.fileSize(1_572_864)).toBe('1.50 MB');
    });

    it('should format GB', () => {
      expect(numberFormatters.fileSize(1_610_612_736)).toBe('1.50 GB');
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimal places', () => {
      expect(numberFormatters.roundTo(123.456, 2)).toBe(123.46);
      expect(numberFormatters.roundTo(123.456, 1)).toBe(123.5);
      expect(numberFormatters.roundTo(123.456, 0)).toBe(123);
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(numberFormatters.clamp(5, 0, 10)).toBe(5);
    });

    it('should clamp to minimum', () => {
      expect(numberFormatters.clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp to maximum', () => {
      expect(numberFormatters.clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('percentOf', () => {
    it('should calculate percentage of total', () => {
      expect(numberFormatters.percentOf(25, 100)).toBe(25);
      expect(numberFormatters.percentOf(50, 200)).toBe(25);
    });

    it('should handle zero total', () => {
      expect(numberFormatters.percentOf(25, 0)).toBe(0);
    });

    it('should handle zero value', () => {
      expect(numberFormatters.percentOf(0, 100)).toBe(0);
    });
  });
});
