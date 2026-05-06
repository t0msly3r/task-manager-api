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

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
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
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const mockPrisma = vi.mocked(prisma);
const mockBcrypt = vi.mocked(bcrypt);
const mockJwt = vi.mocked(jwt);

describe('Auth routes (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', 'test@test.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed' });

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exist');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'short' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedpassword',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('valid-token' as never);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'valid-token');
      expect(response.body.user).toEqual({
        id: 1,
        email: 'test@test.com',
        role: 'USER',
      });
    });

    it('should return 401 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('should return authenticated user', async () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'USER', createdAt: new Date() };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const token = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue({ userId: 1, email: 'test@test.com', role: 'USER' });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@test.com');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 if token is invalid', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });
  });
});
