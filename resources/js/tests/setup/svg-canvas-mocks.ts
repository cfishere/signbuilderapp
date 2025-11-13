console.info('[vitest] svg-canvas mocks loaded')

// ✅ DO NOT override document.createElement at all.
// JSDOM will create real Elements with setAttribute, style, etc.

// Only mock SVG path geometry we rely on (used by textOnPath utils)
const SVG_NS = 'http://www.w3.org/2000/svg'
const origCreateElementNS = document.createElementNS.bind(document)

document.createElementNS = ((ns: string, tag: string) => {
  if (ns === SVG_NS && tag.toLowerCase() === 'svg') {
    const svg = origCreateElementNS(ns, tag) as SVGSVGElement
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    return svg
  }
  if (ns === SVG_NS && tag.toLowerCase() === 'path') {
    const pathLike: any = origCreateElementNS(ns, tag)
    const total = 300
    pathLike.getTotalLength = () => total
    pathLike.getPointAtLength = (s: number) => {
      const clamped = Math.max(0, Math.min(s, total))
      return { x: clamped, y: 100 }
    }
    pathLike.setAttribute = () => {}
    return pathLike as SVGPathElement
  }
  return origCreateElementNS(ns, tag)
}) as any
