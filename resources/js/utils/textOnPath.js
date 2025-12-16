// resources/js/utils/textOnPath.js
import { fabric } from '@/utils/fabricRef'

/**
 * Build an offscreen SVG <path> that we can use for length/point/tangent math.
 */
function makeSvgPath(pathD) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  // Keep it out of layout/paint
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.left = '-99999px';
  svg.style.top = '-99999px';
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  document.body.appendChild(svg);
  return { svg, path };
}

function destroySvg({ svg }) {
  if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
}

/**
 * Compute glyph advance widths using a canvas 2D context so we don’t need to
 * instantiate a Fabric.Text for every character just to measure.
 */
function measureGlyphWidths(text, { fontFamily, fontWeight = 'normal', fontStyle = 'normal', fontSize }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontStyle === 'italic' ? 'italic ' : ''}${fontWeight} ${fontSize}px ${fontFamily || 'sans-serif'}`;
  return Array.from(text, ch => ctx.measureText(ch).width);
}

/**
 * Compute XY + angle (deg) at a given arc-length along the path.
 */
function pointAndAngleAtLength(pathElem, s, flip = false) {
  const p1 = pathElem.getPointAtLength(s);
  // Small delta for tangent
  const delta = 0.01;
  const p2 = pathElem.getPointAtLength(Math.min(s + delta, pathElem.getTotalLength()));
  const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (flip) angleDeg += 180;
  return { x: p1.x, y: p1.y, angle: angleDeg };
}

export function createTextOnPath(opts) {
  const {
    text = 'Text on Path',
    pathD = 'M 50 150 Q 150 50 250 150',
    fontFamily = 'Arial',
    fontSize = 40,
    fontWeight = 'normal',
    fontStyle = 'normal',
    fill = '#999999',
    stroke = null,
    strokeWidth = 0,
    opacity = 1,
    letterSpacing = 0,
    startOffset = 0,
    align = 'left',
    flip = false,
    debug = false
  } = opts || {};

  const { svg, path } = makeSvgPath(pathD);
  const totalLen = path.getTotalLength();

  const widths = measureGlyphWidths(text, { fontFamily, fontWeight, fontStyle, fontSize });
  const glyphsWidth = widths.reduce((a, b) => a + b, 0) + Math.max(0, text.length - 1) * letterSpacing;

  let cursor = startOffset;
  if (align === 'center') cursor = startOffset + (totalLen - glyphsWidth) / 2;
  else if (align === 'right') cursor = startOffset + (totalLen - glyphsWidth);
  cursor = Math.max(0, Math.min(cursor, totalLen));

  const pathObj = new fabric.Path(pathD, {
    stroke: debug ? 'rgba(0,0,255,0.15)' : 'transparent',
    fill: 'transparent',
    selectable: false,
    evented: false,
    hoverCursor: 'default',
    objectCaching: true
  });

  const glyphs = [];
  for (let i = 0; i < text.length; i++) {
    const w = widths[i];
    if (!Number.isFinite(w) || w <= 0) {
      cursor += letterSpacing; // or just continue
      continue;
    }
    const mid = cursor + w / 2;
    if (!Number.isFinite(mid) || mid > totalLen) break;
    const p = pointAndAngleAtLength(path, mid, flip);
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.angle)) {
      break;
    }
    const { x, y, angle } = p;

    glyphs.push(new fabric.Text(text[i], {
      left: x, top: y, angle,
      originX: 'center', originY: 'center',
      fontFamily, fontSize, fontWeight, fontStyle, fill, opacity,
      stroke: stroke || undefined,
      strokeWidth: strokeWidth ?? 0,
      selectable: false, evented: false, objectCaching: true
    }));
    cursor += w + letterSpacing;
  }

  destroySvg({ svg });

  const group = new fabric.Group([pathObj, ...glyphs], {
    subTargetCheck: false,
    objectCaching: true
  });

  // ---- ensure metadata persists across mocks/serialization ----
  const meta = {
    kind: 'text-on-path',
    version: 1,
    options: {
      text, pathD, fontFamily, fontSize, fontWeight, fontStyle,
      fill, opacity, letterSpacing, startOffset, align, flip, stroke, strokeWidth, debug
    }
  };
  group.set('data', meta); // some environments honor this
  group.data = meta;       // mocks sometimes require direct assign

  // Make the panel-facing meta start with the same values
  // That gives us something for selectionState.pathMeta to mirror:
  group.sbPathMeta = meta.options;
  
  // Keep legacy sbPathMeta in sync so selectionState.pathMeta has data
  group.sbPathMeta = meta.options;

  const origToObject = group.toObject.bind(group);
  group.toObject = function (additionalProps = []) {
    const out = origToObject(['data', ...additionalProps]);
    if (!out.data && group.data) out.data = group.data; // belt & suspenders
    return out;
  };
  // ------------------------------------------------------------

  return group;
}

export function updateTextOnPath(group, patch = {}) {
  // allow either data.kind check OR “path first child” detection
  const looksLikePathGroup = Array.isArray(group?._objects) && group._objects[0]?.type === 'path';
  const isTop = group?.data?.kind === 'text-on-path' || looksLikePathGroup;
  if (!isTop) return group;

  const baseOpts = group?.data?.options || {};
  const options = { ...baseOpts, ...patch };

  const canvas = group.canvas;
  if (canvas) canvas.remove(group);

  const rebuilt = createTextOnPath(options);
  rebuilt.set({
    left: group.left, top: group.top, angle: group.angle,
    scaleX: group.scaleX, scaleY: group.scaleY, flipX: group.flipX, flipY: group.flipY
  });

  if (canvas) {
    canvas.add(rebuilt);
    canvas.setActiveObject(rebuilt);
    canvas.requestRenderAll();
  }
  return rebuilt;
}

export function rehydrateTextOnPath(group) {
  const isTop = group?.data?.kind === 'text-on-path' ||
                (Array.isArray(group?._objects) && group._objects[0]?.type === 'path');
  if (!isTop) return;
  group._objects.forEach((o) => o.set?.({ selectable: false, evented: false }));
  group.subTargetCheck = false;
}
