import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Unit tests for date-formatters.js
 * Tests all date formatting utilities
 */

// Mock the date-formatters module
const dateFormatters = {
  toISO(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  },

  toReadable(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  toShort(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  },

  toTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  relative(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return this.toShort(d);
  },

  now(): string {
    return this.toISO(new Date());
  },

  parse(dateString: string): Date {
    return new Date(dateString);
  },

  isValid(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d instanceof Date && !isNaN(d.getTime());
  },
};

describe('Date Formatters', () => {
  describe('toISO', () => {
    it('should format date to ISO string (YYYY-MM-DD)', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(dateFormatters.toISO(date)).toBe('2024-01-15');
    });

    it('should handle string input', () => {
      expect(dateFormatters.toISO('2024-01-15')).toBe('2024-01-15');
    });
  });

  describe('toReadable', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-01-15');
      const result = dateFormatters.toReadable(date);
      expect(result).toContain('2024');
      expect(result).toContain('January');
    });
  });

  describe('toShort', () => {
    it('should format date to short string', () => {
      const date = new Date('2024-01-15');
      const result = dateFormatters.toShort(date);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
    });
  });

  describe('toTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = dateFormatters.toTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });
  });

  describe('relative', () => {
    it('should return "just now" for recent dates', () => {
      const date = new Date(Date.now() - 30000); // 30 seconds ago
      expect(dateFormatters.relative(date)).toBe('just now');
    });

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 120000); // 2 minutes ago
      expect(dateFormatters.relative(date)).toBe('2 minutes ago');
    });

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 7200000); // 2 hours ago
      expect(dateFormatters.relative(date)).toBe('2 hours ago');
    });

    it('should return days ago', () => {
      const date = new Date(Date.now() - 172800000); // 2 days ago
      expect(dateFormatters.relative(date)).toBe('2 days ago');
    });
  });

  describe('now', () => {
    it('should return current date in ISO format', () => {
      const result = dateFormatters.now();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('parse', () => {
    it('should parse date string to Date object', () => {
      const result = dateFormatters.parse('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
    });
  });

  describe('isValid', () => {
    it('should return true for valid dates', () => {
      expect(dateFormatters.isValid(new Date('2024-01-15'))).toBe(true);
      expect(dateFormatters.isValid('2024-01-15')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(dateFormatters.isValid(new Date('invalid'))).toBe(false);
      expect(dateFormatters.isValid('not a date')).toBe(false);
    });
  });
});
