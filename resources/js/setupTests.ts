import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import './tests/setup/mock-fabric'
import './tests/setup/svg-canvas-mocks'
/*import './tests/setup/textOnPath.mocks.ts';   // <-- no named import; just run it
import './tests/setup/svgAndCanvas.mocks.ts'; // (if you split out the SVG getPointAtLength mocks)*/
import { createRouter, createWebHistory } from 'vue-router';



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
// tests/setup/textOnPath.mocks.ts (or wherever your fabric mock lives)
import { vi } from 'vitest';


// ✅ Mock CSS Font Loading API
if (!('fonts' in document)) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: {
      // Pretend any font is available
      check: vi.fn(() => true),
      // Some libs await document.fonts.ready
      ready: Promise.resolve(),
      // No-op event handlers
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  })
}

/*
vi.mock('fabric', async () => {
  const actual = await vi.importActual<any>('fabric');

  // ----- your existing pieces (keep these) -----
  const canvasSpy = vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    getObjects: vi.fn(() => []),
    requestRenderAll: vi.fn(),
    loadFromJSON: vi.fn((json: any, cb?: Function) => cb && cb()),
  }));

  const rectMock = {
    set: vi.fn().mockReturnThis(),
    toObject: vi.fn(() => ({ type: 'rect' })),
    type: 'rect'
  };

  // ----- minimal classes used by textOnPath -----
  class FabricBase {
    left = 0; top = 0; angle = 0; scaleX = 1; scaleY = 1; flipX = false; flipY = false;
    selectable = true; evented = true; objectCaching = false; type = 'base';
    constructor(opts: Record<string, any> = {}) { Object.assign(this, opts); }
    set(props: Record<string, any>) { Object.assign(this, props); return this; }
    toObject(extra: string[] = []) {
      const base: any = { type: this.type };
      extra?.forEach(k => (base[k] = (this as any)[k]));
      return base;
    }
  }
  class FabricText extends FabricBase {
    type = 'text';
    originX = 'left'; originY = 'top';
    constructor(text: string, opts: any) { super(opts); (this as any).text = text; }
  }
  class FabricPath extends FabricBase {
    type = 'path';
    constructor(d: string, opts: any) { super(opts); (this as any).path = d; }
  }
  class FabricGroup extends FabricBase {
    type = 'group'; _objects: any[]; canvas: any = null;
    constructor(children: any[] = [], opts: any = {}) { super(opts); this._objects = children; }
    toObject(extra: string[] = []) {
      const base: any = super.toObject(extra);
      base.objects = this._objects.map((o: any) => o?.toObject?.() ?? { type: o?.type ?? 'unknown' });
      return base;
    }
  }

  // Build the namespace with your existing overrides + new classes
  const overrides = {
    Canvas: canvasSpy,
    Rect: vi.fn(() => rectMock),
    IText: vi.fn(() => ({})),
    Circle: vi.fn(() => ({})),
    Line: vi.fn(() => ({})),
    Image: { fromURL: vi.fn((_: any, cb: any) => cb({ set: vi.fn() })) },

    // NEW for textOnPath
    Path: FabricPath,
    Text: FabricText,
    Group: FabricGroup,
  };

  const fabricNS = { ...(actual.fabric ?? {}), ...overrides };

  // Return namespace + named + default for maximum compatibility
  return {
    ...actual,
    fabric: fabricNS,
    Path: FabricPath,
    Text: FabricText,
    Group: FabricGroup,
    default: { ...(actual.default ?? {}), fabric: fabricNS, Path: FabricPath, Text: FabricText, Group: FabricGroup },
  };
});*/







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
import { textOnPathMocks } from "@tests/setup/textOnPath.mocks";

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
