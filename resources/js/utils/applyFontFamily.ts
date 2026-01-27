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


function measureTextOverhang(text: any, font: string) {
  if (typeof document === 'undefined') return { left: 0, right: 0 }
  const safeText = text == null ? '' : String(text)
  const lines = safeText.split('\n')
  let maxLeft = 0
  let maxRight = 0
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  const textEl = document.createElementNS(svgNS, 'text')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.left = '-99999px'
  svg.style.top = '-99999px'
  textEl.setAttribute('x', '0')
  textEl.setAttribute('y', '0')
  textEl.style.font = font
  svg.appendChild(textEl)
  document.body.appendChild(svg)
  const canvasEl = document.createElement('canvas')
  const ctx = canvasEl.getContext('2d')
  if (ctx) ctx.font = font

  for (const line of lines) {
    textEl.textContent = line
    const bbox = textEl.getBBox()
    const width = ctx ? ctx.measureText(line).width : bbox.width
    const left = Math.max(0, -bbox.x)
    const right = Math.max(0, bbox.x + bbox.width - width)
    if (left > maxLeft) maxLeft = left
    if (right > maxRight) maxRight = right
  }

  document.body.removeChild(svg)
  return { left: maxLeft, right: maxRight }
}

function recomputeTextBounds(node: any) {
  if (!node || !node.type || !['text', 'i-text', 'textbox'].includes(node.type)) return
  if (node.text == null) node.text = ''
  try {
    node._clearCache?.()
    node._splitTextIntoLines?.()
    node.initDimensions?.()
    node.setCoords?.()
  } catch (err) {
    node.text = node.text ?? ''
    node.initDimensions?.()
    node.setCoords?.()
  }
}

function normalizeTextPadding(node: any) {
  if (!node || !node.type || !['text', 'i-text', 'textbox'].includes(node.type)) return
  const fontSize = Number(node.fontSize || 0)
  const fontStyle = node.fontStyle === 'italic' ? 'italic' : 'normal'
  const fontWeight = String(node.fontWeight || 'normal')
  const fontFamily = node.fontFamily || 'sans-serif'
  const scaleX = Number(node.scaleX ?? 1)
  const scaleY = Number(node.scaleY ?? 1)
  const scale = Math.max(1, (Math.abs(scaleX) + Math.abs(scaleY)) / 2)
  const lines = Array.isArray(node._textLines) ? node._textLines.map((l: any) => Array.isArray(l) ? l.join('') : String(l)) : null
  const text = (lines && lines.length) ? lines.join('\n') : String(node.text ?? '')
  const font = `${fontStyle === 'italic' ? 'italic ' : ''}${fontWeight} ${fontSize}px ${fontFamily}`
  const overhang = measureTextOverhang(text, font)
  let pad = Math.max(2, Math.round(fontSize * 0.12))
  pad += Math.round(Math.max(overhang.left, overhang.right))
  node.set('padding', Math.max(2, Math.round(pad / scale)))
  node.set('objectCaching', false)
  node.dirty = true
  recomputeTextBounds(node)
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
      normalizeTextPadding(node)
    })
    if (t.curved) needsReflow = true
  }

  if (needsReflow) {
    targets.forEach((t: any) => t.curved && reflowCurvedText(t))
  }
  canvas.requestRenderAll()
}
