import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Albums API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('GET /albums', () => {
    test('should return status 200', async () => {
      const response = await api.get('/albums');
      await api.verifyStatusCode(response, 200);
    });

    test('should return 100 albums', async () => {
      const response = await api.get('/albums');
      const body = await response.json();
      expect(body.length).toBe(100);
    });

    test('should return albums with required fields', async () => {
      const response = await api.get('/albums');
      const body = await response.json();
      const album = body[0];
      expect(album).toHaveProperty('id');
      expect(album).toHaveProperty('userId');
      expect(album).toHaveProperty('title');
    });
  });

  test.describe('GET /albums/:id', () => {
    test('should return single album with status 200', async () => {
      const response = await api.get('/albums/1');
      await api.verifyStatusCode(response, 200);
      await api.verifyResponseBody(response, 'id', 1);
    });

    test('should return 404 for non-existent album', async () => {
      const response = await api.get('/albums/9999');
      await api.verifyStatusCode(response, 404);
    });

    test('should return album title as a string', async () => {
      const response = await api.get('/albums/1');
      const body = await response.json();
      expect(typeof body.title).toBe('string');
      expect(body.title.length).toBeGreaterThan(0);
    });
  });

  test.describe('GET /albums/:id/photos', () => {
    test('should return photos for an album', async () => {
      const response = await api.get('/albums/1/photos');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test('should return photos with required fields', async () => {
      const response = await api.get('/albums/1/photos');
      const body = await response.json();
      const photo = body[0];
      expect(photo).toHaveProperty('id');
      expect(photo).toHaveProperty('albumId');
      expect(photo).toHaveProperty('title');
      expect(photo).toHaveProperty('url');
      expect(photo).toHaveProperty('thumbnailUrl');
    });

    test('all photos should belong to the requested album', async () => {
      const response = await api.get('/albums/2/photos');
      const body = await response.json();
      body.forEach((photo: { albumId: number }) => {
        expect(photo.albumId).toBe(2);
      });
    });
  });

  test.describe('GET /users/:id/albums', () => {
    test('should return albums for a specific user', async () => {
      const response = await api.get('/users/1/albums');
      await api.verifyStatusCode(response, 200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test('all albums should belong to the requested user', async () => {
      const response = await api.get('/users/1/albums');
      const body = await response.json();
      body.forEach((album: { userId: number }) => {
        expect(album.userId).toBe(1);
      });
    });
  });
});
