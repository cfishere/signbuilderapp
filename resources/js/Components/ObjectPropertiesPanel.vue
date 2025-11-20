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
              :value="styleState.fill ?? '#000000'"
              @input="onStyleChange({ fill: ($event.target as HTMLInputElement).value })"
            />
            <input
              type="text"
              class="w-24 p-1 text-xs border rounded"
              :value="styleState.fill ?? ''"
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
      </div>

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
    </div>
  </section>
</template>


<script setup lang="ts">
import { computed } from 'vue'

type FontOpt = { family: string } | string

const props = defineProps<{
  hasSelection: boolean
  kind: 'none' | 'text' | 'text-on-path' | 'rect' | 'circle' | 'generic'
  styleState: {
    fill?: string | null
    stroke?: string | null
    strokeWidth?: number
    fontFamily?: string | null
    fontSize?: number | null
    fontWeight?: string | null
    fontStyle?: string | null
  }
  fonts: FontOpt[]
}>()

const emit = defineEmits<{
  (e: 'change-style', patch: Record<string, any>): void
}>()

const kindLabelMap: Record<string, string> = {
  none: 'None',
  text: 'Text',
  'text-on-path': 'Text on Path',
  rect: 'Rectangle',
  circle: 'Circle',
  generic: 'Object',
}

const kindLabel = computed(() => kindLabelMap[props.kind] ?? 'Object')

function onStyleChange(patch: Record<string, any>) {
  emit('change-style', patch)
}
</script>
