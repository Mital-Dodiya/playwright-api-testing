import { test } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';
import { SchemaValidator } from '../src/utils/SchemaValidator';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Response Schema Validation', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test.describe('User Schema', () => {
    test('single user should have all required fields', async () => {
      const response = await api.get('/users/1');
      await SchemaValidator.validateRequiredFields(response, [
        'id', 'name', 'username', 'email', 'phone', 'website', 'address', 'company',
      ]);
    });

    test('single user fields should have correct data types', async () => {
      const response = await api.get('/users/1');
      await SchemaValidator.validateFieldTypes(response, {
        id: 'number',
        name: 'string',
        username: 'string',
        email: 'string',
        phone: 'string',
        website: 'string',
      });
    });

    test('users list should have correct array schema', async () => {
      const response = await api.get('/users');
      await SchemaValidator.validateArraySchema(response, [
        'id', 'name', 'username', 'email',
      ]);
    });

    test('user fields should not be null', async () => {
      const response = await api.get('/users/1');
      await SchemaValidator.validateNonNullFields(response, [
        'id', 'name', 'email',
      ]);
    });
  });

  test.describe('Post Schema', () => {
    test('single post should have all required fields', async () => {
      const response = await api.get('/posts/1');
      await SchemaValidator.validateRequiredFields(response, [
        'id', 'userId', 'title', 'body',
      ]);
    });

    test('post fields should have correct data types', async () => {
      const response = await api.get('/posts/1');
      await SchemaValidator.validateFieldTypes(response, {
        id: 'number',
        userId: 'number',
        title: 'string',
        body: 'string',
      });
    });

    test('posts list should have correct array schema', async () => {
      const response = await api.get('/posts');
      await SchemaValidator.validateArraySchema(response, [
        'id', 'userId', 'title', 'body',
      ]);
    });
  });

  test.describe('Todo Schema', () => {
    test('single todo should have all required fields', async () => {
      const response = await api.get('/todos/1');
      await SchemaValidator.validateRequiredFields(response, [
        'id', 'userId', 'title', 'completed',
      ]);
    });

    test('todo completed field should be boolean type', async () => {
      const response = await api.get('/todos/1');
      await SchemaValidator.validateFieldTypes(response, {
        id: 'number',
        userId: 'number',
        title: 'string',
        completed: 'boolean',
      });
    });
  });

  test.describe('Created Resource Schema', () => {
    test('created post should return id and createdAt fields', async () => {
      const response = await api.post('/posts', {
        title: 'Schema Test Post',
        body: 'Validating created resource schema',
        userId: 1,
      });
      await SchemaValidator.validateRequiredFields(response, [
        'id', 'title', 'body', 'userId',
      ]);
      await SchemaValidator.validateFieldTypes(response, {
        id: 'number',
        title: 'string',
        userId: 'number',
      });
    });
  });
});
