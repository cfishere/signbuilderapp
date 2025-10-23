// resources/js/utils/fontLoader.ts
import FontFaceObserver from 'fontfaceobserver'
import type { FontFamily } from './fonts'

const LOADED_FONTS = new Set<string>()
const INSERTED_LINKS = new Set<string>()
const LOAD_TIMEOUT_MS = 15000


function googleCssHref(
  family: string,
  weights: number[] = [400],
  style: 'normal' | 'italic' = 'normal'
) {
  const fam = family.replace(/\s+/g, '+')

  // If caller asked for a specific style, keep your current behavior:
  if (style === 'italic') {
    const values = weights.map(w => `1,${w}`).join(';')     // ital=1
    return `https://fonts.googleapis.com/css2?family=${fam}:ital,wght@${values}&display=swap`
  } else {
    // Request both normal (ital=0) and italic (ital=1) in one go:
    const normal = weights.map(w => `0,${w}`).join(';')
    const italic = weights.map(w => `1,${w}`).join(';')
    return `https://fonts.googleapis.com/css2?family=${fam}:ital,wght@${normal};${italic}&display=swap`
  }
}

function injectCssOnce(href: string) {
  if (INSERTED_LINKS.has(href)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
  INSERTED_LINKS.add(href)
}

export async function ensureFontLoaded(font: FontFamily, opts?: { weight?: number; style?: 'normal' | 'italic' }) {
  const weight = opts?.weight ?? (font.weights?.[0] ?? 400)
  const style  = opts?.style  ?? (font.style ?? 'normal')
  const key = `${font.family}:${style}:${weight}`
  if (LOADED_FONTS.has(key)) return

  injectCssOnce(googleCssHref(font.family, font.weights ?? [weight], style))

  try {
    const obs = new FontFaceObserver(font.family, { weight, style })
    await obs.load(null, LOAD_TIMEOUT_MS)
  } catch {
    // Fallback: give the browser a chance to settle
    if ((document as any).fonts?.load) {
      await (document as any).fonts.load(`${style} ${weight} 1em "${font.family}"`)
      await (document as any).fonts.ready
    }
  }

  LOADED_FONTS.add(key)
}


export async function preloadFonts(fonts: FontFamily[], limit = 5) {
  // Preload a small subset at startup to avoid big payloads
  const slice = fonts.slice(0, limit)
  await Promise.all(slice.map(f => ensureFontLoaded(f)))
}
