import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Todos API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('GET /todos', () => {
    test('should return status 200', async () => {
      const response = await api.get('/todos');
      await api.verifyStatusCode(response, 200);
    });

    test('should return 200 todos', async () => {
      const response = await api.get('/todos');
      const body = await response.json();
      expect(body.length).toBe(200);
    });

    test('should return todos with required fields', async () => {
      const response = await api.get('/todos');
      const body = await response.json();
      const todo = body[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('userId');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('completed');
    });

    test('completed field should be a boolean', async () => {
      const response = await api.get('/todos');
      const body = await response.json();
      body.forEach((todo: { completed: unknown }) => {
        expect(typeof todo.completed).toBe('boolean');
      });
    });
  });

  test.describe('GET /todos/:id', () => {
    test('should return single todo with status 200', async () => {
      const response = await api.get('/todos/1');
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'id', 1);
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await api.get('/todos/9999');
      await api.verifyStatusCode(response, 404);
    });

    test('should return completed todo correctly', async () => {
      const response = await api.get('/todos/4');
      const body = await response.json();
      expect(typeof body.completed).toBe('boolean');
      expect(body).toHaveProperty('title');
    });
  });

  test.describe('GET /todos?userId=:id', () => {
    test('should return todos filtered by userId', async () => {
      const response = await api.get('/todos?userId=1');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(body.length).toBeGreaterThan(0);
      body.forEach((todo: { userId: number }) => {
        expect(todo.userId).toBe(1);
      });
    });

    test('should return empty array for non-existent userId', async () => {
      const response = await api.get('/todos?userId=9999');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(body.length).toBe(0);
    });
  });

  test.describe('GET /users/:id/todos', () => {
    test('should return todos for user 1', async () => {
      const response = await api.get('/users/1/todos');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test('all todos should belong to the requested user', async () => {
      const response = await api.get('/users/2/todos');
      const body = await response.json();
      body.forEach((todo: { userId: number }) => {
        expect(todo.userId).toBe(2);
      });
    });
  });
});
