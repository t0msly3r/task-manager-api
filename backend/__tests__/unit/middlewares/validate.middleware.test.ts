import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { validate } from '@/middlewares/validate.middleware';

describe('validate middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it('should call next if validation passes', () => {
    const schema = z.object({ name: z.string() });
    req.body = { name: 'Test' };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    const schema = z.object({ name: z.string() });
    req.body = { name: 123 };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.any(Object),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate params when property is params', () => {
    const schema = z.object({ id: z.coerce.number() });
    req.params = { id: '123' };

    const middleware = validate(schema, 'params');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.params.id).toBe(123);
  });

  it('should validate query when property is query', () => {
    const schema = z.object({ page: z.coerce.number() });
    req.query = { page: '5' };

    const middleware = validate(schema, 'query');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query.page).toBe(5);
  });

  it('should replace request property with parsed data', () => {
    const schema = z.object({
      title: z.string(),
      completed: z.boolean(),
    });
    req.body = { title: 'Test', completed: true };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(req.body).toEqual({ title: 'Test', completed: true });
  });
});
