import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Comments & Nested Resources API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('GET /posts/:id/comments', () => {
    test('should return comments for a post', async () => {
      const response = await api.get('/posts/1/comments');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test('should return comments with required fields', async () => {
      const response = await api.get('/posts/1/comments');
      const body = await response.json();
      const comment = body[0];
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
    });

    test('should return comments belonging to correct post', async () => {
      const response = await api.get('/posts/1/comments');
      const body = await response.json();
      body.forEach((comment: { postId: number }) => {
        expect(comment.postId).toBe(1);
      });
    });
  });

  test.describe('GET /users/:id/posts', () => {
    test('should return posts for a specific user', async () => {
      const response = await api.get('/users/1/posts');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      body.forEach((post: { userId: number }) => {
        expect(post.userId).toBe(1);
      });
    });
  });

  test.describe('GET /users/:id/todos', () => {
    test('should return todos for a user', async () => {
      const response = await api.get('/users/1/todos');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test('should return todos with required fields', async () => {
      const response = await api.get('/users/1/todos');
      const body = await response.json();
      const todo = body[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('completed');
    });
  });

  test.describe('Response Header Validation', () => {
    test('should return JSON content type header', async () => {
      const response = await api.get('/users');
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('response time should be under 3 seconds', async ({ request }) => {
      const start = Date.now();
      await request.get(`${BASE_URL}/users`);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });
  });
});
