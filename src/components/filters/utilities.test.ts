import { describe, expect, it } from 'vitest';
import config from '../../config';
import { SpeciesLengthRow } from './filters.types';
import { getQuery, isPositiveWholeNumber } from './utilities';

describe('isPositiveWholeNumber', () => {
  it('should return true for positive integers', () => {
    expect(isPositiveWholeNumber('1')).toBe(true);
  });

  it('should return false for negative integers', () => {
    expect(isPositiveWholeNumber('-1')).toBe(false);
    expect(isPositiveWholeNumber('-5.4')).toBe(false);
  });

  it('should return false for non-integers', () => {
    expect(isPositiveWholeNumber('1.1')).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isPositiveWholeNumber('a')).toBe(false);
  });

  it('should return false for zero', () => {
    expect(isPositiveWholeNumber('0')).toBe(false);
  });
});

describe('getQuery', () => {
  it('should return a valid query when all fields are provided', () => {
    const row: SpeciesLengthRow = { species: 'Salmon', min: '10', max: '20' };
    const result = getQuery(row);
    expect(result).toBe(
      `(${config.fieldNames.SPECIES_CODE} = 'Salmon' AND ${config.fieldNames.LENGTH} >= 10 AND ${config.fieldNames.LENGTH} <= 20)`,
    );
  });

  it('should return a valid query when some fields are missing', () => {
    const row: SpeciesLengthRow = { species: 'Salmon', min: '', max: '20' };
    const result = getQuery(row);
    expect(result).toBe(`(${config.fieldNames.SPECIES_CODE} = 'Salmon' AND ${config.fieldNames.LENGTH} <= 20)`);
  });

  it('should return null when no fields are provided', () => {
    const row: SpeciesLengthRow = { species: '', min: '', max: '' };
    const result = getQuery(row);
    expect(result).toBeNull();
  });

  it('should handle edge cases with empty strings', () => {
    const row: SpeciesLengthRow = { species: '', min: '10', max: '' };
    const result = getQuery(row);
    expect(result).toBe(`(${config.fieldNames.LENGTH} >= 10)`);
  });

  it('should return null if the range is invalid', () => {
    const row: SpeciesLengthRow = { species: 'Salmon', min: '20', max: '10' };
    const result = getQuery(row);
    expect(result).toBeNull();
  });
});
