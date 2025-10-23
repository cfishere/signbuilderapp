// utils/align.js
export function getCanvasBounds(canvas) {
  // If you align within the visible sign face rect, pass that instead.
  return { x: 0, y: 0, w: canvas.getWidth(), h: canvas.getHeight() };
}

function finalize(obj, canvas, keepSelected = true) {
  obj.setCoords();            // 1) recompute controls
  obj.dirty = true;           // 2) refresh cache (useful for text/images)
  if (keepSelected) canvas.setActiveObject(obj);
  canvas.requestRenderAll();  // 3) redraw
}

export function alignLeft(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const w = obj.getScaledWidth();
  obj.set({ left: bounds.x });
  finalize(obj, canvas);
}

export function alignRight(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const w = obj.getScaledWidth();
  obj.set({ left: bounds.x + bounds.w - w });
  finalize(obj, canvas);
}

export function alignCenterX(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const w = obj.getScaledWidth();
  obj.set({ left: bounds.x + (bounds.w - w) / 2 });
  finalize(obj, canvas);
}

export function alignTop(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const h = obj.getScaledHeight();
  obj.set({ top: bounds.y });
  finalize(obj, canvas);
}

export function alignBottom(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const h = obj.getScaledHeight();
  obj.set({ top: bounds.y + bounds.h - h });
  finalize(obj, canvas);
}

export function alignMiddleY(canvas, obj, bounds = getCanvasBounds(canvas)) {
  const h = obj.getScaledHeight();
  obj.set({ top: bounds.y + (bounds.h - h) / 2 });
  finalize(obj, canvas);
}
