import { vi } from 'vitest'

console.info('[vitest] mock-fabric loaded')

class FabricBase {
  left = 0; top = 0; angle = 0; scaleX = 1; scaleY = 1; flipX = false; flipY = false;
  selectable = true; evented = true; objectCaching = false; type = 'base';
  constructor(opts: Record<string, any> = {}) { Object.assign(this, opts) }
  set(props: Record<string, any>) { Object.assign(this, props); return this }
  toObject(extra: string[] = []) {
    const base: any = { type: this.type }
    extra?.forEach(k => (base[k] = (this as any)[k]))
    return base
  }
}
class FabricText extends FabricBase { type = 'text'; originX = 'left'; originY = 'top';
  constructor(text: string, opts: any) { super(opts); (this as any).text = text } }
class FabricPath extends FabricBase { type = 'path';
  constructor(d: string, opts: any) { super(opts); (this as any).path = d } }
class FabricGroup extends FabricBase {
  type = 'group'; _objects: any[]; canvas: any = null;
  constructor(children: any[] = [], opts: any = {}) { super(opts); this._objects = children }
  toObject(extra: string[] = []) {
    const base: any = super.toObject(extra)
    base.objects = this._objects.map((o: any) => o?.toObject?.() ?? { type: o?.type ?? 'unknown' })
    // include requested extras; always include data if present
    extra?.forEach((k) => { if (k in this) base[k] = (this as any)[k] })
    if ((this as any).data) base.data = (this as any).data
    return base
  }
}

// 👇 constructor mock used in tests
const Canvas = vi.fn(() => ({
  on: vi.fn(), off: vi.fn(), add: vi.fn(), remove: vi.fn(),
  setActiveObject: vi.fn(), getActiveObject: vi.fn(),
  getObjects: vi.fn(() => []), requestRenderAll: vi.fn(),
  loadFromJSON: vi.fn((json: any, cb?: Function) => cb && cb()),
  setWidth: vi.fn(), setHeight: vi.fn(), setDimensions: vi.fn(),
  getWidth: vi.fn(), getHeight: vi.fn(), getZoom: vi.fn(),
  dispose: vi.fn(),
  calcOffset: vi.fn(),                     // 👈 add this
  lowerCanvasEl: {
    setAttribute: () => {},
    style: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 150 }), // 👈 safe default
  } as any,
  upperCanvasEl: {
    setAttribute: () => {},
    style: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 150 }),
  } as any,
}))


// namespace for `import { fabric }`
const fabricNS = {
  Canvas,                       // ✅ namespace constructor
  Rect: vi.fn(() => ({ type: 'rect', set: vi.fn().mockReturnThis(), toObject: vi.fn(() => ({ type: 'rect' })) })),
  IText: vi.fn(() => ({})),
  Circle: vi.fn(() => ({})),
  Line: vi.fn(() => ({})),
  Image: { fromURL: vi.fn((_: any, cb: any) => cb({ set: vi.fn() })) },

  Path: FabricPath,
  Text: FabricText,
  Group: FabricGroup,
}

// ✅ export namespace + **named** + default

vi.mock('@/utils/fabricRef', () => ({ 
  fabric: fabricNS,            // import { fabric } from 'fabric'
  Canvas,                      // ✅ import { Canvas } from 'fabric'
  Path: FabricPath,
  Text: FabricText,
  Group: FabricGroup,
  default: {                   // import fabric from 'fabric'
    fabric: fabricNS,
    Canvas,                    // ✅ also available on default
    Path: FabricPath,
    Text: FabricText,
    Group: FabricGroup,
  },
}))
