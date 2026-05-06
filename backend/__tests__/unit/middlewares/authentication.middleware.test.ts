import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middlewares/authentication.middleware';

vi.mock('jsonwebtoken');

const mockJwt = vi.mocked(jwt);

describe('authentication middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 if no authorization header', () => {
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('should return 401 if token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat';

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token format' });
  });

  it('should authenticate user with valid token', () => {
    const mockPayload = { userId: 1, email: 'test@test.com', role: 'USER' };
    mockJwt.verify.mockReturnValue(mockPayload);
    req.headers.authorization = 'Bearer validtoken';

    authenticate(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith('validtoken', expect.any(String));
    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    req.headers.authorization = 'Bearer invalidtoken';

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
