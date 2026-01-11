// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { notesService, NoteResponse } from '../notesService';

// polyfill localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => delete store[key],
    clear: () => { store = {}; }
  };
})();

// @ts-ignore
global.localStorage = localStorageMock;

describe('notesService', () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it('list returns notes', async () => {
    const expected: NoteResponse[] = [
      { id: 1, userId: 1, title: 'A', content: 'a', isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    mock.onGet('/notes').reply(200, expected);
    const res = await notesService.list();
    expect(res).toEqual(expected);
  });

  it('create posts and returns new note', async () => {
    const created: NoteResponse = { id: 2, userId: 1, title: 'New', content: 'x', isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mock.onPost('/notes').reply(201, created);
    const res = await notesService.create({ title: 'New', content: 'x' });
    expect(res).toEqual(created);
  });

  it('update calls put and returns updated', async () => {
    const updated: NoteResponse = { id: 2, userId: 1, title: 'Updated', content: 'y', isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mock.onPut('/notes/2').reply(200, updated);
    const res = await notesService.update(2, { title: 'Updated', content: 'y' });
    expect(res).toEqual(updated);
  });

  it('delete calls delete', async () => {
    mock.onDelete('/notes/3').reply(204);
    await expect(notesService.delete(3)).resolves.toBeUndefined();
  });
});
