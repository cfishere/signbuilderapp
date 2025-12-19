<template>
  <section class="p-3 border rounded-lg bg-white/80">
    <h3 class="mb-2 text-sm font-semibold">Object Properties</h3>

    <p v-if="!hasSelection" class="text-xs text-gray-500">
      Select an object on the canvas to edit its properties.
    </p>

    <div v-else>
      <!-- Selected object kind -->
      <p class="mb-2 text-xs text-gray-500">
        Selected: <span class="font-semibold">{{ kindLabel }}</span>
      </p>

      <!-- COMMON APPEARANCE: Fill / Stroke -->
      <div class="grid grid-cols-1 gap-3 mb-3">
        <!-- Fill -->
        <div>
          <label class="block text-xs font-medium">Fill</label>
          <div class="flex items-center gap-2 mt-1">
            <input
              type="color"
              class="w-10 h-8 border rounded cursor-pointer"
              :value="fillColorInput"
              @input="onStyleChange({ fill: ($event.target as HTMLInputElement).value })"
            />
            <input
              type="text"
              class="w-24 p-1 text-xs border rounded"
              :value="fillTextInput"
              placeholder="#000000"
              @change="onStyleChange({ fill: ($event.target as HTMLInputElement).value })"
            />
          </div>
        </div>

        <!-- Stroke Color -->
        <div>
          <label class="block text-xs font-medium">Stroke</label>
          <div class="flex items-center gap-2 mt-1">
            <input
              type="color"
              class="w-10 h-8 border rounded cursor-pointer"
              :value="strokeColorInput"
              @input="onStyleChange({ stroke: ($event.target as HTMLInputElement).value })"
            />
            <input
              type="text"
              class="w-24 p-1 text-xs border rounded"
              :value="strokeTextInput"
              placeholder="#000000"
              @change="onStyleChange({ stroke: ($event.target as HTMLInputElement).value })"
            />
          </div>
        </div>

        <!-- Stroke Width -->
        <div>
          <label class="block text-xs font-medium">Stroke Width</label>
          <div class="flex items-center gap-2 mt-1">
            <input
              type="number"
              min="0"
              step="0.5"
              class="w-20 p-1 text-xs border rounded"
              :value="styleState.strokeWidth ?? 0"
              @change="onStyleChange({
                strokeWidth: Number(($event.target as HTMLInputElement).value) || 0
              })"
            />
            <button
              type="button"
              class="px-2 py-1 text-xs border rounded"
              @click="onStyleChange({ strokeWidth: 0, stroke: 'transparent' })"
            >
              No Stroke
            </button>
          </div>
        </div>

        <!-- Opacity -->
        <div>
          <label class="block text-xs font-medium">Opacity</label>
          <div class="flex items-center gap-2 mt-1">
            <input
              type="range"
              min="0"
              max="100"
              :value="opacityPercent"
              class="flex-1 accent-emerald-600"
              @input="onOpacityInput($event)"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="w-16 p-1 text-xs border rounded"
              :value="opacityPercent"
              @change="onOpacityInput($event)"
            />
            <span class="text-xs text-gray-500">%</span>
          </div>
        </div>
      </div>

<!-- GRADIENT FILL (text + shapes) -->
<section
  v-if="gradientSupported"
  class="mt-4 border-t pt-3"
>
  <h4 class="mb-2 text-xs font-semibold">Gradient Fill</h4>

  <label class="flex items-center gap-2 text-xs mb-2">
    <input
      type="checkbox"
      v-model="gradientEnabled"
      @change="applyGradientFill"
    />
    Enable Gradient Fill
  </label>

  <div v-if="gradientEnabled" class="grid grid-cols-1 gap-2 md:grid-cols-2">
    <!-- Start Color -->
    <div>
      <label class="block mb-1 text-xs font-medium">Start Color</label>
      <input
        type="color"
        class="w-10 h-8 border rounded cursor-pointer"
        v-model="gradientUI.startColor"
        @input="applyGradientFill"
      />
    </div>

    <!-- End Color -->
    <div>
      <label class="block mb-1 text-xs font-medium">End Color</label>
      <input
        type="color"
        class="w-10 h-8 border rounded cursor-pointer"
        v-model="gradientUI.endColor"
        @input="applyGradientFill"
      />
    </div>

    <!-- Direction -->
    <div class="md:col-span-2">
      <label class="block mb-1 text-xs font-medium">Direction</label>
      <select
        class="w-full p-1 text-xs border rounded"
        v-model="gradientUI.direction"
        @change="applyGradientFill"
      >
        <option value="horizontal">Left → Right</option>
        <option value="vertical">Top → Bottom</option>
        <option value="diagonal">Top-Left → Bottom-Right</option>
      </select>
    </div>
  </div>
