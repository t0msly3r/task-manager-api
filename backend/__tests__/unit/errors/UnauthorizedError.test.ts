import { describe, it, expect } from 'vitest';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { AppError } from '@/errors/AppError';

describe('UnauthorizedError', () => {
  it('should create error with default message', () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(401);
  });

  it('should create error with custom message', () => {
    const error = new UnauthorizedError('Invalid credentials');

    expect(error.message).toBe('Invalid credentials');
    expect(error.statusCode).toBe(401);
  });

  it('should be instance of AppError', () => {
    const error = new UnauthorizedError();

    expect(error).toBeInstanceOf(AppError);
  });
});
