import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { fabric } from 'fabric'
import CanvasEditor from '@/Components/CanvasEditor.vue'

// ---- Defensive fabric.Canvas mock (constructor) ----
const CanvasCtor = /** @type {import('vitest').Mock} */ (fabric.Canvas)

CanvasCtor.mockImplementation((elOrId, opts) => {
  // Resolve the element or id → real <canvas> in the DOM
  let el = elOrId
  if (typeof elOrId === 'string') {
    // try find existing, otherwise inject via innerHTML to bypass createElement patches
    el = document.getElementById(elOrId)
    if (!el) {
      document.body.insertAdjacentHTML('beforeend', `<canvas id="${elOrId}"></canvas>`)
      el = document.getElementById(elOrId)
    }
  }

  // If the provided value isn't a real node, coerce to a "node-like" object
  if (!el || typeof el.setAttribute !== 'function') {
    const fake = /** @type {any} */ ({
      setAttribute: () => {},
      getAttribute: () => null,
      style: {},
      width: 300,
      height: 150,
      toDataURL: () => 'data:image/png;base64,MOCK',
    })
    el = fake
  }

  // Fabric exposes these DOM nodes; point them at the same hardened element
  const lowerCanvasEl = /** @type {any} */ (el)
  const upperCanvasEl = /** @type {any} */ ({
    setAttribute: () => {},
    getAttribute: () => null,
    style: {},
  })

  return {
    // DOM elements Fabric usually provides
    lowerCanvasEl,
    upperCanvasEl,

    // keep the raw el reference for any custom code that expects it
    el,
    opts,

    // typical Fabric methods used in app code
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    getObjects: vi.fn(() => []),
    requestRenderAll: vi.fn(),
    loadFromJSON: vi.fn((json, cb) => cb && cb()),
    // common dimension APIs some apps call
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    setDimensions: vi.fn(),
    dispose: vi.fn(),
  }
})

 describe('CanvasEditor.vue', () => {

  // These hooks run before/after each test in this describe
  beforeEach(() => {
    document.body.innerHTML = `
      <canvas id="canvasEl"></canvas>
      <input id="email" type="email" />
    `
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('mounts successfully', async () => {
    const wrapper = mount(CanvasEditor, {
      attachTo: document.body,
      props: {
        email: 'testuser@sample.com',
        width: 72,
        height: 36,
        signType: 'Wall Sign Illuminated Cabinet',
        postalCode: '12345',
        designId: '',
      },
      global: {
        stubs: {
          Head: true,
          Link: true,
          Teleport: true,
          FontAwesomeIcon: { template: '<i />' },
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