</section>


<!-- LINE-SPECIFIC PROPERTIES -->
<div
  v-if="kind === 'line'"
  class="mt-4 border-t pt-3"
>
  <h4 class="mb-2 text-xs font-semibold">Line Properties</h4>

  <!-- Line Color (alias of stroke) -->
  <div class="flex items-center gap-2 mb-2">
    <label class="block text-xs font-medium">Line Color</label>
    <input
      type="color"
      class="w-10 h-8 border rounded cursor-pointer"
      :value="styleState.stroke ?? '#000000'"
      @input="onStyleChange({ stroke: ($event.target as HTMLInputElement).value })"
    />
    <input
      type="text"
      class="w-24 p-1 text-xs border rounded"
      :value="styleState.stroke ?? ''"
      placeholder="#000000"
      @change="onStyleChange({ stroke: ($event.target as HTMLInputElement).value })"
    />
  </div>

  <!-- Line Thickness (alias of strokeWidth) -->
  <div class="flex items-center gap-2">
    <label class="block text-xs font-medium">Line Thickness</label>
    <input
      type="number"
      min="0"
      step="0.5"
      class="w-20 p-1 text-xs border rounded"
      :value="styleState.strokeWidth ?? 1"
      @change="onStyleChange({
        strokeWidth: Number(($event.target as HTMLInputElement).value) || 1
      })"
    />
  </div>
</div>


      <!-- Shadow Section -->
<section class="mt-4 border-t pt-3">
  <h4 class="text-xs font-semibold mb-1">Drop Shadow</h4>

  <label class="flex items-center gap-2 text-xs mb-2">
    <input
      type="checkbox"
      v-model="shadowEnabled"
      @change="toggleShadow"
    />
    Enable Shadow
  </label>

  <div v-if="shadowEnabled" class="space-y-2">
    <label class="text-xs flex flex-col">
      Color
      <input
        type="color"
        v-model="shadow.color"
        @input="updateShadow"
      />
    </label>

    <label class="text-xs flex flex-col">
      Blur
      <input
        type="range"
        min="0"
        max="50"
        v-model.number="shadow.blur"
        @input="updateShadow"
      />
    </label>

    <label class="text-xs flex flex-col">
      Offset X
      <input
        type="number"
        v-model.number="shadow.offsetX"
        @input="updateShadow"
      />
    </label>

    <label class="text-xs flex flex-col">
      Offset Y
      <input
        type="number"
        v-model.number="shadow.offsetY"
        @input="updateShadow"
      />
    </label>
  </div>
</section>

      <!-- TEXT-SPECIFIC CONTROLS -->
      <div v-if="kind === 'text' || kind === 'text-on-path'" class="mt-3 border-t pt-3">
        <p class="mb-2 text-xs font-semibold text-gray-700">Text</p>

        <!-- Font family -->
        <label class="block mb-1 text-xs font-medium">Font Family</label>
        <select
          class="w-full p-1 text-xs border rounded"
          :value="styleState.fontFamily ?? ''"
          @change="onStyleChange({ fontFamily: ($event.target as HTMLSelectElement).value })"
        >
          <option value="">(unchanged)</option>
          <option
            v-for="f in fonts"
            :key="typeof f === 'string' ? f : f.family"
            :value="typeof f === 'string' ? f : f.family"
          >
            {{ typeof f === 'string' ? f : f.family }}
          </option>
        </select>

        <!-- Font size + weight/style -->
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <div>
            <label class="block mb-1 text-xs font-medium">Size</label>
            <input
              type="number"
              min="6"
              max="300"
              step="1"
              class="w-20 p-1 text-xs border rounded"
              :value="styleState.fontSize ?? 40"
              @change="onStyleChange({ fontSize: Number(($event.target as HTMLInputElement).value) || 40 })"
            />
          </div>

          <label class="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              :checked="styleState.fontWeight === 'bold' || styleState.fontWeight === '700'"
              @change="onStyleChange({ fontWeight: ($event.target as HTMLInputElement).checked ? '700' : '400' })"
            />
            Bold
          </label>

          <label class="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              :checked="styleState.fontStyle === 'italic'"
              @change="onStyleChange({ fontStyle: ($event.target as HTMLInputElement).checked ? 'italic' : 'normal' })"
            />
            Italic
          </label>
        </div>
      </div>

      <!-- PATH-TEXT EXTRA HINT -->
      <p
        v-if="kind === 'text-on-path'"
        class="mt-3 text-[11px] text-gray-500 italic"
      >
        Tip: use the Text-on-Path tools to adjust path shape, alignment, and flipping.
        Use this properties panel for color, stroke, and font styling.
      </p>
      <!-- TEXT-ON-PATH EXTRAS -->
