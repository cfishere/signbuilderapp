// tests/setup/textOnPath.mocks.ts
import { vi } from 'vitest'

// ---------- Canvas 2D measureText mock ----------
const mock2d = {
  font: '',
  measureText: (ch: string) => {
    // deterministic width per char; vary slightly by char code for realism
    const base = 10
    const tweak = (ch.codePointAt(0) ?? 0) % 3 // 0..2
    return { width: base + tweak }
  }
}

const origCreateElement = document.createElement.bind(document)
document.createElement = ((tag: string) => {
  if (tag.toLowerCase() === 'canvas') {
    return {
      getContext: (type: string) => (type === '2d' ? mock2d : null)
    } as unknown as HTMLCanvasElement
  }
  return origCreateElement(tag)
}) as any

// ---------- SVG path geometry mocks ----------
// We will override document.createElementNS to return path nodes with the needed methods.
// We don't parse the 'd'; we just simulate a 300px long "path" whose geometry we control.

const SVG_NS = 'http://www.w3.org/2000/svg'
const origCreateElementNS = document.createElementNS.bind(document)

document.createElementNS = ((ns: string, tag: string) => {
  if (ns === SVG_NS && tag.toLowerCase() === 'svg') {
    const svg = origCreateElementNS(ns, tag) as SVGSVGElement
    // keep tiny size; not actually added to layout in tests
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    return svg
  }

  if (ns === SVG_NS && tag.toLowerCase() === 'path') {
    const pathLike: any = origCreateElementNS(ns, tag)

    // Pretend the path is a simple horizontal polyline from x=0..300 at y=100.
    // getTotalLength = 300; getPointAtLength(s) = { x: s, y: 100 }
    let total = 300
    pathLike.setAttribute = vi.fn()
    pathLike.getTotalLength = () => total
    pathLike.getPointAtLength = (s: number) => {
      const clamped = Math.max(0, Math.min(s, total))
      return { x: clamped, y: 100 }
    }
    return pathLike as SVGPathElement
  }

  return origCreateElementNS(ns, tag)
}) as any

// ---------- Minimal fabric mock ----------
class FabricBase {
  left = 0
  top = 0
  angle = 0
  scaleX = 1
  scaleY = 1
  flipX = false
  flipY = false
  selectable = true
  evented = true
  objectCaching = false
  type = 'base'
  constructor(public options: Record<string, any> = {}) {
    Object.assign(this, options)
  }
  set(props: Record<string, any>) { Object.assign(this, props); return this }
  toObject(extra: string[] = []) {
    const base = { type: this.type }
    extra.forEach(k => ((base as any)[k] = (this as any)[k]))
    return base
  }
}

class FabricText extends FabricBase {
  type = 'text'
  originX = 'left'
  originY = 'top'
  constructor(text: string, opts: any) { super(opts); (this as any).text = text }
}

class FabricPath extends FabricBase {
  type = 'path'
  constructor(d: string, opts: any) { super(opts); (this as any).path = d }
}

class FabricGroup extends FabricBase {
  type = 'group'
  _objects: FabricBase[]
  canvas: any = null
  constructor(children: any[], opts: any = {}) {
    super(opts)
    this._objects = children as any[]
  }
  toObject(extra: string[] = []) {
    const base = super.toObject(extra)
    ;(base as any).objects = this._objects.map(o => o.toObject())
    return base
  }
}

const fabric = { Text: FabricText, Path: FabricPath, Group: FabricGroup }

// Make it available to modules that `import { fabric } from 'fabric'`
vi.mock('fabric', () => ({ fabric }))
