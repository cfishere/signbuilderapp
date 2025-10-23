// tests/vitest.setup.js
import { vi } from 'vitest';

let canvasSpy;

vi.mock('fabric', async (importOriginal) => {
  const actual = await importOriginal();

  const mockCanvasInstance = {
    on: vi.fn(),
    add: vi.fn(),
    renderAll: vi.fn(),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn().mockReturnValue({}),
    discardActiveObject: vi.fn(),
    getWidth: () => 800,
    getHeight: () => 800,
  };

  canvasSpy = vi.fn(() => mockCanvasInstance);

  return {
    ...actual,
    fabric: {
      ...actual.fabric,
      Canvas: canvasSpy,
      Rect: vi.fn(() => ({ on: vi.fn() })),
      IText: vi.fn(() => ({})),
      Circle: vi.fn(() => ({})),
      Line: vi.fn(() => ({})),
      Image: {
        fromURL: vi.fn((_, cb) => cb({ set: vi.fn() })),
      }
    }
  };
});

// Expose spy globally so your test can use it
globalThis.__canvasSpy = () => canvasSpy;
