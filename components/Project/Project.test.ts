import { describe, expect, it } from 'vitest';
import { parseStack, sortProjects, validateProjectInput } from './Project.utils';
import type { Project } from './Project.types';

const base = { title: 'A', summary: 'B', stack: [], featured: false };
const mk = (id: string, featured: boolean, createdAt: string): Project => ({
  ...base, id, featured, createdAt, updatedAt: createdAt,
});

describe('parseStack', () => {
  it('trims, drops empties and dedupes', () => {
    expect(parseStack(' React, Next.js,, React ')).toEqual(['React', 'Next.js']);
  });
});

describe('validateProjectInput', () => {
  it('accepts a minimal valid project', () => {
    const r = validateProjectInput({ title: 'T', summary: 'S' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toMatchObject({ title: 'T', stack: [], featured: false });
  });
  it('rejects missing fields and bad URLs', () => {
    const r = validateProjectInput({ title: '', summary: '', liveUrl: 'javascript:alert(1)' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toHaveLength(3);
  });
  it('accepts a comma string or array for stack', () => {
    const a = validateProjectInput({ title: 'T', summary: 'S', stack: 'a, b' });
    const b = validateProjectInput({ title: 'T', summary: 'S', stack: ['a', 'b'] });
    expect(a.ok && a.value.stack).toEqual(['a', 'b']);
    expect(b.ok && b.value.stack).toEqual(['a', 'b']);
  });
});

describe('sortProjects', () => {
  it('puts featured first, then newest', () => {
    const out = sortProjects([mk('old', false, '2026-01-01'), mk('new', false, '2026-02-01'), mk('feat', true, '2025-01-01')]);
    expect(out.map((p) => p.id)).toEqual(['feat', 'new', 'old']);
  });
});
