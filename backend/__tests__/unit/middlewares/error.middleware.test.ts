import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { AppError } from '@/errors/AppError';
import { NotFoundError } from '@/errors/NotFoundError';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { ForbiddenError } from '@/errors/ForbiddenError';

vi.mock('@/config/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('error middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should handle AppError with correct status code', () => {
    const error = new AppError('Custom error', 400);

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Custom error' });
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('Task not found');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
  });

  it('should handle UnauthorizedError', () => {
    const error = new UnauthorizedError('Not authenticated');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
  });

  it('should handle ForbiddenError', () => {
    const error = new ForbiddenError('Access denied');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
  });

  it('should handle unknown errors with 500', () => {
    const error = new Error('Unexpected error');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('should handle non-Error objects', () => {
    const error = 'String error';

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
