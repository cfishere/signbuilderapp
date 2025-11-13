// resources/js/utils/templateUtils.ts (or .js)
export function normalizeTemplateForCanvas(input) {
  const t = input ?? {}

  // Base dimensions may be on root or face; default to 0 if missing
  const rootWidth  = isFiniteNumber(t.width)  ? t.width  : 0
  const rootHeight = isFiniteNumber(t.height) ? t.height : 0

  // Face (most sign types)
  const face = {
    width:  pickNumber(t?.face?.width,  rootWidth),
    height: pickNumber(t?.face?.height, rootHeight),
    shape:  t?.face?.shape ?? 'flat',
    // safe edge defaults
    borderWidthInches: pickNumber(t?.face?.borderWidthInches, 0),
    borderColor: t?.face?.borderColor ?? '#000000',
    fillColor:   t?.face?.fillColor   ?? '#ffffff',
  }

  // Cabinet (if present / relevant)
  const cabinet = t.cabinet
    ? {
        width:  pickNumber(t.cabinet.width,  face.width),
        height: pickNumber(t.cabinet.height, face.height),
        depth:  pickNumber(t.cabinet.depth,  8),
      }
    : undefined

  // Lighting (for illuminated types)
  const lighting = t.lighting
    ? {
        type:      t.lighting.type      ?? 'led',
        length:    pickNumber(t.lighting.length, 24),
        uom:       t.lighting.uom       ?? 'inches',
        structure: t.lighting.structure ?? 'tube',
        count:     pickNumber(t.lighting.count, 1),
      }
    : undefined

  // Post mount (monument / pylon)
  const post = t.post
    ? { mount: t.post.mount === 'side' ? 'side' : 'bottom' }
    : undefined

  // Return normalized structure; include raw sign type if provided
  return {
    signType: t.signType ?? t.type ?? 'custom',
    face,
    cabinet,
    lighting,
    post,
    // keep original in case callers need traceability
    _source: 'normalized',
  }
}

function pickNumber(v, fallback) {
  return isFiniteNumber(v) ? Number(v) : fallback
}
function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n)
}
