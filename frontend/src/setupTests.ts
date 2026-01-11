// Basic test setup: polyfill localStorage and any DOM APIs
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, val: string) { this.store[key] = String(val); }
  removeItem(key: string) { delete this.store[key]; }
}

// @ts-ignore
global.localStorage = new LocalStorageMock();

// Minimal matchMedia mock for some components
// @ts-ignore
window.matchMedia = window.matchMedia || function() { return { matches: false, addListener: () => {}, removeListener: () => {} }; };
