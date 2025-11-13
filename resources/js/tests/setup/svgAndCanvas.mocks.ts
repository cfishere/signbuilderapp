// tests/setup/svgAndCanvas.mocks.ts
// Canvas 2D
const mock2d = { font: '', measureText: (ch: string) => ({ width: 10 + ((ch.codePointAt(0) ?? 0) % 3) }) };
const origCreateElement = document.createElement.bind(document);
document.createElement = ((tag: string) => tag.toLowerCase() === 'canvas'
  ? ({ getContext: (t: string) => (t === '2d' ? mock2d : null) } as any)
  : origCreateElement(tag)
) as any;

// SVG path
const SVG_NS = 'http://www.w3.org/2000/svg';
const origCreateElementNS = document.createElementNS.bind(document);
document.createElementNS = ((ns: string, tag: string) => {
  if (ns === SVG_NS && tag.toLowerCase() === 'svg') {
    const svg = origCreateElementNS(ns, tag) as SVGSVGElement;
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); return svg;
  }
  if (ns === SVG_NS && tag.toLowerCase() === 'path') {
    const pathLike: any = origCreateElementNS(ns, tag);
    const total = 300;
    pathLike.getTotalLength = () => total;
    pathLike.getPointAtLength = (s: number) => {
      const clamped = Math.max(0, Math.min(s, total));
      return { x: clamped, y: 100 };
    };
    pathLike.setAttribute = () => {};
    return pathLike as SVGPathElement;
  }
  return origCreateElementNS(ns, tag);
}) as any;
