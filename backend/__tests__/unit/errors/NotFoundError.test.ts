import { describe, it, expect } from 'vitest';
import { NotFoundError } from '@/errors/NotFoundError';
import { AppError } from '@/errors/AppError';

describe('NotFoundError', () => {
  it('should create error with default message', () => {
    const error = new NotFoundError();

    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create error with custom message', () => {
    const error = new NotFoundError('User not found');

    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  it('should be instance of AppError', () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(AppError);
  });
});
