import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';
import { ResponseAnalytics } from '../src/utils/ResponseAnalytics';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Response Analytics Tests', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('COUNT — Total Records', () => {
    test('should return 10 users in total', async () => {
      const response = await api.get('/users');
      const count = await ResponseAnalytics.count(response);
      expect(count).toBe(10);
    });

    test('should return 100 posts in total', async () => {
      const response = await api.get('/posts');
      const count = await ResponseAnalytics.count(response);
      expect(count).toBe(100);
    });

    test('should return 200 todos in total', async () => {
      const response = await api.get('/todos');
      const count = await ResponseAnalytics.count(response);
      expect(count).toBe(200);
    });
  });

  test.describe('MIN / MAX — Range Validation', () => {
    test('user IDs should range from 1 to 10', async () => {
      const response = await api.get('/users');
      const minId = await ResponseAnalytics.min(response, 'id');
      const maxId = await ResponseAnalytics.max(response, 'id');
      expect(minId).toBe(1);
      expect(maxId).toBe(10);
    });

    test('post IDs should range from 1 to 100', async () => {
      const response = await api.get('/posts');
      const minId = await ResponseAnalytics.min(response, 'id');
      const maxId = await ResponseAnalytics.max(response, 'id');
      expect(minId).toBe(1);
      expect(maxId).toBe(100);
    });
  });

  test.describe('DISTINCT — Unique Values', () => {
    test('posts should have 10 distinct userIds', async () => {
      const response = await api.get('/posts');
      const distinctUserIds = await ResponseAnalytics.distinct(response, 'userId');
      expect(distinctUserIds.length).toBe(10);
    });

    test('todos completed field should have exactly 2 distinct values', async () => {
      const response = await api.get('/todos');
      const distinctValues = await ResponseAnalytics.distinct(response, 'completed');
      expect(distinctValues.length).toBe(2);
      expect(distinctValues).toContain(true);
      expect(distinctValues).toContain(false);
    });
  });

  test.describe('FILTER — WHERE Equivalent', () => {
    test('should return only posts for userId 1', async () => {
      const response = await api.get('/posts');
      const filtered = await ResponseAnalytics.filterBy(response, 'userId', 1);
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((post: unknown) => {
        expect((post as { userId: number }).userId).toBe(1);
      });
    });

    test('should return only completed todos', async () => {
      const response = await api.get('/todos');
      const completed = await ResponseAnalytics.filterBy(response, 'completed', true);
      expect(completed.length).toBeGreaterThan(0);
    });

    test('should return only incomplete todos', async () => {
      const response = await api.get('/todos');
      const incomplete = await ResponseAnalytics.filterBy(response, 'completed', false);
      expect(incomplete.length).toBeGreaterThan(0);
    });
  });

  test.describe('AVG — Average Calculation', () => {
    test('average userId across posts should be 5.5', async () => {
      const response = await api.get('/posts');
      const avg = await ResponseAnalytics.average(response, 'userId');
      expect(avg).toBe(5.5);
    });
  });
});
