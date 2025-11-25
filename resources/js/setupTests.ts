import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import './tests/setup/mock-fabric'      // the ONLY vi.mock('fabric') lives here
import './tests/setup/svg-canvas-mocks' // DOM/canvas/SVG helpers
/*import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: []
    })
  }
}));
*/

// Mock window.alert globally
global.alert = vi.fn();  // Prevents JSDOM error: Not implemented: window.alert

// Simulate Inertia's page context
global.window.__INITIAL_PAGE__ = {
  props: {
    auth: {
      user: null // or add a test user here if needed
    }
  }
};

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

  const rectMock = {
    on: vi.fn(),
    sendToBack: vi.fn(),
    set: vi.fn(),
    toObject: vi.fn(() => ({})),
  };

  canvasSpy = vi.fn(() => mockCanvasInstance);

  return {
    ...actual,
    fabric: {
      ...actual.fabric,
      Canvas: canvasSpy,
      Rect: vi.fn(() => rectMock),
      IText: vi.fn(() => ({})),
      Circle: vi.fn(() => ({})),
      Line: vi.fn(() => ({})),
      Image: {
        fromURL: vi.fn((_, cb) => cb({ set: vi.fn() })),
      }
    }
  };
});

//  Mock axios globally
/*vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(() => Promise.resolve({ data: [] })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({ data: {} })),
    },
  };
});*/



// Expose spy globally so your test can use it
globalThis.__canvasSpy = () => canvasSpy;



/*//  Setup global router
import DesignerSetup from '@/Components/DesignerSetup.vue';
import CanvasEditor from '@/Components/CanvasEditor.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'GetStarted',
      component: DesignerSetup,
    },
    {
      path: '/canvas',
      name: 'CanvasEditor',
      component: CanvasEditor,
      props: route => ({
        width: Number(route.query.width),
        height: Number(route.query.height),
        signType: route.query.type,
        postalCode: route.query.postal,
      }),
    },
  ],
});

//  Register globally for all tests
config.global.plugins = [router];*/
