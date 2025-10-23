// utils/applyFontFamily.ts
import { reflowCurvedText } from '@/utils/curvedText'
import { FONT_CATALOG } from '@/utils/fonts'

function collectTextNodes(obj: any, out: fabric.Text[] = []) {
  const isText = obj?.type === 'text' || obj?.type === 'i-text' || obj?.type === 'textbox'
  if (isText) out.push(obj as fabric.Text)
  const children = obj?._objects || []
  children.forEach((c: any) => collectTextNodes(c, out))
  return out
}

function nearestWeight(available: number[]|undefined, want: number) {
  if (!available?.length) return want
  return available.reduce((best, w) =>
    Math.abs(w - want) < Math.abs(best - want) ? w : best, available[0])
}

export async function applyFontFamily(canvas: fabric.Canvas, family: string) {
  const active = canvas.getActiveObject() as any
  if (!active) return

  // Ensure browser has it (won’t fetch from Google—assumes CSS is present)
  try {
    if (!document.fonts.check(`1em "${family}"`)) {
      await document.fonts.load(`1em "${family}"`)
      await document.fonts.ready
    }
  } catch {}

  const targets = active.type === 'activeSelection' ? active._objects : [active]
  let needsReflow = false

  // If the current weight isn’t available in the new family, clamp to nearest
  const entry = FONT_CATALOG.find(f => f.family === family)
  for (const t of targets) {
    const textNodes = collectTextNodes(t)
    textNodes.forEach((node) => {
      const currentWeight = Number(node.fontWeight ?? 400) || 400
      const clamped = nearestWeight(entry?.weights, currentWeight)

      node.set({
        fontFamily: family,
        fontWeight: clamped,
      })
      node.dirty = true
      ;(node as any).initDimensions?.()
    })
    if (t.curved) needsReflow = true
  }

  if (needsReflow) {
    targets.forEach((t: any) => t.curved && reflowCurvedText(t))
  }
  canvas.requestRenderAll()
}
