import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn(),
  },
}));

vi.mock('@/config/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import request from 'supertest';
import app from '@/app';
import { prisma } from '@/prisma';
import jwt from 'jsonwebtoken';

const mockPrisma = vi.mocked(prisma);
const mockJwt = vi.mocked(jwt);

describe('Task routes (integration)', () => {
  const mockUser = { userId: 1, email: 'test@test.com', role: 'USER' };
  const mockAdmin = { userId: 1, email: 'admin@test.com', role: 'ADMIN' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockJwt.verify.mockReturnValue(mockUser);
  });

  const authenticate = (user = mockUser) => {
    mockJwt.verify.mockReturnValue(user);
    return { Authorization: 'Bearer valid-token' };
  };

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test task',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.task.create.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .set(authenticate())
        .send({ title: 'Test task' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test task');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test task' });

      expect(response.status).toBe(401);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .set(authenticate())
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/tasks')
        .set(authenticate())
        .send({ title: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return user tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks')
        .set(authenticate());

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('should return all tasks for admin', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', completed: true, userId: 2, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks')
        .set(authenticate(mockAdmin));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /tasks/:id', () => {
    const existingTask = {
      id: 1,
      title: 'Old title',
      completed: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(existingTask);
      mockPrisma.task.update.mockResolvedValue({
        ...existingTask,
        title: 'New title',
        completed: true,
      });

      const response = await request(app)
        .put('/tasks/1')
        .set(authenticate())
        .send({ title: 'New title', completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'New title');
    });

    it('should return 404 if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/tasks/999')
        .set(authenticate())
        .send({ title: 'New title' });

      expect(response.status).toBe(404);
    });

    it('should return 403 if user does not own the task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 999,
      });

      const response = await request(app)
        .put('/tasks/1')
        .set(authenticate())
        .send({ title: 'New title' });

      expect(response.status).toBe(403);
    });

    it('should allow admin to update any task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 999,
      });
      mockPrisma.task.update.mockResolvedValue({
        ...existingTask,
        title: 'New title',
      });

      const response = await request(app)
        .put('/tasks/1')
        .set(authenticate(mockAdmin))
        .send({ title: 'New title' });

      expect(response.status).toBe(200);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/tasks/1')
        .send({ title: 'New title' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /tasks/:id', () => {
    const existingTask = {
      id: 1,
      title: 'Task',
      completed: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should delete a task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(existingTask);
      mockPrisma.task.delete.mockResolvedValue(existingTask);

      const response = await request(app)
        .delete('/tasks/1')
        .set(authenticate());

      expect(response.status).toBe(204);
    });

    it('should return 404 if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/tasks/999')
        .set(authenticate());

      expect(response.status).toBe(404);
    });

    it('should return 403 if user does not own the task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 999,
      });

      const response = await request(app)
        .delete('/tasks/1')
        .set(authenticate());

      expect(response.status).toBe(403);
    });

    it('should allow admin to delete any task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 999,
      });
      mockPrisma.task.delete.mockResolvedValue(existingTask);

      const response = await request(app)
        .delete('/tasks/1')
        .set(authenticate(mockAdmin));

      expect(response.status).toBe(204);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(401);
    });
  });
});
