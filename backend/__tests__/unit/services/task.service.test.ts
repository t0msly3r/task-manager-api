import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as taskService from '@/services/task.service';
import { prisma } from '@/prisma';
import { NotFoundError } from '@/errors/NotFoundError';
import { ForbiddenError } from '@/errors/ForbiddenError';
import { Role } from '@prisma/client';

vi.mock('@/prisma', () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockPrisma = vi.mocked(prisma);

describe('task service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = { id: 1, title: 'Test task', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.task.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask('Test task', 1);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: { title: 'Test task', userId: 1 },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks for admin', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', completed: true, userId: 2, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getTasks(1, Role.ADMIN);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(mockTasks);
    });

    it('should return only user tasks for non-admin', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getTasks(1, Role.USER);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('updateTask', () => {
    const mockTask = { id: 1, title: 'Old title', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() };

    it('should update task when user is owner', async () => {
      const updatedTask = { ...mockTask, title: 'New title', completed: true };
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, 1, 'New title', true, Role.USER);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'New title', completed: true },
      });
      expect(result).toEqual(updatedTask);
    });

    it('should update task when user is admin', async () => {
      const updatedTask = { ...mockTask, title: 'New title', completed: true };
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, 2, 'New title', true, Role.ADMIN);

      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundError if task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(taskService.updateTask(1, 1, 'New title', true, Role.USER)).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user is not owner and not admin', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      await expect(taskService.updateTask(1, 2, 'New title', true, Role.USER)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('deleteTask', () => {
    const mockTask = { id: 1, title: 'Task', completed: false, userId: 1, createdAt: new Date(), updatedAt: new Date() };

    it('should delete task when user is owner', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      await taskService.deleteTask(1, 1, Role.USER);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should delete task when user is admin', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      await taskService.deleteTask(2, 1, Role.ADMIN);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundError if task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(taskService.deleteTask(1, 1, Role.USER)).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user is not owner and not admin', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      await expect(taskService.deleteTask(2, 1, Role.USER)).rejects.toThrow(ForbiddenError);
    });
  });
});
