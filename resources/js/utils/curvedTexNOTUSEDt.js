// ESM module for Fabric v6.x
// Save this file as UTF-8 (no BOM)
// This file is replaced by Fabric.Path using TextOnPath in Fabric v7+

import * as fabric from 'fabric';

const MIN_R = 1; // never let effective radius go to 0

function nnum(v, fb) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
}

/** Measure per-glyph widths with an offscreen 2D context (avoids textBaseline issues) */
function measureGlyphWidths(text, opts) {
  const { fontFamily, fontSize, fontWeight, italic } = opts || {};
  const off = document.createElement('canvas');
  const ctx = off.getContext('2d');
  const weight = fontWeight || 'normal';
  const style  = italic ? 'italic ' : '';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${style}${weight} ${fontSize || 48}px ${fontFamily || 'Arial'}`;
  const out = new Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = ctx.measureText(text[i]).width;
  return out;
}

/** Create a curved text group (letters as child objects). */
export function createCurvedText(text, curve = {}, style = {}) {
  text = typeof text === 'string' ? text : '';

  // curve props
  const radius     = curve.radius     != null ? curve.radius     : 150;
  const startAngle = curve.startAngle != null ? curve.startAngle : 180;
  const spacing    = curve.spacing    != null ? curve.spacing    : 0;
  const clockwise  = curve.clockwise  != null ? !!curve.clockwise : true;
  const inward     = curve.inward     != null ? !!curve.inward     : false;
  const align      = curve.align || 'center';

  // style props
  const left       = style.left       != null ? style.left       : 200;
  const top        = style.top        != null ? style.top        : 200;
  const fontFamily = style.fontFamily || 'Arial';
  const fontSize   = style.fontSize   != null ? style.fontSize   : 48;
  const fontWeight = style.fontWeight || 'normal';
  const italic     = !!style.italic;
  const fill       = style.fill || '#000000';
  const stroke     = style.stroke != null ? style.stroke : null;
  const strokeWidth= style.strokeWidth != null ? style.strokeWidth : 0;

  const widths = measureGlyphWidths(text, { fontFamily, fontSize, fontWeight, italic });

  // normalize radius: negative radius flips the arc side
  const rawRadius = nnum(radius, 150);
  const spacingPx = nnum(spacing, 0);
  const startA    = nnum(startAngle, 270);
  const r = Math.max(MIN_R, Math.abs(rawRadius));
  const startAngleNorm = startA + (rawRadius < 0 ? 180 : 0);

 // total span. compute total arc span (degrees)
  let totalWidth = 0;
  for (let i = 0; i < widths.length; i++) totalWidth += widths[i];
  totalWidth += Math.max(0, text.length - 1) * spacingPx;

  const totalTheta = totalWidth / r;
  const totalDeg   = Number.isFinite(totalTheta) ? (totalTheta * 180 / Math.PI) : 0;

  let startDeg = startAngleNorm;
  if (align === 'center') startDeg -= (clockwise ? 1 : -1) * (totalDeg / 2);
  if (align === 'end')    startDeg -= (clockwise ? 1 : -1) *  totalDeg;

  // build glyph objects
  const letters = [];
  let traveled = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w  = widths[i];

    const theta = (traveled + w / 2) / r;
    const degFromStart = (theta * 180 / Math.PI) * (clockwise ? 1 : -1);
    const angleDeg = startDeg + (Number.isFinite(degFromStart) ? degFromStart : 0);
    const rad = angleDeg * Math.PI / 180;

    const x = left + Math.cos(rad) * r;
    const y = top  + Math.sin(rad) * r;
    const rotate = angleDeg + (clockwise ? 90 : -90) + (inward ? 180 : 0);

    letters.push(new fabric.Text(ch, {
      objectCaching: false,
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      angle: rotate,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle: italic ? 'italic' : 'normal',
      fill,
      stroke: strokeWidth > 0 ? (stroke != null ? stroke : fill) : null,
      strokeWidth,
      paintFirst: 'fill',
      selectable: false,
      evented: false,
    }));

    traveled += w + spacingPx;
  }

  const group = new fabric.Group(letters, {
    left,
    top,
    objectCaching: false,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    hasBorders: true,
    hasControls: true,
    perPixelTargetFind: false,
    lockScalingFlip: false,
  });

  // make rotation control visible (Fabric v6)
if (group.controls && group.controls.mtr) {
  group.controls.mtr.visible = true;
}

  // persist props for later reflow / serialization
  group.curved = { text, radius, startAngle, spacing, clockwise, inward, align };
  group.textStyle = { fontFamily, fontSize, fontWeight, italic, fill, stroke, strokeWidth };
  group.customType = 'curvedText';

  // v6-safe refresh
  group.set('dirty', true);
  group.setCoords();

  // serialize custom props
  const toObject = group.toObject.bind(group);
  group.toObject = function(...args) {
    return {
      ...toObject(...args),
      curved: { ...this.curved },
      textStyle: { ...this.textStyle },
      customType: this.customType,
    };
  };

  // Make rotate cursor a curved arrow just for this group
if (group.controls?.mtr) {
  const rotateCursor = `url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'>\
<path fill='%23000' d='M12 2a10 10 0 1 0 9.54 6.54h-2.1A8 8 0 1 1 12 4v3l4-4-4-4v3z'/>\
</svg>") 12 12, auto`;
  group.controls.mtr.cursorStyleHandler = () => rotateCursor;
}

  return group;
}



