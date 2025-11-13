import { describe, it, expect, vi } from 'vitest'
import { createTextOnPath, updateTextOnPath, rehydrateTextOnPath } from '@/utils/textOnPath'
import { fabric } from '@/utils/fabricRef'

describe('textOnPath utility', () => {
  it('creates a fabric.Group with path + glyphs and metadata', () => {
    const group = createTextOnPath({
      text: 'ABC',
      pathD: 'M 0 100 L 300 100',
      fontSize: 40,
      letterSpacing: 2,
      align: 'left'
    })

    expect(group).toBeInstanceOf(fabric.Group)
    expect(group.data?.kind).toBe('text-on-path')
    expect(group.data?.options?.text).toBe('ABC')

    // First child should be a Path (invisible by default), then glyphs as Text
    const children = (group as any)._objects
    expect(children.length).toBeGreaterThan(1)
    expect(children[0].type).toBe('path')
    for (let i = 1; i < children.length; i++) {
      expect(children[i].type).toBe('text')
    }
  })

  it('lays glyphs along the mocked horizontal path with near-zero angles', () => {
    const group = createTextOnPath({
      text: 'HELLO',
      pathD: 'M 0 100 L 300 100',
      fontSize: 24,
      letterSpacing: 1,
      align: 'left'
    })
    const glyphs = (group as any)._objects.slice(1)
    expect(glyphs.length).toBeGreaterThan(0)
    // Our path tangent is horizontal, so angles should be ~0 (allow small epsilon).
    const eps = 0.001
    glyphs.forEach((g: any) => {
      expect(Math.abs(g.angle)).toBeLessThanOrEqual(eps)
      // Y should be ~100 based on our mocked getPointAtLength
      expect(g.top).toBe(100)
    })
  })

  it('centers text when align=center by shifting starting offset', () => {
    const left = createTextOnPath({
      text: 'ABCD',
      pathD: 'M 0 100 L 300 100',
      fontSize: 24,
      letterSpacing: 0,
      align: 'left'
    })
    const center = createTextOnPath({
      text: 'ABCD',
      pathD: 'M 0 100 L 300 100',
      fontSize: 24,
      letterSpacing: 0,
      align: 'center'
    })
    const leftFirstGlyph = (left as any)._objects[1]
    const centerFirstGlyph = (center as any)._objects[1]
    // Center alignment should start further to the right than left alignment
    expect(centerFirstGlyph.left).toBeGreaterThan(leftFirstGlyph.left)
  })

  it('updateTextOnPath rebuilds group with new text and preserves transform', () => {
    const group = createTextOnPath({
      text: 'OLD',
      pathD: 'M 0 100 L 300 100',
      fontSize: 24
    })
    group.set({ left: 50, top: 60, angle: 15, scaleX: 1.2, scaleY: 0.8 })

    const rebuilt = updateTextOnPath(group as any, { text: 'NEWTEXT' })

    expect(rebuilt).not.toBe(group)
    expect(rebuilt.data?.options?.text).toBe('NEWTEXT')
    expect(rebuilt.left).toBe(50)
    expect(rebuilt.top).toBe(60)
    expect(rebuilt.angle).toBe(15)
    expect(rebuilt.scaleX).toBe(1.2)
    expect(rebuilt.scaleY).toBe(0.8)

    const glyphs = (rebuilt as any)._objects.slice(1)
    expect(glyphs.length).toBeGreaterThan(0)
  })

  it('rehydrateTextOnPath clears selectability on children', () => {
    const group = createTextOnPath({ text: 'OK', pathD: 'M 0 100 L 300 100' })
    // Make children selectable/evented to confirm rehydrate flips them
    ;(group as any)._objects.forEach((o: any) => o.set({ selectable: true, evented: true }))
    rehydrateTextOnPath(group as any)
    ;(group as any)._objects.forEach((o: any) => {
      expect(o.selectable).toBe(false)
      expect(o.evented).toBe(false)
    })
  })

  it('toObject includes data blob so JSON round-trips options', () => {
    const group = createTextOnPath({
      text: 'JSON',
      fontFamily: 'Arial',
      fontSize: 30,
      startOffset: 12,
      align: 'right',
      flip: true
    })
    const obj = group.toObject(['data'])
    expect(obj).toHaveProperty('data')
    expect((obj as any).data.options.text).toBe('JSON')
    expect((obj as any).data.options.align).toBe('right')
    expect((obj as any).data.options.flip).toBe(true)
  })
})
