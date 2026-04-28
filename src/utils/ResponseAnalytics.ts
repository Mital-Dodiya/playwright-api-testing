import { APIResponse } from '@playwright/test';

/**
 * ResponseAnalytics — Utility for performing aggregate analysis on API responses.
 * Mirrors SQL aggregate functions (COUNT, SUM, AVG, MIN, MAX) on API response data.
 * Useful for validating data completeness and range in API responses.
 */
export class ResponseAnalytics {

  /**
   * Counts total number of items in array response.
   * Equivalent to SQL: SELECT COUNT(*) FROM table
   */
  static async count(response: APIResponse): Promise<number> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return body.length;
  }

  /**
   * Returns sum of a numeric field across all items.
   * Equivalent to SQL: SELECT SUM(field) FROM table
   */
  static async sum(response: APIResponse, field: string): Promise<number> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return body.reduce((acc: number, item: Record<string, unknown>) => {
      const value = Number(item[field]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);
  }

  /**
   * Returns average value of a numeric field.
   * Equivalent to SQL: SELECT AVG(field) FROM table
   */
  static async average(response: APIResponse, field: string): Promise<number> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    if (body.length === 0) return 0;
    const total = body.reduce((acc: number, item: Record<string, unknown>) => {
      return acc + Number(item[field]);
    }, 0);
    return total / body.length;
  }

  /**
   * Returns minimum value of a numeric field.
   * Equivalent to SQL: SELECT MIN(field) FROM table
   */
  static async min(response: APIResponse, field: string): Promise<number> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return Math.min(...body.map((item: Record<string, unknown>) => Number(item[field])));
  }

  /**
   * Returns maximum value of a numeric field.
   * Equivalent to SQL: SELECT MAX(field) FROM table
   */
  static async max(response: APIResponse, field: string): Promise<number> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return Math.max(...body.map((item: Record<string, unknown>) => Number(item[field])));
  }

  /**
   * Returns unique values for a field — like SQL DISTINCT.
   * Equivalent to SQL: SELECT DISTINCT field FROM table
   */
  static async distinct(response: APIResponse, field: string): Promise<unknown[]> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return [...new Set(body.map((item: Record<string, unknown>) => item[field]))];
  }

  /**
   * Filters items by field value — like SQL WHERE clause.
   * Equivalent to SQL: SELECT * FROM table WHERE field = value
   */
  static async filterBy(
    response: APIResponse,
    field: string,
    value: unknown
  ): Promise<unknown[]> {
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('Response is not an array');
    return body.filter((item: Record<string, unknown>) => item[field] === value);
  }
}