/** Reflow an existing curvedText group IN PLACE (v6-safe). */
export function reflowCurvedText(group, updates = {}) {
  if (!group || !group.curved) return group;

  // merge new props
  const newCurved = { ...group.curved, ...(updates.curved || updates) };
  if (typeof updates.text === 'string') newCurved.text = updates.text;
  const newStyle  = { ...group.textStyle, ...(updates.textStyle || updates) };

  // anchor at current center
  const left = group.left;
  const top  = group.top;

  // read values
  let text = newCurved.text || group.curved.text || '';
  if (text.length === 0) text = ' '; // keep a visible placeholder so the group stays selectable
  const radius     = newCurved.radius     != null ? newCurved.radius     : 150;
  const startAngle = newCurved.startAngle != null ? newCurved.startAngle : 270;
  const spacing    = newCurved.spacing    != null ? newCurved.spacing    : 0;
  const clockwise  = newCurved.clockwise  != null ? !!newCurved.clockwise : true;
  const inward     = newCurved.inward     != null ? !!newCurved.inward     : false;
  const align      = newCurved.align || 'center';

  const fontFamily = newStyle.fontFamily || 'Arial';
  const fontSize   = newStyle.fontSize   != null ? newStyle.fontSize   : 48;
  const fontWeight = newStyle.fontWeight || 'normal';
  const italic     = !!newStyle.italic;
  const fill       = newStyle.fill || '#000000';
  const stroke     = newStyle.stroke != null ? newStyle.stroke : null;
  const strokeWidth= newStyle.strokeWidth != null ? newStyle.strokeWidth : 0;

  const widths = measureGlyphWidths(text, { fontFamily, fontSize, fontWeight, italic });

  // sanitize inputs
  const rawRadius = nnum(radius, 150);
  const spacingPx = nnum(spacing, 0);
  const startA    = nnum(startAngle, 270);

  // negative radius = flip side by +180°, use |radius| for geometry
  const r = Math.max(MIN_R, Math.abs(rawRadius));
  const startAngleNorm = startA + (rawRadius < 0 ? 180 : 0);

  // recompute arc layout
  let totalWidth = 0;
  for (let i = 0; i < widths.length; i++) totalWidth += widths[i];
  totalWidth += Math.max(0, text.length - 1) * spacingPx;

  const totalTheta = totalWidth / r;
  const totalDeg   = totalTheta * 180 / Math.PI;

  let startDeg = startAngleNorm;
  if (align === 'center') startDeg -= (clockwise ? 1 : -1) * (totalDeg / 2);
  if (align === 'end')    startDeg -= (clockwise ? 1 : -1) *  totalDeg;

  // build new glyphs
  const newLetters = [];
  let traveled = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w  = widths[i];
    const theta = (traveled + w / 2) / r;
    const degFromStart = (theta * 180 / Math.PI) * (clockwise ? 1 : -1);
    const angleDeg = startDeg + degFromStart;
    const rad = angleDeg * Math.PI / 180;

    // ... inside the glyph loop:
    const x = left + Math.cos(rad) * r;
    const y = top  + Math.sin(rad) * r;
    const rotate = angleDeg + (clockwise ? 90 : -90) + (inward ? 180 : 0);

    newLetters.push(new fabric.Text(ch, {
      objectCaching: false,
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      angle: rotate,
      fontFamily, fontSize, fontWeight,
      fontStyle: italic ? 'italic' : 'normal',
      fill,
      stroke: strokeWidth > 0 ? (stroke != null ? stroke : fill) : null,
      strokeWidth,
      paintFirst: 'fill',
      selectable: false,
      evented: false,
    }));

    traveled += w + spacingPx;
  }

  // replace children using public API (v6)
  const existing = group.getObjects();
  existing.slice().forEach(o => group.remove(o));
  group.add(...newLetters);

  // update stored props
  group.curved = { text, radius, startAngle, spacing, clockwise, inward, align };
  group.textStyle = { fontFamily, fontSize, fontWeight, italic, fill, stroke, strokeWidth };

  // mark dirty & refresh
  group.set({ left, top, objectCaching: false});
  group.set('dirty', true);
  group.setCoords();

  const canvas = group.canvas;
  if (canvas) {
    if (canvas.getActiveObject() !== group) canvas.setActiveObject(group);
    canvas.requestRenderAll();
  }
  return group;
}


/** Apply stroke consistently (width 0 => no stroke), then reflow. */
export function applyStrokeToCurved(group, strokeColor, strokeWidth) {
  if (!group || !group.curved) return group;
  const sw = Number(strokeWidth) || 0;
  group.textStyle.stroke = sw > 0 ? strokeColor : null;
  group.textStyle.strokeWidth = sw;
  return reflowCurvedText(group, { textStyle: group.textStyle });
}
