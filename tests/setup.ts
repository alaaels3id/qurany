import { beforeEach, vi } from 'vitest';

// Mock localStorage with Object.keys support
const createLocalStorageMock = () => {
  const store: Record<string, string> = {};

  const handler: ProxyHandler<any> = {
    get(target, prop: string) {
      if (prop === 'getItem') return (key: string) => store[key] ?? null;
      if (prop === 'setItem') return (key: string, val: string) => { store[key] = String(val); };
      if (prop === 'removeItem') return (key: string) => { delete store[key]; };
      if (prop === 'clear') return () => { for (const k of Object.keys(store)) delete store[k]; };
      if (prop === 'length') return Object.keys(store).length;
      if (prop === 'key') return (idx: number) => Object.keys(store)[idx] ?? null;
      return store[prop];
    },
    set(target, prop: string, val: any) {
      store[prop] = String(val);
      return true;
    },
    deleteProperty(target, prop: string) {
      delete store[prop];
      return true;
    },
    ownKeys() {
      return Object.keys(store);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in store) {
        return {
          value: store[prop as string],
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }
      return undefined;
    },
  };

  return new Proxy({}, handler);
};

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock(),
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Audio
class MockAudio {
  src = '';
  currentTime = 0;
  duration = 180;
  volume = 1;
  playbackRate = 1;
  paused = true;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  load = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

// @ts-ignore
window.Audio = MockAudio;

// Reset mocks before each test
beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  document.documentElement.className = '';
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
});
