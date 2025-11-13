import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DesignerToolsPanel from '@/Components/DesignerToolsPanel.vue'

function mountPanel(overrides: any = {}) {
  return mount(DesignerToolsPanel, {
    props: {
      showDrawer: false,
      snapToGrid: false,
      gridVisible: true,
      hasSelection: false,
      curvedUi: {},
      fonts: ['Arial', 'Times New Roman'],
      ...overrides
    }
  })
}

describe('DesignerToolsPanel emits', () => {
  it('emits path-text-add with payload when clicking Add Text on Path', async () => {
    const w = mountPanel()
    await w.get('input[placeholder="Your curved text"]').setValue('Hello Path')
    await w.get('[data-testid="btn-add-path"]').trigger('click')
    const evts = w.emitted('path-text-add')
    expect(evts).toBeTruthy()
    const payload = evts![0][0]
    expect(payload.text).toBe('Hello Path')
    expect(typeof payload.pathD).toBe('string')
    expect(payload.align).toBe('center')
  })

  it('disables Apply to Selection when hasSelection=false and enables when true', async () => {
    const w = mountPanel({ hasSelection: false })
    const applyBtn = w.findAll('button').find(b => b.text() === 'Apply to Selection')!
    expect(applyBtn.attributes('disabled')).toBeDefined()

    await w.setProps({ hasSelection: true })
    expect(applyBtn.attributes('disabled')).toBeUndefined()
  })

  it('emits text-style-change on font size change', async () => {
    const w = mountPanel()
    const input = w.find('input[type="number"][min="6"]') // the generic Font Size control
    await input.setValue('42')
    await input.trigger('input')
    const evts = w.emitted('text-style-change')
    expect(evts).toBeTruthy()
    const last = evts![evts!.length - 1][0]
    expect(last.fontSize).toBe(42)
  })
})
