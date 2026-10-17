import { describe, expect, it } from 'vitest';
import { fromRow, toRow, type ProjectRow } from './supabaseStore';

const row: ProjectRow = {
  id: 'id1', title: 'T', summary: 'S', role: null, stack: ['a'], live_url: 'https://x.dev',
  repo_url: null, screenshot: null, featured: true, created_at: '2026-01-01', updated_at: '2026-01-02',
};

describe('supabase row mapping', () => {
  it('maps nulls to undefined and snake_case to camelCase', () => {
    expect(fromRow(row)).toEqual({
      id: 'id1', title: 'T', summary: 'S', role: undefined, stack: ['a'], liveUrl: 'https://x.dev',
      repoUrl: undefined, screenshot: undefined, featured: true, createdAt: '2026-01-01', updatedAt: '2026-01-02',
    });
  });
  it('sends explicit nulls so cleared fields clear', () => {
    const out = toRow({ title: 'T', summary: 'S', stack: [], featured: false });
    expect(out).toMatchObject({ role: null, live_url: null, repo_url: null, screenshot: null });
  });
});