<section
  v-if="kind === 'text-on-path'"
  class="p-3 mt-4 border rounded-lg bg-gray-50"
>
  <h3 class="mb-3 text-xs font-semibold text-gray-700">Text on Path</h3>

  <!-- Text -->
  <label class="block mb-1 text-xs font-medium">Text</label>
  <input
    class="w-full p-2 mb-3 border rounded"
    type="text"
    v-model="pathUI.text"
    placeholder="Sample Text"
    @input="emit('path-text-change', buildPathPayload())"
  />

  <!-- Preset + preview/custom -->
  <div class="grid items-start grid-cols-1 gap-3 md:grid-cols-2">
    <div>
      <label class="block mb-1 text-xs font-medium">Preset</label>
      <select
        class="w-full p-2 border rounded"
        v-model="pathUI.preset"
        @change="onPresetChange"
      >
        <option
          v-for="p in PRESETS"
          :key="p.value"
          :value="p.value"
        >
          {{ p.label }}
        </option>
      </select>
    </div>

    <div v-if="pathUI.preset !== 'custom'">
      <label class="block mb-1 text-xs font-medium">
        Preview Path (read-only)
      </label>
      <input
        class="w-full p-2 border rounded bg-gray-100 text-[11px] font-mono"
        :value="pathUI.pathD"
        readonly
      />
    </div>
  </div>

  <div v-if="pathUI.preset === 'custom'" class="mt-3">
    <label class="block mb-1 text-xs font-medium">
      Custom SVG Path <code>d</code>
    </label>
    <textarea
      class="w-full p-2 border rounded min-h-[84px] font-mono text-xs"
      v-model="pathUI.pathD"
      placeholder="e.g. M 0 100 C 50 0, 100 200, 150 100 S 250 0, 300 100"
      @input="emit('path-text-change', buildPathPayload())"
    />
  </div>

  <!-- Layout controls -->
  <div class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
    <div>
      <label class="block mb-1 text-xs font-medium">Letter Spacing (px)</label>
      <input
        class="w-full p-2 border rounded"
        type="number"
        step="1"
        v-model.number="pathUI.letterSpacing"
        @input="emit('path-text-change', buildPathPayload())"
      />
    </div>

    <div>
      <label class="block mb-1 text-xs font-medium">Start Offset (px)</label>
      <input
        class="w-full p-2 border rounded"
        type="number"
        step="1"
        v-model.number="pathUI.startOffset"
        @input="emit('path-text-change', buildPathPayload())"
      />
    </div>

    <div>
      <label class="block mb-1 text-xs font-medium">Align</label>
      <select
        class="w-full p-2 border rounded"
        v-model="pathUI.align"
        @change="emit('path-text-change', buildPathPayload())"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
    <label class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="pathUI.flip"
        @change="emit('path-text-change', buildPathPayload())"
      />
      <span class="text-xs">Flip baseline</span>
    </label>

    <label class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="pathUI.debug"
        @change="emit('path-text-change', buildPathPayload())"
      />
      <span class="text-xs">Show path</span>
    </label>
  </div>

  <!-- Apply to Selection -->
  <div class="flex flex-wrap gap-2 mt-4">
    <button
      type="button"
      class="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50"
      :disabled="!hasSelection"
      @click="emit('path-text-apply', buildPathPayload())"
    >
      Apply to Selection
    </button>
  </div>

  <p class="mt-2 text-[11px] text-gray-500">
    Tip: Adjust path, spacing, and offset here, then click “Apply to Selection”
    with a Text-on-Path group selected.
  </p>
