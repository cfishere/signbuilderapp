<template>
  <div class="transition-all duration-300" :class="{ 'opacity-50 pointer-events-none': showDrawer }">
    <h2 class="text-lg font-bold mb-4">Design Tools</h2>

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

        <!-- NEW: Appearance controls -->
    <section class="mt-4 rounded-lg border p-3">
      <h3 class="mb-2 text-sm font-semibold">Properties</h3>

      <!-- Stroke -->
      <div class="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label class="block text-xs font-medium">Stroke Width</label>
          <div class="mt-1 flex items-center gap-2">
            <input
              class="w-24 rounded border p-1"
              type="number" step="0.5" min="0"
              v-model.number="ui.strokeWidth"
              @change="$emit('stroke-width', clampStrokeWidth(ui.strokeWidth))"
            />
            <button
              class="rounded border px-2 py-1 text-xs"
              @click="setNoStroke"
              title="Set stroke width to 0"
            >
              No Stroke
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium">Stroke Color</label>
          <div class="mt-1 flex items-center gap-2">
            <input
              class="h-9 w-12 cursor-pointer rounded border"
              type="color"
              v-model="ui.strokeColor"
              @input="$emit('stroke-color', ui.strokeColor)"
            />
            <input
              class="w-28 rounded border p-1"
              type="text"
              v-model="ui.strokeColor"
              @change="$emit('stroke-color', ui.strokeColor)"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium">Fill Color</label>
          <div class="mt-1 flex items-center gap-2">
            <input
              class="h-9 w-12 cursor-pointer rounded border"
              type="color"
              v-model="ui.fillColor"
              @input="$emit('fill-color', ui.fillColor)"
            />
            <input
              class="w-28 rounded border p-1"
              type="text"
              v-model="ui.fillColor"
              @change="$emit('fill-color', ui.fillColor)"
              placeholder="#ffffff"
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
    <select class="w-full rounded border p-2"
            @change="onFontFamilyChange">
      <option value="" disabled selected>Select a font</option>
      <!-- Use props.fonts explicitly to avoid scope confusion -->
      <option
        v-for="f in props.fonts"
        :key="typeof f === 'string' ? f : f.family"
        :value="typeof f === 'string' ? f : f.family"
      >
        {{ typeof f === 'string' ? f : f.family }}
      </option>
    </select>

    <!-- Bold / Italic -->
<label><input type="checkbox" @change="onBoldToggle" /> Bold</label>
<label><input type="checkbox" @change="onItalicToggle" /> Italic</label>

<!-- Font size -->
<input type="number" min="6" max="300" step="1" @input="onFontSizeChange" />


<!-- ===== [CurvedText] Panel START ===== -->
<div class="flex gap-2">
  <button type="button"
          class="bg-gray-800 text-white rounded px-3 py-1 text-sm hover:bg-gray-700"
          @click="onCurveSelected">
    Curve selected text
  </button>

  <button type="button"
          class="border rounded px-3 py-1 text-sm hover:bg-gray-50"
          @click="onUncurveSelected">
    Uncurve selected
  </button>

  <!-- Radius (supports negatives) -->
<label class="grid gap-1 text-xs">
  <span>Radius</span>
  <div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
    <input
      type="number"
      class="border rounded px-2 py-1 text-sm w-full"
      v-model.number="localCurvedUI.radius"
      step="5"
      placeholder="150"
    />
    <button type="button" class="border rounded px-2 py-1 text-sm"
            @click="localCurvedUI.radius = (localCurvedUI.radius ?? 0) - 5">−5</button>
    <button type="button" class="border rounded px-2 py-1 text-sm"
            @click="localCurvedUI.radius = (localCurvedUI.radius ?? 0) + 5">+5</button>
  </div>
  <small class="opacity-70">Tip: negative radius flips the arc to the other side.</small>
</label>
</div>


<!-- ===== [CurvedText] Panel END ===== -->
    <label class="block mt-2 mb-1 text-sm">Snap to Grid</label>
    <input
      type="checkbox"
      :checked="snapToGrid"
      @change="$emit('toggle-snap', !snapToGrid)"
      class="mb-2"
    />

    <!-- NEW: Show Grid -->
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
  import { createCurvedText, reflowCurvedText, applyStrokeToCurved } from '@/utils/curvedText';
  import { reactive, watch } from 'vue'
  //ensure alignment tools reset Fabric's active object overlay (bounding boxes can get stranded to the prior location)
  import { alignLeft, alignRight, alignCenterX, alignTop, alignBottom, alignMiddleY } from '@/utils/align';

type FontOpt = { family: string } | string

const props = defineProps<{
  showDrawer: boolean
  snapToGrid: boolean
  gridVisible?: boolean
  hasSelection: boolean
  curvedUi: { type: Object, required: true },
  //  declare fonts prop
  fonts: FontOpt[]
}>()

const ui = reactive({
  strokeWidth: 0,
  strokeColor: '#000000',
  fillColor: '#ffffff'
})

function clampStrokeWidth(n) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0
  return Math.max(0, n)
}
function setNoStroke() {
  ui.strokeWidth = 0
  // parent clears stroke
  // separate emit so parent can set stroke=null + width=0
  emit('stroke-clear','stroke-color', 'fill-color')
}

const localCurvedUI = reactive({
  text: '',
  radius: 150,
  startAngle: 180,
  spacing: 0,
  clockwise: true,
  inward: false,
  align: 'center',
});

const emit = defineEmits([
  'add-text','add-rectangle','add-circle','upload-image','bring-to-front','send-to-back',
  'delete-selected','align-left','align-center','align-right','align-top','align-middle',
  'align-bottom','group','ungroup','toggle-snap','file-upload',
  'stroke-width','stroke-color','stroke-clear','fill-color',
  'toggle-grid','font-family','curved-ui-change', 'add-curved-text','curve-selected-text', 
  'uncurve-selected-text', 'text-style-change'
])



// Sync DOWN from parent → child (initialize & when selection changes in parent)
watch(
  () => props.curvedUi,
  (v) => { if (v) Object.assign(localCurvedUI, v) },
  { deep: true, immediate: true }
);

// Sync UP from child → parent whenever user tweaks inputs
watch(
  localCurvedUI,
  (v) => emit('curved-ui-change', { ...v }),
  { deep: true }
);

// When the user clicks the button in this panel
function onAddCurvedText() { emit('add-curved-text'); }
function onCurveSelected()  { emit('curve-selected-text'); }
function onUncurveSelected(){ emit('uncurve-selected-text'); }
// Handlers wired to your inputs:
function onColorChange(e)        { emit('text-style-change', { fill: e.target.value }); }
function onFontFamilyChange(e)   { emit('text-style-change', { fontFamily: e.target.value }); }
function onBoldToggle(isBold)    { emit('text-style-change', { fontWeight: isBold ? '700' : '400' }); }
/*function onItalicToggle(isItalic){ emit('text-style-change', { fontStyle: isItalic ? 'italic' : 'normal' }); }*/
function onItalicToggle(isItalic){ emit('text-style-change', { italic: true }) };
function onFontSizeChange(e)     { emit('text-style-change', { fontSize: Number(e.target.value) }); }

</script>

<style scoped>
.btn {
  @apply px-3 py-2 border rounded-lg text-sm whitespace-nowrap md:w-auto w-full inline-flex items-center justify-center;
}
</style>
