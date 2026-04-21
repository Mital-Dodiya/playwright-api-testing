import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';
import { SchemaValidator } from '../src/utils/SchemaValidator';
import testData from '../test-data/api-payloads.json';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Data-Driven API Tests', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('Valid User IDs from Test Data', () => {
    for (const userId of testData.users.validIds) {
      test(`should return user with id ${userId}`, async () => {
        const response = await api.get(`/users/${userId}`);
        await api.verifyStatusCode(response, 200);
        await api.verifyResponseBody(response, 'id', userId);
      });
    }
  });

  test.describe('Invalid User IDs from Test Data', () => {
    for (const userId of testData.users.invalidIds) {
      test(`should return 404 for invalid user id ${userId}`, async () => {
        const response = await api.get(`/users/${userId}`);
        expect([404, 400]).toContain(response.status());
      });
    }
  });

  test.describe('Post CRUD using Test Data Payloads', () => {
    test('should create post using valid payload from test data', async () => {
      const response = await api.post('/posts', testData.posts.valid.create);
      await api.verifyStatusCode(response, 201);
      await api.verifyResponseBody(response, 'title', testData.posts.valid.create.title);
    });

    test('should update post using valid payload from test data', async () => {
      const response = await api.put('/posts/1', testData.posts.valid.update);
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'title', testData.posts.valid.update.title);
    });

    test('should patch post using patch payload from test data', async () => {
      const response = await api.patch('/posts/1', testData.posts.valid.patch);
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'title', testData.posts.valid.patch.title);
    });
  });

  test.describe('User Schema Validation using Test Data', () => {
    test('should validate all required user fields from test data', async () => {
      const response = await api.get('/users/1');
      await SchemaValidator.validateRequiredFields(
        response,
        testData.users.requiredFields
      );
    });

    test('should validate user field types from test data', async () => {
      const response = await api.get('/users/1');
      await SchemaValidator.validateFieldTypes(
        response,
        testData.users.fieldTypes as Record<string, string>
      );
    });
  });

  test.describe('Todo Validation using Test Data', () => {
    for (const todoId of testData.todos.validIds) {
      test(`should return todo with id ${todoId} and validate schema`, async () => {
        const response = await api.get(`/todos/${todoId}`);
        await api.verifyStatusCode(response, 200);
        await SchemaValidator.validateRequiredFields(
          response,
          testData.todos.requiredFields
        );
      });
    }
  });
});
