import { describe, it, expect } from 'vitest';
import { ForbiddenError } from '@/errors/ForbiddenError';
import { AppError } from '@/errors/AppError';

describe('ForbiddenError', () => {
  it('should create error with default message', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe('Forbidden');
    expect(error.statusCode).toBe(403);
  });

  it('should create error with custom message', () => {
    const error = new ForbiddenError('Access denied');

    expect(error.message).toBe('Access denied');
    expect(error.statusCode).toBe(403);
  });

  it('should be instance of AppError', () => {
    const error = new ForbiddenError();

    expect(error).toBeInstanceOf(AppError);
  });
});
