// resources/js/tests/setup/fabricMock.ts
import { vi } from 'vitest'

const mockCanvas = vi.fn().mockImplementation(() => ({
  add: vi.fn(),
  remove: vi.fn(),
  getObjects: vi.fn().mockReturnValue([]),
  getActiveObjects: vi.fn().mockReturnValue([]),
  setDimensions: vi.fn(),
  setViewportTransform: vi.fn(),
  setZoom: vi.fn(),
  calcOffset: vi.fn(),
  requestRenderAll: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  dispose: vi.fn(),
  getWidth: vi.fn().mockReturnValue(800),
  getHeight: vi.fn().mockReturnValue(600),
}))

const fabric = {
  Canvas: mockCanvas,
  Path: vi.fn().mockImplementation(() => ({})),
  TextPath: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    setCoords: vi.fn(),
  })),
  // add other classes you need…
}

vi.mock('@/utils/fabricRef', () => ({
  fabric,
  default: fabric,
}))
