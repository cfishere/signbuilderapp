import { vi } from 'vitest'

// (Optional) trace that this file actually runs
console.info('[vitest] mock-fabric loaded')

/** Minimal classes used by textOnPath + a couple core shapes you already mock */
class FabricBase {
  left = 0; top = 0; angle = 0; scaleX = 1; scaleY = 1; flipX = false; flipY = false;
  selectable = true; evented = true; objectCaching = false; type = 'base';
  constructor(opts: Record<string, any> = {}) { Object.assign(this, opts) }
  set(props: Record<string, any>) { Object.assign(this, props); return this }
  toObject(extra: string[] = []) {
    const base: any = super.toObject(extra)
    base.objects = this._objects.map((o: any) => o?.toObject?.() ?? { type: o?.type ?? 'unknown' })
    // If extra props requested (like 'data'), include them:
    extra?.forEach((k) => { if (k in this) base[k] = (this as any)[k] })
    // Safety: if caller forgot to pass extra but we have a data blob, include it
    if (!base.data && (this as any).data) base.data = (this as any).data
    return base
  }
}
class FabricText extends FabricBase { type = 'text'; originX = 'left'; originY = 'top';
  constructor(text: string, opts: any) { super(opts); (this as any).text = text } }
class FabricPath extends FabricBase { type = 'path';
  constructor(d: string, opts: any) { super(opts); (this as any).path = d } }
class FabricGroup extends FabricBase { type = 'group'; _objects: any[]; canvas: any = null;
  constructor(children: any[] = [], opts: any = {}) { super(opts); this._objects = children }
  toObject(extra: string[] = []) {
    const base: any = super.toObject(extra)
    base.objects = this._objects.map((o: any) => o?.toObject?.() ?? { type: o?.type ?? 'unknown' })
    include explicitly requested extras and ensure 'data' persists
    extra?.forEach((k) => { if (k in this) base[k] = (this as any)[k] })
    if (!base.data && (this as any).data) base.data = (this as any).data
    return base
  }
}

// Your existing spies/mocks (keep if you need them)
const Canvas = vi.fn(() => ({
  on: vi.fn(), off: vi.fn(), add: vi.fn(), remove: vi.fn(),
  setActiveObject: vi.fn(), getActiveObject: vi.fn(),
  getObjects: vi.fn(() => []), requestRenderAll: vi.fn(),
  loadFromJSON: vi.fn((json: any, cb?: Function) => cb && cb()),
}))
const Rect   = vi.fn(() => ({ type: 'rect', set: vi.fn().mockReturnThis(), toObject: vi.fn(() => ({ type: 'rect' })) }))
const IText  = vi.fn(() => ({}))
const Circle = vi.fn(() => ({}))
const Line   = vi.fn(() => ({}))
const Image  = { fromURL: vi.fn((_: any, cb: any) => cb({ set: vi.fn() })) }

// Build namespace used by "import { fabric } from 'fabric'"
const fabricNS = {
  Canvas, Rect, IText, Circle, Line, Image,
  // REQUIRED by textOnPath:
  Path: FabricPath,
  Text: FabricText,
  Group: FabricGroup,
}

// Export namespace + named + default (covers all import styles)
vi.mock('fabric', () => ({
  fabric: fabricNS,                           // import { fabric } from 'fabric'
  Path: FabricPath, Text: FabricText, Group: FabricGroup,  // import { Path } from 'fabric'
  default: { fabric: fabricNS, Path: FabricPath, Text: FabricText, Group: FabricGroup }, // import fabric from 'fabric'
}))
