import { describe, it, expect } from 'vitest';
import { AppError } from '@/errors/AppError';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Test error', 400);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should have stack trace', () => {
    const error = new AppError('Stack test', 500);

    expect(error.stack).toBeDefined();
  });
});
