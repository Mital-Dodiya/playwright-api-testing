import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Posts API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('GET /posts', () => {
    test('should return status 200', async () => {
      const response = await api.get('/posts');
      await api.verifyStatusCode(response, 200);
    });

    test('should return 100 posts', async () => {
      const response = await api.get('/posts');
      const body = await response.json();
      expect(body.length).toBe(100);
    });

    test('should return posts with required fields', async () => {
      const response = await api.get('/posts');
      const body = await response.json();
      const post = body[0];
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
    });
  });

  test.describe('GET /posts/:id', () => {
    test('should return correct post by id', async () => {
      const response = await api.get('/posts/1');
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'id', 1);
    });

    test('should return 404 for non-existent post', async () => {
      const response = await api.get('/posts/9999');
      await api.verifyStatusCode(response, 404);
    });
  });

  test.describe('GET /posts?userId=:id', () => {
    test('should return posts filtered by userId', async () => {
      const response = await api.get('/posts?userId=1');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      body.forEach((post: { userId: number }) => {
        expect(post.userId).toBe(1);
      });
    });
  });

  test.describe('POST /posts', () => {
    test('should create a new post and return 201', async () => {
      const response = await api.post('/posts', {
        title: 'Automation Test Post',
        body: 'Created via Playwright API test',
        userId: 1,
      });
      await api.verifyStatusCode(response, 201);
    });

    test('should return created post data in response', async () => {
      const response = await api.post('/posts', {
        title: 'Automation Test Post',
        body: 'Created via Playwright API test',
        userId: 1,
      });
      const body = await response.json();
      expect(body.title).toBe('Automation Test Post');
      expect(body.userId).toBe(1);
      expect(body.id).toBeDefined();
    });
  });

  test.describe('PUT /posts/:id', () => {
    test('should update a post and return 200', async () => {
      const response = await api.put('/posts/1', {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      });
      await api.verifyStatusCode(response, 200);
    });

    test('should return updated data in response', async () => {
      const response = await api.put('/posts/1', {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      });
      await api.verifyResponseBody(response, 'title', 'Updated Title');
    });
  });

  test.describe('PATCH /posts/:id', () => {
    test('should partially update a post and return 200', async () => {
      const response = await api.patch('/posts/1', { title: 'Patched Title' });
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'title', 'Patched Title');
    });
  });

  test.describe('DELETE /posts/:id', () => {
    test('should delete a post and return 200', async () => {
      const response = await api.delete('/posts/1');
      await api.verifyStatusCode(response, 200);
    });
  });
});
