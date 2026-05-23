import { normalizeString, searchMatch } from '../stringUtils';

describe('stringUtils', () => {
  describe('normalizeString', () => {
    it('should normalize Swedish special characters', () => {
      expect(normalizeString('Döckpoint')).toBe('dockpoint');
      expect(normalizeString('Malmö')).toBe('malmo');
      expect(normalizeString('Västerås')).toBe('vasteras');
      expect(normalizeString('Jönköping')).toBe('jonkoping');
    });

    it('should convert to lowercase', () => {
      expect(normalizeString('WORKSHOP')).toBe('workshop');
      expect(normalizeString('MixedCase')).toBe('mixedcase');
    });

    it('should trim whitespace', () => {
      expect(normalizeString('  workshop  ')).toBe('workshop');
      expect(normalizeString('\tDöckpoint\n')).toBe('dockpoint');
    });

    it('should handle empty strings', () => {
      expect(normalizeString('')).toBe('');
      expect(normalizeString('   ')).toBe('');
    });

    it('should handle strings without special characters', () => {
      expect(normalizeString('Stockholm')).toBe('stockholm');
      expect(normalizeString('Workshop123')).toBe('workshop123');
    });

    it('should handle other European special characters', () => {
      expect(normalizeString('café')).toBe('cafe');
      expect(normalizeString('naïve')).toBe('naive');
      expect(normalizeString('Zürich')).toBe('zurich');
    });
  });

  describe('searchMatch', () => {
    it('should match normalized Swedish characters', () => {
      expect(searchMatch('dockpoint', 'Döckpoint Workshop')).toBe(true);
      expect(searchMatch('Döckpoint', 'Dockpoint Workshop')).toBe(true);
      expect(searchMatch('malmo', 'Malmö Service Center')).toBe(true);
      expect(searchMatch('Malmö', 'Malmo Service Center')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(searchMatch('WORKSHOP', 'workshop name')).toBe(true);
      expect(searchMatch('WoRkShOp', 'WORKSHOP NAME')).toBe(true);
    });

    it('should match partial strings', () => {
      expect(searchMatch('dock', 'Döckpoint Workshop')).toBe(true);
      expect(searchMatch('point', 'Döckpoint Workshop')).toBe(true);
      expect(searchMatch('work', 'Döckpoint Workshop')).toBe(true);
    });

    it('should not match non-existent strings', () => {
      expect(searchMatch('xyz', 'Döckpoint Workshop')).toBe(false);
      expect(searchMatch('test', 'Malmö Service Center')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(searchMatch('', 'Döckpoint')).toBe(false);
      expect(searchMatch('workshop', '')).toBe(false);
      expect(searchMatch('', '')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(searchMatch('  dock  ', '  Döckpoint  ')).toBe(true);
      expect(searchMatch('malmo service', 'Malmö Service Center')).toBe(true);
    });
  });
});
