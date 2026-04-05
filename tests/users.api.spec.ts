import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Users API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('GET /users', () => {
    test('should return status 200', async () => {
      const response = await api.get('/users');
      await api.verifyStatusCode(response, 200);
    });

    test('should return an array of users', async () => {
      const response = await api.get('/users');
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test('should return users with required fields', async () => {
      const response = await api.get('/users');
      const body = await response.json();
      const user = body[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
    });
  });

  test.describe('GET /users/:id', () => {
    test('should return status 200 for valid user', async () => {
      const response = await api.get('/users/1');
      await api.verifyStatusCode(response, 200);
    });

    test('should return correct user id', async () => {
      const response = await api.get('/users/1');
      await api.verifyResponseBody(response, 'id', 1);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await api.get('/users/9999');
      await api.verifyStatusCode(response, 404);
    });

    test('should return user with all expected fields', async () => {
      const response = await api.get('/users/1');
      await api.verifyResponseContainsKey(response, 'name');
      await api.verifyResponseContainsKey(response, 'email');
      await api.verifyResponseContainsKey(response, 'phone');
      await api.verifyResponseContainsKey(response, 'address');
    });
  });
});