</section>

    </div>
  </section>  
</template>


<script setup lang="ts">
import { reactive, ref, watch, computed, toRaw } from 'vue';
import { fabric } from '@/utils/fabricRef';

type FontOpt = { family: string } | string

const props = defineProps<{    
  kind: 'none' | 'text' | 'text-on-path' | 'rect' | 'circle' | 'generic' | 'line',
  hasSelection: boolean,
  styleState: {
    fill?: string | null
    stroke?: string | null
    strokeWidth?: number
    opacity?: number | null
    fontFamily?: string | null
    fontSize?: number | null
    fontWeight?: string | null
    fontStyle?: string | null
    shadow?: {
      color?: string
      blur?: number
      offsetX?: number
      offsetY?: number
    } | null
  },
  fonts: FontOpt[],
  pathMeta?: any | null  // meta about the current text-on-path selection
}>()

const isTextKind = computed(
  () => props.kind === 'text' || props.kind === 'text-on-path'
)

const kindLabelMap: Record<string, string> = {
  none: 'None',
  text: 'Text',
  'text-on-path': 'Text on Path',
  rect: 'Rectangle',
  circle: 'Circle',
  line: 'Line', 
  generic: 'Object',
}

const kindLabel = computed(() => kindLabelMap[props.kind] ?? 'Object')

const opacityPercent = computed(() => {
  const raw = typeof props.styleState.opacity === 'number' ? props.styleState.opacity : 1
  const clamped = Math.max(0, Math.min(1, raw))
  return Math.round(clamped * 100)
})

const isHexColor = (value: any): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

const normalizeColorInput = (value: any, fallback = '#000000') =>
  isHexColor(value) ? value : fallback

const textColorInput = (value: any) => (typeof value === 'string' ? value : '')

const fillColorInput = computed(() => normalizeColorInput(props.styleState.fill))
const strokeColorInput = computed(() => normalizeColorInput(props.styleState.stroke))
const fillTextInput = computed(() => textColorInput(props.styleState.fill))
const strokeTextInput = computed(() => textColorInput(props.styleState.stroke))

// --- Text-on-Path presets (move from DesignerToolsPanel.vue) ---
/** Path presets */
const PRESETS = [
  { label: 'Arc Up',   value: 'arcUp',   d: 'M 0 150 Q 150 0 300 150' },
  { label: 'Arc Down', value: 'arcDown', d: 'M 0 0 Q 150 150 300 0' },
  { label: 'Wave',     value: 'wave',    d: 'M 0 100 C 50 0, 100 200, 150 100 S 250 0, 300 100' },
  { label: 'Custom…',  value: 'custom',  d: 'M 50 150 Q 150 50 250 150' }
] as const

// Local UI for path text controls
const pathUI = reactive({
  text: 'Sample Text',
  preset: PRESETS[0].value,
  pathD: PRESETS[0].d,
  fontFamily: 'Arial',
  fontSize: 48,
  letterSpacing: 2,
  startOffset: 0,
  align: 'center' as 'left' | 'center' | 'right',
  flip: false,
  fillColor: '#000000',
  strokeColor: '#000000',
  strokeWidth: 0,
  debug: false,
})

// ------------------------------------------------------
// DROP SHADOW STATE (Panel Side)
// ------------------------------------------------------
const shadowEnabled = ref(false)

const shadow = reactive({
  color: '#000000',
  blur: 10,
  offsetX: 5,
  offsetY: 5
})

/**
 * Sync panel UI when the selected object's shadow changes
 */
watch(
  () => props.styleState.shadow,
  (sh) => {
    if (!props.hasSelection || !sh) {
      shadowEnabled.value = false
      return
    }
    shadowEnabled.value = true
    shadow.color = sh.color ?? '#000000'
    shadow.blur = sh.blur ?? 0
    shadow.offsetX = sh.offsetX ?? 0
    shadow.offsetY = sh.offsetY ?? 0
  },
  { immediate: true }
)

