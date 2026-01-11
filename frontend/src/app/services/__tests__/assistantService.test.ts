// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { assistantService } from '../assistantService';

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

describe('assistantService', () => {
  const mock = new MockAdapter(api);
  afterEach(() => mock.reset());

  it('chat posts and returns reply', async () => {
    mock.onPost('/assistant/chat').reply(200, { reply: 'You can create notes by clicking New Note.' });
    const r = await assistantService.chat('How to create notes?');
    expect(r).toBe('You can create notes by clicking New Note.');
  });

  it('status returns configuration info', async () => {
    mock.onGet('/assistant/status').reply(200, { configured: true, message: 'Assistant configured' });
    const s = await assistantService.status();
    expect(s.configured).toBe(true);
    expect(s.message).toBe('Assistant configured');
  });
});
