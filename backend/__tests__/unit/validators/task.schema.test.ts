import { describe, it, expect } from 'vitest';
import { createTaskSchema, updateTaskSchema, idParamSchema } from '@/validators/task.schema';

describe('createTaskSchema', () => {
  it('should validate valid task', () => {
    const result = createTaskSchema.safeParse({ title: 'Test task' });

    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = createTaskSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
  });

  it('should reject missing title', () => {
    const result = createTaskSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('should reject non-string title', () => {
    const result = createTaskSchema.safeParse({ title: 123 });

    expect(result.success).toBe(false);
  });
});

describe('updateTaskSchema', () => {
  it('should validate valid update with title', () => {
    const result = updateTaskSchema.safeParse({ title: 'Updated title' });

    expect(result.success).toBe(true);
  });

  it('should validate valid update with completed', () => {
    const result = updateTaskSchema.safeParse({ completed: true });

    expect(result.success).toBe(true);
  });

  it('should validate valid update with both fields', () => {
    const result = updateTaskSchema.safeParse({ title: 'Updated', completed: false });

    expect(result.success).toBe(true);
  });

  it('should validate empty object (all fields optional)', () => {
    const result = updateTaskSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it('should reject invalid title type', () => {
    const result = updateTaskSchema.safeParse({ title: 123 });

    expect(result.success).toBe(false);
  });

  it('should reject invalid completed type', () => {
    const result = updateTaskSchema.safeParse({ completed: 'yes' });

    expect(result.success).toBe(false);
  });

  it('should reject empty string title', () => {
    const result = updateTaskSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
  });
});

describe('idParamSchema', () => {
  it('should validate valid numeric id', () => {
    const result = idParamSchema.safeParse({ id: '1' });

    expect(result.success).toBe(true);
    expect((result as any).data.id).toBe(1);
  });

  it('should coerce string to number', () => {
    const result = idParamSchema.safeParse({ id: '42' });

    expect(result.success).toBe(true);
    expect((result as any).data.id).toBe(42);
  });

  it('should reject negative id', () => {
    const result = idParamSchema.safeParse({ id: '-1' });

    expect(result.success).toBe(false);
  });

  it('should reject zero id', () => {
    const result = idParamSchema.safeParse({ id: '0' });

    expect(result.success).toBe(false);
  });

  it('should reject non-numeric id', () => {
    const result = idParamSchema.safeParse({ id: 'abc' });

    expect(result.success).toBe(false);
  });

  it('should reject float id', () => {
    const result = idParamSchema.safeParse({ id: '1.5' });

    expect(result.success).toBe(false);
  });
});
