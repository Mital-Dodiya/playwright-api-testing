import { APIResponse, expect } from '@playwright/test';

/**
 * SchemaValidator — Utility class for validating API response schemas.
 * Ensures response bodies contain correct fields, types, and structures.
 */
export class SchemaValidator {

  /**
   * Validates that a response body contains all required fields.
   * @param response - The API response to validate
   * @param requiredFields - Array of field names that must exist
   */
  static async validateRequiredFields(
    response: APIResponse,
    requiredFields: string[]
  ): Promise<void> {
    const body = await response.json();
    for (const field of requiredFields) {
      expect(body, `Missing required field: ${field}`).toHaveProperty(field);
    }
  }

  /**
   * Validates field data types in a response body.
   * @param response - The API response to validate
   * @param fieldTypes - Object mapping field names to expected types
   */
  static async validateFieldTypes(
    response: APIResponse,
    fieldTypes: Record<string, string>
  ): Promise<void> {
    const body = await response.json();
    for (const [field, expectedType] of Object.entries(fieldTypes)) {
      expect(
        typeof body[field],
        `Field "${field}" should be of type ${expectedType} but got ${typeof body[field]}`
      ).toBe(expectedType);
    }
  }

  /**
   * Validates that an array response has correct item schema.
   * @param response - The API response to validate
   * @param requiredFields - Fields each array item must have
   */
  static async validateArraySchema(
    response: APIResponse,
    requiredFields: string[]
  ): Promise<void> {
    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    expect(body.length, 'Array should not be empty').toBeGreaterThan(0);
    for (const field of requiredFields) {
      expect(body[0], `Array item missing field: ${field}`).toHaveProperty(field);
    }
  }

  /**
   * Validates that a field value is not null or undefined.
   * @param response - The API response to validate
   * @param fields - Fields to check for non-null values
   */
  static async validateNonNullFields(
    response: APIResponse,
    fields: string[]
  ): Promise<void> {
    const body = await response.json();
    for (const field of fields) {
      expect(body[field], `Field "${field}" should not be null or undefined`).toBeDefined();
      expect(body[field], `Field "${field}" should not be null`).not.toBeNull();
    }
  }
}
