import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '@/services/auth.service';
import { prisma } from '@/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { NotFoundError } from '@/errors/NotFoundError';
import { AppError } from '@/errors/AppError';

vi.mock('@/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('@/config/logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

const mockPrisma = vi.mocked(prisma);
const mockBcrypt = vi.mocked(bcrypt);
const mockJwt = vi.mocked(jwt);

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await authService.registerUser('test@test.com', 'password123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 1);
    });

    it('should throw error if user already exists', async () => {
      const existingUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(authService.registerUser('test@test.com', 'password123')).rejects.toThrow(
        AppError,
      );

      await expect(authService.registerUser('test@test.com', 'password123')).rejects.toThrow(
        'User already exist',
      );
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedpassword',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('fake-token' as never);

      const result = await authService.loginUser('test@test.com', 'password123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(mockJwt.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'fake-token');
      expect(result.user).toEqual({
        id: 1,
        email: 'test@test.com',
        role: 'USER',
      });
    });

    it('should throw UnauthorizedError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.loginUser('test@test.com', 'password123')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw UnauthorizedError if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(authService.loginUser('test@test.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('getMe', () => {
    it('should return user without password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        role: 'USER',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.getMe(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, email: true, role: true, createdAt: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getMe(999)).rejects.toThrow(NotFoundError);
    });
  });
});
