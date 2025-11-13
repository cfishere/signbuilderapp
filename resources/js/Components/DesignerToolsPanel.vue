<template>
    <div class="transition-all duration-300" :class="{ 'opacity-50 pointer-events-none': showDrawer }">
      <h2 class="mb-4 text-lg font-bold">Design Tools</h2>

      <!-- existing tools -->
      <button class="btn" @click="$emit('add-text')">Add Text</button>
      <button class="btn" @click="$emit('add-rectangle')">Add Rectangle</button>
      <button class="btn" @click="$emit('add-circle')">Add Circle</button>
      <button class="btn" @click="$emit('upload-image')">Upload Image</button>
      <button class="btn" @click="$emit('bring-to-front')">Bring to Front</button>
      <button class="btn" @click="$emit('send-to-back')">Send to Back</button>
      <button class="btn" @click="$emit('delete-selected')">Delete Selected</button>
      <button class="btn" @click="$emit('align-left')">Align Left</button>
      <button class="btn" @click="$emit('align-center')">Align Center</button>
      <button class="btn" @click="$emit('align-right')">Align Right</button>
      <button class="btn" @click="$emit('align-top')">Align Top</button>
      <button class="btn" @click="$emit('align-middle')">Align Middle</button>
      <button class="btn" @click="$emit('align-bottom')">Align Bottom</button>
      <button class="btn" @click="$emit('group')">Group</button>
      <button class="btn" @click="$emit('ungroup')">Ungroup</button>

      <!-- Appearance controls -->
      <section class="p-3 mt-4 border rounded-lg">
        <h3 class="mb-2 text-sm font-semibold">Properties</h3>

        <div class="grid grid-cols-1 gap-3 mb-3 md:grid-cols-3">
          <!-- Stroke width -->
          <div>
            <label class="block text-xs font-medium">Stroke Width</label>
            <div class="flex items-center gap-2 mt-1">
              <input
                class="w-24 p-1 border rounded"
                type="number" step="0.5" min="0"
                v-model.number="ui.strokeWidth"
                @change="$emit('stroke-width', clampStrokeWidth(ui.strokeWidth))"
              />
              <button class="px-2 py-1 text-xs border rounded" @click="setNoStroke" title="Set stroke width to 0">
                No Stroke
              </button>
            </div>
          </div>

          <!-- Stroke color -->
          <div>
            <label class="block text-xs font-medium">Stroke Color</label>
            <div class="flex items-center gap-2 mt-1">
              <input
                class="w-12 border rounded cursor-pointer h-9"
                type="color"
                v-model="ui.strokeColor"
                @input="$emit('stroke-color', ui.strokeColor)"
              />
              <input
                class="p-1 border rounded w-28"
                type="text"
                v-model="ui.strokeColor"
                @change="$emit('stroke-color', ui.strokeColor)"
                placeholder="#000000"
              />
            </div>
          </div>

          <!-- Fill color -->
          <div>
            <label class="block text-xs font-medium">Fill Color</label>
            <div class="flex items-center gap-2 mt-1">
              <input
                class="w-12 border rounded cursor-pointer h-9"
                type="color"
                v-model="ui.fillColor"
                @input="$emit('fill-color', ui.fillColor)"
              />
              <input
                class="p-1 border rounded w-28"
                type="text"
                v-model="ui.fillColor"
                @change="$emit('fill-color', ui.fillColor)"
                placeholder="#dddddd"
              />
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500" v-if="!hasSelection">
          Tip: select a shape or text object to apply stroke/fill.
        </p>
      </section>

      <!-- Font chooser -->
      <label class="block mt-4 mb-1 text-sm">Font</label>
      <select class="w-full p-2 border rounded" @change="onFontFamilyChange">
        <option value="" disabled selected>Select a font</option>
        <option
          v-for="f in props.fonts"
          :key="typeof f === 'string' ? f : f.family"
          :value="typeof f === 'string' ? f : f.family"
        >
          {{ typeof f === 'string' ? f : f.family }}
        </option>
      </select>

      <!-- Bold / Italic -->
      <div class="flex items-center gap-4 mt-2">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" @change="onBoldToggle($event)" />
          <span>Bold</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" @change="onItalicToggle($event)" />
          <span>Italic</span>
        </label>
      </div>

      <!-- Font size -->
      <div class="mt-2">
        <label class="block mb-1 text-sm">Font Size</label>
        <input type="number" min="6" max="300" step="1" class="p-2 border rounded w-28" @input="onFontSizeChange" />
      </div>

      <!-- ===================== Text on Path ===================== -->
      <section class="p-3 mt-6 border rounded-lg">
        <h3 class="mb-3 text-sm font-semibold">Text on Path</h3>

        <!-- Text -->
        <label class="block mb-1 text-xs font-medium">Text</label>
        <input
          class="w-full p-2 mb-3 border rounded"
          type="text"
          v-model="pathUI.text"
          placeholder="Your curved text"
        />

        <!-- Preset + custom d -->
        <div class="grid items-start grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label class="block mb-1 text-xs font-medium">Preset</label>
            <select class="w-full p-2 border rounded" v-model="pathUI.preset" @change="onPresetChange">
              <option v-for="p in PRESETS" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </div>

          <div v-if="pathUI.preset !== 'custom'">
            <label class="block mb-1 text-xs font-medium">Preview Path (read-only)</label>
            <input class="w-full p-2 border rounded bg-gray-50" :value="pathUI.pathD" readonly />
          </div>
        </div>

        <div v-if="pathUI.preset === 'custom'" class="mt-3">
          <label class="block mb-1 text-xs font-medium">Custom SVG Path <code>d</code></label>
          <textarea
            class="w-full p-2 border rounded min-h-[84px] font-mono text-xs"
            v-model="pathUI.pathD"
            placeholder="e.g. M 0 100 C 50 0, 100 200, 150 100 S 250 0, 300 100"
          />
        </div>

        <!-- Typography & layout -->
        
          <!-- pathUI-based Fill -->
  <div class="mb-2">
    <label class="block text-xs font-medium">Fill (curved text)</label>
    <input
      type="color"
      v-model="pathUI.fillColor"
      @input="$emit('path-text-change', buildPayload())"
    />
  </div>

  <!-- pathUI-based Stroke Color -->
  <div class="mb-2">
    <label class="block text-xs font-medium">Stroke Color (curved text)</label>
    <input
      type="color"
      v-model="pathUI.strokeColor"
      @input="$emit('path-text-change', buildPayload())"
    />
  </div>

  <!-- pathUI-based Stroke Width (optional) -->
  <div class="mb-2">
    <label class="block text-xs font-medium">Stroke Width</label>
    <input
      type="number"
      min="0"
      step="0.5"
      v-model.number="pathUI.strokeWidth"
      @input="$emit('path-text-change', buildPayload())"
    />
  </div>
        <div class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
          <div>
            <label class="block mb-1 text-xs font-medium">Font Size</label>
            <input class="w-full p-2 border rounded" type="number" min="8" max="300" step="1" v-model.number="pathUI.fontSize" />
          </div>

          <div>
            <label class="block mb-1 text-xs font-medium">Letter Spacing (px)</label>
            <input class="w-full p-2 border rounded" type="number" step="1" v-model.number="pathUI.letterSpacing" />
          </div>

          <div>
            <label class="block mb-1 text-xs font-medium">Start Offset (px)</label>
            <input class="w-full p-2 border rounded" type="number" step="1" v-model.number="pathUI.startOffset" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
          <div>
            <label class="block mb-1 text-xs font-medium">Align</label>
            <select class="w-full p-2 border rounded" v-model="pathUI.align">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <label class="flex items-center gap-2 mt-6 md:mt-0">
            <input type="checkbox" v-model="pathUI.flip" />
            <span class="text-sm">Flip baseline</span>
          </label>

          <label class="flex items-center gap-2 mt-6 md:mt-0">
            <input type="checkbox" v-model="pathUI.debug" />
            <span class="text-sm">Show path</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2 mt-4">
         <button
            type="button"
            data-testid="btn-add-path"
            class="px-3 py-1 text-sm text-white bg-gray-800 rounded hover:bg-gray-700"
            @click="emit('path-text-add', buildPayload())"
          >
            Add Text on Path
          </button>

          <!-- Apply to Selection -->
          <button
            type="button"
            data-testid="btn-apply-path"
            class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            :disabled="!hasSelection"
            @click="emit('path-text-apply', buildPayload())"
          >
            Apply to Selection
          </button>
        </div>

        <p class="mt-2 text-xs text-gray-500">
          Tip: Use “Apply to Selection” after selecting an existing Text-on-Path group.
        </p>
      </section>
      <!-- =================== /Text on Path =================== -->

      <!-- Snap / Grid -->
      <label class="block mt-4 mb-1 text-sm">Snap to Grid</label>
      <input
        type="checkbox"
        :checked="snapToGrid"
        @change="$emit('toggle-snap', !snapToGrid)"
        class="mb-2"
      />

      <label class="block mt-2 mb-1 text-sm">Show Grid</label>
      <input
        type="checkbox"
        :checked="gridVisible"
        @change="$emit('toggle-grid', !gridVisible)"
        class="mb-4"
      />

      <input type="file" ref="fileInput" class="hidden" @change="$emit('file-upload', $event)" accept="image/*" />
    </div>
  </template>

  <script setup lang="ts">
  import { reactive } from 'vue'

  type FontOpt = { family: string } | string

  const props = defineProps<{
    showDrawer: boolean
    snapToGrid: boolean
    gridVisible?: boolean
    hasSelection: boolean
    fonts: FontOpt[]
  }>()

  const emit = defineEmits([
    // existing
    'add-text','add-rectangle','add-circle','upload-image','bring-to-front','send-to-back',
    'delete-selected','align-left','align-center','align-right','align-top','align-middle',
    'align-bottom','group','ungroup','toggle-snap','file-upload',
    'stroke-width','stroke-color','stroke-clear','fill-color',
    'toggle-grid','font-family','text-style-change',
    // new text-on-path
    'path-text-add','path-text-apply','path-text-change'
  ])

  /** Appearance */
  const ui = reactive({
    strokeWidth: 0,
    strokeColor: '#000000',
    fillColor: '#dddddd'
  })

  function clampStrokeWidth(n: number) {
    if (Number.isNaN(n) || !Number.isFinite(n)) return 0
    return Math.max(0, n)
  }
  function setNoStroke() {
    ui.strokeWidth = 0
    emit('stroke-clear')
  }

  /** Path presets */
  const PRESETS = [
    { label: 'Arc Up',   value: 'arcUp',   d: 'M 0 150 Q 150 0 300 150' },
    { label: 'Arc Down', value: 'arcDown', d: 'M 0 0 Q 150 150 300 0' },
    { label: 'Wave',     value: 'wave',    d: 'M 0 100 C 50 0, 100 200, 150 100 S 250 0, 300 100' },
    { label: 'Custom…',  value: 'custom',  d: 'M 50 150 Q 150 50 250 150' }
  ] as const

  /** Text-on-Path local UI state */
  const pathUI = reactive({
  text: 'Your curved text',
  preset: PRESETS[0].value,
  pathD: PRESETS[0].d,
  fontFamily: 'Arial',
  fontSize: 48,
  letterSpacing: 2,
  startOffset: 0,
  align: 'center' as 'left' | 'center' | 'right',
  flip: false,
  fillColor: '#000000',
  strokeColor: '#000000',     // 👈 add this
  strokeWidth: 0,             // 👈 optional, if you want Apply to set width too
  debug: false
})

  function onPresetChange() {
    const p = PRESETS.find(x => x.value === pathUI.preset)
    if (p && pathUI.preset !== 'custom') {
      pathUI.pathD = p.d
      // optional: live notify parent to preview update on selected group
       emit('path-text-change', buildPayload())
    }
  }

  function buildPayload() {
  return {
    text: pathUI.text,
    pathD: pathUI.pathD,
    fontFamily: pathUI.fontFamily,
    fontSize: pathUI.fontSize,
    letterSpacing: pathUI.letterSpacing,
    startOffset: pathUI.startOffset,
    align: pathUI.align,
    flip: pathUI.flip,
    // 👇 rename to match the util’s API
    fill: pathUI.fillColor,
    stroke: pathUI.strokeColor,
    strokeWidth: pathUI.strokeWidth,
    debug: pathUI.debug
  }
}

  /** Typography controls (generic text) */
  function onFontFamilyChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value
    pathUI.fontFamily = val
    emit('text-style-change', { fontFamily: val })
  }
  function onBoldToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    emit('text-style-change', { fontWeight: checked ? '700' : '400' })
  }
  function onItalicToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    emit('text-style-change', { fontStyle: checked ? 'italic' : 'normal' })
  }
  function onFontSizeChange(e: Event) {
    const n = Number((e.target as HTMLInputElement).value)
    // also update local so new path text uses this size by default
    if (Number.isFinite(n)) pathUI.fontSize = n
    emit('text-style-change', { fontSize: n })
  }

  </script>

  <style scoped>
  .btn {
    @apply px-3 py-2 border rounded-lg text-sm whitespace-nowrap md:w-auto w-full inline-flex items-center justify-center;
  }
  </style>
