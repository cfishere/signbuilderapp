// utils/curvedText.js
import { fabric } from '@/utils/fabricRef';
/**
 * Build a curved text group (one fabric.Text per glyph).
 * Returns a fabric.Group with .curvedTextMeta and .customType='curvedText'.
 */
export function createCurvedTextGroup(text, opts = {}) {
  const {
    left = 0, top = 0, radius = 120,
    clockwise = true, inward = false,
    letterSpacing = 0, align = 'center',
    fill = '#000', fontFamily = 'Arial', fontSize = 24,
    fontWeight = 'normal', fontStyle = 'normal',
    underline = false, stroke = null, strokeWidth = 0, shadow = null,
    startAngle, // optional
  } = opts;

  const chars = Array.from(text || '');
  if (!chars.length) {
    const empty = new fabric.Group([], { left, top });
    empty.customType = 'curvedText';
    empty.curvedTextMeta = { text: '', left, top, radius, clockwise, inward, letterSpacing, align,
      style: { fill, fontFamily, fontSize, fontWeight, fontStyle, underline, stroke, strokeWidth, shadow },
      startAngle: startAngle ?? -90
    };
    return empty;
  }

  // measure per-glyph width using fabric.Text (handles fonts correctly)
  const measures = chars.map(ch => {
    const t = new fabric.Text(ch, { fontFamily, fontSize, fontWeight, fontStyle });
    return Math.max(t.width, fontSize * 0.3); // give space a minimal width
  });
  const extra = (chars.length - 1) * letterSpacing;
  const totalWidth = measures.reduce((a, b) => a + b, 0) + extra;
  const totalArcDeg = (totalWidth / radius) * (180 / Math.PI);

  const sign = clockwise ? 1 : -1;
  let _start = startAngle != null ? startAngle : (-90 - (clockwise ? -1 : 1) * (totalArcDeg / 2));
  let ang = _start;
  const nodes = [];

  for (let i = 0; i < chars.length; i++) {
    const w = measures[i];
    // advance half glyph + spacing before placing
    ang += sign * (((w / 2) + (i > 0 ? letterSpacing : 0)) / radius) * (180 / Math.PI);

    const theta = ang * (Math.PI / 180);
    const cx = left + radius * Math.cos(theta);
    const cy = top + radius * Math.sin(theta);

    const tangent = ang + (clockwise ? 90 : -90);
    const charAngle = inward ? (tangent + 180) : tangent;

    const node = new fabric.Text(chars[i], {
      left: cx, top: cy, originX: 'center', originY: 'center',
      angle: charAngle,
      fill, fontFamily, fontSize, fontWeight, fontStyle, underline, stroke, strokeWidth, shadow,
      selectable: true, evented: true
    });
    nodes.push(node);

    // advance the remaining half glyph
    ang += sign * ((w / 2) / radius) * (180 / Math.PI);
  }

  const group = new fabric.Group(nodes, {
    originX: 'center', originY: 'center', left, top, hasRotatingPoint: true
  });

  group.customType = 'curvedText';
  group.curvedTextMeta = {
    text, left, top, radius, clockwise, inward, letterSpacing, align,
    style: { fill, fontFamily, fontSize, fontWeight, fontStyle, underline, stroke, strokeWidth, shadow },
    startAngle: _start
  };

  // Ensure JSON includes our meta so we can rebuild on load
  const baseToObject = group.toObject.bind(group);
  group.toObject = (props) => ({
    ...baseToObject(props),
    customType: 'curvedText',
    curvedTextMeta: group.curvedTextMeta,
  });

  return group;
}

/**
 * Reflow an existing curvedText group after edits.
 * Keeps left/top/angle; replaces children with recalculated glyphs.
 */
export function updateCurvedTextGroup(group, patch = {}) {
  if (!group || group.customType !== 'curvedText') return group;
  const meta = { ...(group.curvedTextMeta || {}), ...patch };
  const { left, top, angle } = group;
  const canvas = group.canvas;

  // build a fresh group
  const g2 = createCurvedTextGroup(meta.text, {
    ...meta,
    // honor current left/top from transform
    left, top
  });
  g2.angle = angle;

  if (canvas) {
    canvas.remove(group);
    canvas.add(g2);
    canvas.setActiveObject(g2);
    canvas.requestRenderAll();
  }
  return g2;
}

/**
 * Reviver to rebuild curvedText from JSON.
 * Use in canvas.loadFromJSON(json, cb, reviver).
 */
export function curvedTextReviver(obj, callback) {
  if (obj.customType === 'curvedText' && obj.curvedTextMeta) {
    const g = createCurvedTextGroup(obj.curvedTextMeta.text, obj.curvedTextMeta);
    g.set({
      left: obj.left, top: obj.top, scaleX: obj.scaleX, scaleY: obj.scaleY, angle: obj.angle,
      flipX: obj.flipX, flipY: obj.flipY, opacity: obj.opacity
    });
    callback && callback(g);
  } else {
    callback && callback(null);
  }
}