/**
 * Turn shadow ON or OFF
 */
function toggleShadow() {
  if (!shadowEnabled.value) {
    emit('change-style', { shadow: null })
  } else {
    emit('change-style', {
      shadow: {
        color: shadow.color,
        blur: shadow.blur,
        offsetX: shadow.offsetX,
        offsetY: shadow.offsetY
      }
    })
  }
}

/**
 * Update shadow live
 */
function updateShadow() {
  if (!shadowEnabled.value) return
  console.log('[OPP] updateShadow fired', { enabled: shadowEnabled.value, ...shadow });
  if (!shadowEnabled.value) return;

  emit('change-style', {
    shadow: {
      color: shadow.color,
      blur: shadow.blur,
      offsetX: shadow.offsetX,
      offsetY: shadow.offsetY
    }
  })
}

// ------------------------------------------------------
// GRADIENT FILL UI STATE (text + shapes)
// ------------------------------------------------------
const gradientEnabled = ref(false)

const gradientUI = reactive({
  startColor: '#ff0000',
  endColor: '#0000ff',
  direction: 'horizontal' as 'horizontal' | 'vertical' | 'diagonal'
})

// Which kinds support gradient?
const gradientSupported = computed(() =>
  props.hasSelection &&
  ['text', 'text-on-path', 'rect', 'circle', 'generic'].includes(props.kind)
)

// Emit gradientFill descriptor (CanvasEditor will build fabric.Gradient)
function applyGradientFill() {
  if (!gradientEnabled.value) {
    // User can revert to solid fill via normal Fill control.
    return
  }

  emit('change-style', {
    gradientFill: {
      type: 'linear',
      direction: gradientUI.direction,
      colorStops: [
        { offset: 0, color: gradientUI.startColor },
        { offset: 1, color: gradientUI.endColor }
      ]
    }
  })
}


const emit = defineEmits<{
  (e: 'change-style', patch: Record<string, any>): void
  (e: 'path-text-change', payload: any): void
  (e: 'path-text-apply', payload: any): void  
}>()

function onStyleChange(patch: Record<string, any>) {
  emit('change-style', patch)
}

function onOpacityInput(evt: Event) {
  const val = Number((evt.target as HTMLInputElement).value)
  const clamped = Math.max(0, Math.min(100, Number.isFinite(val) ? val : 100))
  onStyleChange({ opacity: clamped / 100 })
}

watch(
  () => props.pathMeta,
  (meta) => {
    if (!meta || props.kind !== 'text-on-path') return

    // merge meta into the UI state
    if (meta.text          != null) pathUI.text          = meta.text
    if (meta.presetKey     != null) pathUI.presetKey     = meta.presetKey
    if (meta.letterSpacing != null) pathUI.letterSpacing = meta.letterSpacing
    if (meta.startOffset   != null) pathUI.startOffset   = meta.startOffset
    if (meta.align         != null) pathUI.align         = meta.align
    if (meta.flip          != null) pathUI.flip          = meta.flip
    if (meta.showPath      != null) pathUI.showPath      = meta.showPath
  },
  { immediate: true }
)



// Build payload for text-on-path updates
function buildPathPayload() {
  return {
    ...toRaw(pathUI),
  }
  /*return {
    text: pathUI.text,
    pathD: pathUI.pathD,
    fontFamily: props.styleState.fontFamily ?? undefined,
    fontSize: props.styleState.fontSize ?? pathUI.fontSize,
    letterSpacing: pathUI.letterSpacing,
    startOffset: pathUI.startOffset,
    align: pathUI.align,
    flip: pathUI.flip,
    debug: pathUI.debug,
    // color + stroke come from the main appearance controls
    fill: props.styleState.fill ?? undefined,
    stroke: props.styleState.stroke ?? undefined,
    strokeWidth: props.styleState.strokeWidth ?? undefined,
  }*/
}

function onPresetChange() {
  const p = PRESETS.find(x => x.value === pathUI.preset)
  if (p && pathUI.preset !== 'custom') {
    pathUI.pathD = p.d
    emit('path-text-change', buildPathPayload())
  }
}


</script>
