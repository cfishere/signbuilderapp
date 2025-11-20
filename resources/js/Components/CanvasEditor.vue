<template>
  <div class="w-full min-h-screen bg-white">
    
    <header class="max-w-[1400px] mx-auto px-4">
      <div class="grid grid-cols-12 gap-4 pt-6">
        <!-- left spacer matches sidebar width -->
        <div class="col-span-12 lg:col-span-3"></div>
        <h1 class="col-span-12 lg:col-span-9 text-center text-2xl sm:text-3xl font-semibold">
          <!-- Keep your HxW header; pull values from your current props/state -->
          Sign Face ({{ formHeightIn }} x {{ formWidthIn }} inches)
        </h1>
      </div>
    </header>

    <!-- ROW 2: Sidebar + Canvas -->
    <main class="max-w-[1400px] mx-auto px-4">
      <div class="grid grid-cols-12 gap-6 py-6">
        <!-- SIDEBAR (Left) -->
        <aside class="col-span-12 lg:col-span-3 space-y-6">
          <!-- Product / Sign info card -->
          <section class="border rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-center">
              <!-- If you already compute a thumbnail, keep using it; otherwise swap this binding -->
              <img :src="thumbnailSrc" alt="Sign type thumbnail" class="h-20 object-contain" />
            </div>

               <!-- Settings panel -->
   <!--  <aside class="w-80 shrink-0 border-r p-4 space-y-4 bg-white"> -->
      <h2 class="text-lg font-semibold">Design Settings</h2>

      <!-- Sign Type -->
      <label class="block text-sm font-medium">
        Sign Type
        <select
          v-model="signType"
          class="mt-1 w-full rounded border p-2"
          aria-label="Sign type"
        >
          <option v-for="opt in signTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <!-- Dimensions -->
<div class="space-y-3">
    <div class="grid grid-cols-2 gap-2">
      <label class="text-sm">Width (in)</label>
      <input
        type="number"
        min="1"
        step="0.25"
        v-model.number="formWidthIn"
        :disabled="!editingDims"
        class="border rounded px-2 py-1 w-full disabled:bg-gray-100"
      />

      <label class="text-sm">Height (in)</label>
      <input
        type="number"
        min="1"
        step="0.25"
        v-model.number="formHeightIn"
        :disabled="!editingDims"
        class="border rounded px-2 py-1 w-full disabled:bg-gray-100"
      />
    </div>

    <button
      @click="onToggleDims()"
      class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
    >
      {{ editingDims ? 'Save Dimensions' : 'Change Dimensions' }}
    </button>

    <p v-if="dimError" class="text-red-600 text-sm">{{ dimError }}</p>
  </div>

  <p class="text-xs text-gray-600">
        Current face: <span class="font-medium">{{ sizeLabel }}</span>
      </p>

<!-- 

      <div class="grid grid-cols-2 gap-3">
        <label class="block text-sm font-medium">
          Width (in)
          <input
            type="number"
            inputmode="decimal"
            step="0.1"
            min="1"
            :value="widthIn"
            @input="onWidthInput"
            class="mt-1 w-full rounded border p-2"
            aria-label="Width in inches"
          />
        </label>

        <label class="block text-sm font-medium">
          Height (in)
          <input
            type="number"
            inputmode="decimal"
            step="0.1"
            min="1"
            :value="heightIn"
            @input="onHeightInput"
            class="mt-1 w-full rounded border p-2"
            aria-label="Height in inches"
          />
        </label>
      </div>

      <p class="text-xs text-gray-600">
        Current face: <span class="font-medium">{{ sizeLabel }}</span>
      </p> -->
          </section>

<ObjectPropertiesPanel
  :hasSelection="!!hasSelection"
  :kind="selectionKind"
  :styleState="styleState"
  :fonts="availableFonts"  
  @font-family="onChangeFontFamily" 
  @change-style="handlePropertiesStyleChange"
  @path-text-change="handlePathTextChange"
  @path-text-apply="handlePathTextApply"
/>

          <!-- Auth / Designs panel always visible -->
          <section class="border rounded-xl p-4 shadow-sm">
           
           
              <p class="text-sm text-gray-600 mb-3">
                Please log in or create an account to save and edit designs.
              </p>
              <div class="flex gap-3">
                <Link href="/login" method="post" as="button" class="flex-1 border rounded-lg px-3 py-2 text-center hover:bg-gray-50">Login</Link>
                <small>Don't have an account?</small>               
                <Link href="/register" method="post" as="button" class="flex-1 border rounded-lg px-3 py-2 text-center hover:bg-gray-50">Register</Link>
              </div>
           
          </section>
        </aside>

      <!-- CANVAS STAGE (Right) -->
<section class="col-span-12 lg:col-span-9 border rounded-xl shadow-sm p-3 relative">
  <!-- Canvas container -->
  <div ref="stage" class="relative bg-white border rounded-lg">
    <div class="absolute inset-0 pointer-events-none"></div>
    <canvas ref="canvasEl" id="canvasEl" class="w-full h-full block"></canvas>
  </div>

  <!-- TOOLBAR: directly beneath canvas, horizontal -->
  <div class="mt-3 rounded-xl border bg-white/90 backdrop-blur p-2
              sticky md:static bottom-3 z-10">
    <DesignerToolsPanel  
  :snapToGrid="snapToGrid"
  :hasSelection="hasSelection"  
  :gridVisible="gridVisible"
  @toggle-snap="(val) => snapToGrid = val"
  @toggle-grid="(val) => { gridVisible = val; refreshGrid() }"
  @add-text="addText"
  @add-curved-text="addTextOnPath"     
  @add-rectangle="addRectangle"
  @add-circle="addCircle"
  @upload-image="uploadImage"
  @bring-to-front="bringToFront"
  @send-to-back="sendToBack"
  @delete-selected="deleteSelected"
  @align-left="alignLeft"
  @align-center="alignCenter"
  @align-right="alignRight"
  @align-top="alignTop"
  @align-middle="alignMiddle"
  @align-bottom="alignBottom"
  @group="groupObjects"
  @ungroup="ungroupObjects"  
  @file-upload="handleFileUpload"    
  :fonts="availableFonts"  
/>

  </div>
</section>
</div>
    </main>

  




  </div>
</template>


<script setup lang="ts">
import { usePage, Link } from '@inertiajs/vue3';
import { ref, computed, onBeforeUnmount, watch, nextTick, onMounted, reactive, getCurrentInstance } from 'vue';
import { useDesignerRouteGuard } from '@/composables/useDesignerRouteGuard';
import { ensureFontLoaded, preloadFonts } from '@/utils/fontLoader'
import axios from 'axios';
/*import UserDesignPanel from '@/Components/UserDesignPanel.vue';*/
import DesignerToolsPanel from '@/Components/DesignerToolsPanel.vue';
import ObjectPropertiesPanel from '@/Components/ObjectPropertiesPanel.vue'
import { drawPost, drawCabinet, drawFace, drawLighting } from '@/utils/canvasDrawUtils';
import { createTextOnPath, updateTextOnPath, rehydrateTextOnPath } from '@/utils/textOnPath';
import { signTemplates } from '@/templates/signTemplates';
import { fabric } from '@/utils/fabricRef';
import { FONT_CATALOG, isAllowedForChannelLetters } from '@/utils/fonts'
import { createCurvedTextGroup, updateCurvedTextGroup, curvedTextReviver } from '@/utils/curvedText';
import { applyFontFamily } from '@/utils/applyFontFamily'


async function onFontFamilyChange(family: string) {
  const entry = FONT_CATALOG.find(f => f.family === family) ?? { family, weights: [400] }
  await ensureFontLoaded(entry)              // <-- add this line back
  activeTextObject.set('fontFamily', family) // your existing apply
  canvas.requestRenderAll()
}


document.fonts.check('1em "Story Script"')

//check fabric version:
console.log("Fabric version is: "+fabric.version)


const isChannelLetter = computed(() => signType.value === 'channel_letter')
// Fonts to show in the dropdown:
const availableFonts = computed(() => {
  if (isChannelLetter.value) {
    return FONT_CATALOG.filter(isAllowedForChannelLetters)
  }
  return FONT_CATALOG
})
/*let widthIn  = ref<number>(48)
const heightIn = ref<number>(24)*/
const signType = ref<string>(Object.keys(signTemplates)[0] ?? 'wall_cabinet')

/** pixels per logical inch (base density; zoom handles fitting) */
const ppi = ref(12)              // 1 inch = 12 px (design scale)
const zoom = ref(1)
const page = usePage()

//RESIZE CANVAS MODIFICATION
const props = defineProps({
  initialWidthIn: { type: Number, default: 48 },   // 48" wide default
  initialHeightIn: { type: Number, default: 24 },  // 24" high default
  ppi: { type: Number, default: 10 }        // 10 px per inch display scale
}) //end mod

// local state
const editingDims = ref(false)
const formWidthIn = ref(props.initialWidthIn)
const formHeightIn = ref(props.initialHeightIn)
const dimError = ref('')

/*const template = signTemplates[props.signType];*/
const canvasEl = ref(null)
const fileInput = ref(null)

const snapToGrid = ref(false)
const selectedObject = reactive({})
/*const showDrawer = ref(false)*/
let totalHeight = 0
const activeObj = ref(null);

/** canvas + layout */
let canvas
const viewport = reactive({ w: 1200, h: 620 }) // updated on mount/resize
const pad = 40 // screen-pixel padding around the face when fitting
const hasSelection = ref(false)
const selectionKind = ref<'none' | 'text' | 'text-on-path' | 'rect' | 'circle' | 'generic'>('none')

const styleState = reactive({
  fill: '#000000' as string | null,
  stroke: null as string | null,
  strokeWidth: 0,
  fontFamily: 'Arial' as string | null,
  fontSize: 40 as number | null,
  fontWeight: '400' as string | null,
  fontStyle: 'normal' as string | null,
})



let _bound = false;

let isPointerDown = false;
let pendingCurvedReflow = null;

/** optional: thumbnail from templates */
const thumbnailSrc = computed(() =>
  signTemplates[signType.value]?.thumbnail ?? 'img/sign-types/_placeholder.png'
)

/**
 * Restrict to numeric inches (supports decimals), min 1
 * - For step 1 we keep it simple; we’ll add per-type maxes later.
 */
function clampInches(n: number) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 1
  return Math.max(1, n)
}
function onWidthInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  formWidthIn.value = clampInches(val)
}
function onHeightInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  formHeightIn.value = clampInches(val)
}

const signTypeOptions = computed(() =>
  Object.keys(signTemplates).map(k => ({ value: k, label: signTemplates[k]?.label ?? k }))
)

// Simple inline “units” helper text
const sizeLabel = computed(() => `${formHeightIn.value}\" × ${formWidthIn.value}\"`)

const curved = ref({
  text: 'Your Curved Text',
  radius: 150,
  letterSpacing: 0,
  inward: false,
  clockwise: true,
  startAngle: null, // null = auto-center
  // style:
  fill: '#2563eb',          // blue-600 default
  fontFamily: 'Arial',
  fontSize: 32,
  fontWeight: 'normal',
  fontStyle: 'normal',
  underline: false,
  stroke: null,
  strokeWidth: 0,
});


const isCurvedActive = computed(() => activeObj.value && activeObj.value.customType === 'curvedText');

function bindCanvasSelectionEvents(fCanvas) {
  console.log("bindCanvasSelectionEvents called")
  const syncActive = () => {
    const obj = fCanvas.getActiveObject();
    activeObj.value = obj || null;
    if (obj && obj.customType === 'curvedText' && obj.curvedTextMeta) {
      const m = obj.curvedTextMeta;
      curved.value = {
        text: m.text,
        radius: m.radius,
        letterSpacing: m.letterSpacing,
        inward: m.inward,
        clockwise: m.clockwise,
        startAngle: m.startAngle ?? null,
        fill: m.style.fill,
        fontFamily: m.style.fontFamily,
        fontSize: m.style.fontSize,
        fontWeight: m.style.fontWeight,
        fontStyle: m.style.fontStyle,
        underline: m.style.underline,
        stroke: m.style.stroke,
        strokeWidth: m.style.strokeWidth,
      };
    }
  };
  fCanvas.on('selection:created', (e) => {
    hydrateStyleFromObject(e.selected?.[0] ?? null);
    syncActive;
    
  });
  fCanvas.on('selection:updated', (e) => {
    hydrateStyleFromObject(e.selected?.[0] ?? null);
    syncActive;
    
  });
  fCanvas.on('selection:cleared', () => { 
    activeObj.value = null; 
    hydrateStyleFromObject(null);
  });
}

function fitZoomToFace() {
  // STEP 1: We won’t implement full zoom logic yet.
  // If your canvas is already set up, you can call your existing fit function here.
  // TODO: integrate zoom/pan in Step 2.
}

// For now, just call fitZoom stub if a canvas exists.
/*watch([widthIn, heightIn, signType], () => {
  
  if (canvas) fitZoomToFace()
})*/

const canvasRef = ref(null);     // <canvas ref="canvasRef">
const wrapRef = ref(null);       // wrapper <div ref="wrapRef">

onMounted(async () => {
  await nextTick() // ensure DOM has real sizes

  // 1) Create Fabric with stable first-paint options
  canvas = new fabric.Canvas('canvasEl', {
    backgroundColor: 'white',
    selectionColor: 'blue',
    selectionLineWidth: 2,
    isDrawingMode: false,
    preserveObjectStacking: true,
    enableRetinaScaling: false,   // critical: avoid initial HiDPI mismatch
    renderOnAddRemove: false      // we'll requestRenderAll() explicitly
  })

  // 2) Give the canvas a *real* backing size based on its wrapper
  const wrap = document.getElementById('canvasWrap')
  if (wrap) {
    const { width: w, height: h } = wrap.getBoundingClientRect()
    const pxW = Math.max(1, Math.round(w))
    const pxH = Math.max(1, Math.round(h))
    canvas.setDimensions({ width: pxW, height: pxH }, { cssOnly: false })
  } else {
    // fallback to your previous defaults if wrapper not found
    canvas.setDimensions({ width: 800, height: 600 }, { cssOnly: false })
  }
  canvas.calcOffset()
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.setZoom(1)
  canvas.requestRenderAll()

  // 3) Apply your inches→pixels size (backing size again), then normalize
  //    ⚠️ Ensure setCanvasSizeFromInches internally uses canvas.setDimensions({cssOnly:false})
  setCanvasSizeFromInches(props.initialWidthIn, props.initialHeightIn)
  canvas.calcOffset()
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.setZoom(1)

  // 4) Draw grid and any initial art *after* size/transform are sane
  drawGrid(canvas)
  gridVisible.value = true
  refreshGrid()
  canvas.requestRenderAll()

  // --- your existing listeners (kept as-is) ---
  canvas.on('selection:created', updateSelectedObject)
  canvas.on('selection:updated', updateSelectedObject)
  canvas.on('selection:cleared', () => {
    Object.keys(selectedObject).forEach(key => delete selectedObject[key])
  })

  canvas.on('selection:created', () => (hasSelection.value = true))
  canvas.on('selection:updated', () => (hasSelection.value = true))
  canvas.on('selection:cleared', () => (hasSelection.value = false))

  canvas.on('object:moving', (e) => {
    if (!snapToGrid.value) return
    const obj = e.target
    obj.set({
      left: Math.round(obj.left / 24) * 24,
      top: Math.round(obj.top / 24) * 24,
    })
  })

  // 5) Observe wrapper size so layout changes never “blank” the canvas again
  observeCanvasWrapperResize()

  // 6) Preload fonts after first stable paint
  await preloadFonts([
    { family: 'Bebas Neue', weights: [400] },
    { family: 'Playfair Display', weights: [400, 700] },
    { family: 'Anton', weights: [400] },
    { family: 'Lora', weights: [400, 700] }
  ], 4)

  // Final paint to cover any async font/layout tweaks
  canvas.requestRenderAll()
  bindCanvasSelectionEvents(canvas);
})

function observeCanvasWrapperResize() {
  const wrap = document.getElementById('canvasWrap')
  if (!wrap) return

  const ro = new ResizeObserver(() => {
    const { width: w, height: h } = wrap.getBoundingClientRect()
    const newW = Math.max(1, Math.round(w))
    const newH = Math.max(1, Math.round(h))

    if (canvas.getWidth() !== newW || canvas.getHeight() !== newH) {
      canvas.setDimensions({ width: newW, height: newH }, { cssOnly: false })
      canvas.calcOffset()

      // keep transforms sane if something else messed with them
      const vt = canvas.viewportTransform
      if (!Array.isArray(vt) || vt[0] === 0) {
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        canvas.setZoom(1)
      }

      canvas.requestRenderAll()
    }
  })

  ro.observe(wrap)
}

// Toggle button handler
function onToggleDims () {
  if (!editingDims.value) {
    editingDims.value = true
    dimError.value = ''
    return
  }
  // currently in "Save Dimensions" mode
  saveDimensions()
}

function saveDimensions () {
  dimError.value = ''
  const wIn = Number(formWidthIn.value)
  const hIn = Number(formHeightIn.value)

  if (!Number.isFinite(wIn) || !Number.isFinite(hIn) || wIn <= 0 || hIn <= 0) {
    dimError.value = 'Please enter valid positive numbers for width and height.'
    return
  }

  resizeCanvasNoScale(wIn, hIn, 'top-left') // or 'center'
  editingDims.value = false
}
// Helpers
function inchesToPixels (inches) {
  return Math.round(inches * props.ppi)
}

function setCanvasSizeFromInches (widthIn, heightIn) {
  const wPx = inchesToPixels(formWidthIn)
  const hPx = inchesToPixels(formHeightIn)
  canvas.setDimensions({ widthIn, heightIn }, { cssOnly: false })
  canvas.calcOffset()
  // if you draw a grid/rulers, refresh them here:
  // instance.proxy?.refreshGrid?.()
  canvas.requestRenderAll()
}




// === Helpers ===
// Returns active objects, or [] if none
function getActiveObjects() {
  return (canvas?.getActiveObjects?.() ?? []).filter(Boolean);
}

// Apply a style patch to ONE object (plain or curved)
function applyStyleToObject(obj, patch) {
  // normalize keys a bit
  const mapped = {
    ...(patch.fill         != null ? { fill: String(patch.fill) } : {}),
    ...(patch.stroke       != null ? { stroke: String(patch.stroke) } : {}),
    ...(patch.strokeWidth  != null ? { strokeWidth: Number(patch.strokeWidth) } : {}),
    ...(patch.fontFamily   != null ? { fontFamily: String(patch.fontFamily) } : {}),
    ...(patch.fontWeight   != null ? { fontWeight: String(patch.fontWeight) } : {}),
    ...(patch.fontStyle    != null ? { fontStyle: patch.fontStyle } : {}),
    ...(patch.fontSize     != null ? { fontSize: Number(patch.fontSize) } : {}),
  };

  if (obj.curved) {
    // Curved group: update its style bag + reflow
    obj.textStyle = obj.textStyle || {};
    if ('fill'        in mapped) obj.textStyle.fill        = mapped.fill;
    if ('stroke'      in mapped) obj.textStyle.stroke      = mapped.stroke;
    if ('strokeWidth' in mapped) obj.textStyle.strokeWidth = mapped.strokeWidth;
    if ('fontFamily'  in mapped) obj.textStyle.fontFamily  = mapped.fontFamily;
    if ('fontWeight'  in mapped) obj.textStyle.fontWeight  = mapped.fontWeight;
    if ('fontStyle'   in mapped) obj.textStyle.italic      = (mapped.fontStyle === 'italic');
    if ('fontSize'    in mapped) obj.textStyle.fontSize    = mapped.fontSize;

    reflowCurvedText(obj, { textStyle: obj.textStyle });
  } else {
    // Plain Fabric text (Text/i-Text/Textbox)
    const patchNative = {};
    if ('fill'        in mapped) patchNative.fill        = mapped.fill;
    if ('stroke'      in mapped) patchNative.stroke      = mapped.stroke;
    if ('strokeWidth' in mapped) patchNative.strokeWidth = mapped.strokeWidth;
    if ('fontFamily'  in mapped) patchNative.fontFamily  = mapped.fontFamily;
    if ('fontWeight'  in mapped) patchNative.fontWeight  = mapped.fontWeight;
    if ('fontStyle'   in mapped) patchNative.fontStyle   = mapped.fontStyle;
    if ('fontSize'    in mapped) patchNative.fontSize    = mapped.fontSize;

    obj.set(patchNative);
    obj.setCoords?.();
  }
}

//when resizing canvas dim, preserve aspect ratio & size of all art, 
//including the grid
function resizeCanvasNoScale(newWidthIn: number, newHeightIn: number, 
  anchor: 'top-left'|'center'|'bottom-right' = 'top-left') {
  const oldW = canvas.getWidth()
  const oldH = canvas.getHeight()
  const newW = inchesToPixels(newWidthIn)
  const newH = inchesToPixels(newHeightIn)

  // Optional anchoring: shift objects when shrinking/expanding
  let dx = 0, dy = 0
  if (anchor === 'center') {
    dx = (newW - oldW) / 2
    dy = (newH - oldH) / 2
  } else if (anchor === 'bottom-right') {
    dx = (newW - oldW)
    dy = (newH - oldH)
  }

  if (dx !== 0 || dy !== 0) {
    canvas.getObjects().forEach(o => {
      o.left += dx
      o.top  += dy
      o.setCoords()
    })
  }

  canvas.setWidth(newW)
  canvas.setHeight(newH)
  canvas.calcOffset()

  // Rebuild grid fresh so cells remain square and fully tiled
  instance.proxy?.refreshGrid?.()

  canvas.requestRenderAll()
}






// Apply a style patch to ALL selected objects
function applyStyleToSelection(style: Record<string, any>) {
  const sel = canvas?.getActiveObject()
  if (!sel) return

  if (sel.type === 'activeSelection' && sel.forEachObject) {
    sel.forEachObject((o: any) => {
      if (isTextOnPathGroup(o)) {
        updateTextOnPath(o, style)
      } else {
        o.set(style)
        o.setCoords?.()
      }
    })
    canvas.requestRenderAll()
    return
  }

  if (isTextOnPathGroup(sel)) {
    updateTextOnPath(sel, style)
  } else {
    sel.set(style)
    sel.setCoords?.()
    canvas.requestRenderAll()
  }
}

function handlePropertiesStyleChange(patch: Record<string, any>) {
  // Apply to canvas selection
  applyStyleToSelection(patch)

  // Also update local UI state so the panel stays in sync
  Object.assign(styleState, patch)
}

function getSelectionTextObjects(): fabric.Object[] {
  if (!canvas) return []
  const objs = canvas.getActiveObjects?.() || []
  const target = objs.length ? objs : (canvas.getActiveObject() ? [canvas.getActiveObject() as fabric.Object] : [])
  return target.filter(o => o.type === 'i-text' || o.type === 'textbox' || o.type === 'text')
}

async function onChangeFontFamily(family: string) {
  const fontMeta = FONT_CATALOG.find(f => f.family === family)
  if (!fontMeta) return

  // 1) Ensure the family is loaded
  try {
    await ensureFontLoaded(fontMeta)
  } catch (e) {
    console.warn('Font failed to load:', family, e)
    return;
  }
  applyStyleToSelection({ fontFamily: family });  // <-- uses your helper that reflows curved groups
  // 2) Apply to selected text
  const targets = getSelectionTextObjects()
  if (!targets.length) return

  targets.forEach(obj => {
    // @ts-ignore Fabric text props
    obj.set({ fontFamily: family })
    obj.setCoords()   
  })  
  
  canvas.requestRenderAll()
}

function updateSelectedObject(e) {
  const obj = e.selected[0];
  Object.keys(selectedObject).forEach(key => delete selectedObject[key]);
  Object.assign(selectedObject, obj);
}
function getSelectionTargets(): fabric.Object[] {
  if (!canvas) return []
  const many = canvas.getActiveObjects?.() || []
  if (many.length) return many as fabric.Object[]
  const a = canvas.getActiveObject()
  if (!a) return []
  // unwrap activeSelection into its children if present
  // @ts-ignore
  if (a.type === 'activeSelection' && a.getObjects) return a.getObjects()
  return [a]
}

function onChangeStrokeWidth(width) {
  const targets = getSelectionTargets()
  for (const obj of targets) {
    if (width <= 0) {
      obj.set({ stroke: null, strokeWidth: 0 })
    } else {
      const currentStroke = obj.stroke ?? '#000000'
      obj.set({
        stroke: currentStroke,
        strokeWidth: width,
        strokeUniform: true
      })
    }
    obj.setCoords()
  }
  canvas?.requestRenderAll()
}

function onChangeStrokeColor(color) {
  const targets = getSelectionTargets()
  for (const obj of targets) {
    // ensure visible if previously 0
   const w = Number(obj.strokeWidth ?? 0)
    obj.set({
      stroke: w > 0 ? color : null,
      strokeWidth: w,
      strokeUniform: true
    })
    obj.setCoords()
  }
  applyStyleToSelection({ stroke: color });
  canvas?.requestRenderAll()
}

function onClearStroke() {
  const targets = getSelectionTargets()
  for (const obj of targets) {
    obj.set({ stroke: null, strokeWidth: 0 })
    obj.setCoords()
  }
  canvas?.requestRenderAll()
}

function onChangeFillColor(color) {
  const targets = getSelectionTargets()
  for (const obj of targets) {
    obj.set({ fill: color })
    obj.setCoords()
  }
   applyStyleToSelection({ fill: color });
  canvas?.requestRenderAll()
}

function updateCanvas() {
  canvas.requestRenderAll();
}

function drawGrid(canvas) {
  const gridSpacing = 24;
  const width = canvas.formWidthIn;
  const height = canvas.formHeightIn;

  for (let i = 0; i <= width; i += gridSpacing) {
    canvas.add(new fabric.Line([i, 0, i, height], {
      stroke: '#99ccff',
      selectable: false,
      evented: false,
    }));
  }

  for (let i = 0; i <= height; i += gridSpacing) {
    canvas.add(new fabric.Line([0, i, width, i], {
      stroke: '#99ccff',
      selectable: false,
      evented: false,
    }));
  }
}

const gridVisible = ref(true)    // default ON

let gridGroup: fabric.Group | null = null

function removeGrid() {
  if (canvas && gridGroup) {
    canvas.remove(gridGroup)
    gridGroup = null
  }
}

function refreshGrid() {
  if (!canvas) return
  removeGrid()
  if (!gridVisible.value) { canvas.requestRenderAll(); return }

  const w = canvas.getWidth()
  const h = canvas.getHeight()
  const step = ppi.value // 12 px per inch cell
  const z = canvas.getZoom() || 1
const lines: fabric.Object[] = []

for (let x = 0; x <= w; x += step) {
  lines.push(new fabric.Line([x, 0, x, h], {
    stroke: '#ccffff',
    strokeWidth: 1 / z,
    selectable: false, evented: false, excludeFromExport: true
  }))
}
for (let y = 0; y <= h; y += step) {
  lines.push(new fabric.Line([0, y, w, y], {
    stroke: '#ccffff',
    strokeWidth: 1 / z,
    selectable: false, evented: false, excludeFromExport: true
  }))
}

gridGroup = new fabric.Group(lines, {
  left: 0, top: 0,
  selectable: false,
  evented: false,
  excludeFromExport: true,
  name: 'grid'
})
canvas.add(gridGroup)

// Use the safe helper:
sendObjectToBackSafe(canvas, gridGroup)
  canvas.requestRenderAll()
}

/** Call this any time zoom changes to keep grid lines thin */
function updateGridStrokeWidthForZoom() {
  if (!canvas || !gridGroup) return
  const z = canvas.getZoom() || 1
  // @ts-ignore private access ok for our usage
  gridGroup._objects?.forEach((o: fabric.Line) => o.set({ strokeWidth: 1 / z }))
  canvas.requestRenderAll()
}

/** Wherever you resize the canvas, refit, or change zoom, call these: */
// after you set canvas size:
function afterResizeOrLayoutChange() { refreshGrid() }
// after you change zoom:
function afterZoomChange() { updateGridStrokeWidthForZoom() }


function moveToBackSafe(obj: any, minIndex = 0) {
  if (!canvas || !obj) return
  if (typeof obj.sendToBack === 'function') { obj.sendToBack(); return canvas.requestRenderAll() }
  if (typeof obj.moveTo === 'function')     { obj.moveTo(minIndex); return canvas.requestRenderAll() }
  // fallback: mutate stack
  const arr = (canvas as any)._objects; if (!Array.isArray(arr)) return
  const i = arr.indexOf(obj); if (i < 0) return
  arr.splice(i, 1); arr.splice(minIndex, 0, obj); canvas.requestRenderAll()
}

function bottomIndexAboveGrid(): number {
  if (!canvas) return 0
  const arr = (canvas as any)._objects
  const i = gridGroup ? arr.indexOf(gridGroup) : -1
  return i >= 0 ? i + 1 : 0
}

function moveToFrontSafe(obj: any, maxIndex?: number) {
  if (!canvas || !obj) return
  if (typeof obj.bringToFront === 'function') { obj.bringToFront(); return canvas.requestRenderAll() }
  if (typeof obj.moveTo === 'function') {
    const top = maxIndex ?? ((canvas as any)._objects?.length ?? 1) - 1
    obj.moveTo(top); return canvas.requestRenderAll()
  }
  const arr = (canvas as any)._objects; if (!Array.isArray(arr)) return
  const i = arr.indexOf(obj); if (i < 0) return
  arr.splice(i, 1); arr.push(obj); canvas.requestRenderAll()
}

// Example: if you have a resize handler:
window.addEventListener?.('resize', () => {
  // your existing resize logic…
  afterResizeOrLayoutChange()
})

function sendObjectToBackSafe(c: fabric.Canvas | null | undefined, obj: any) {
  if (!c || !obj) return
  try {
    // 1) Preferred: object API
    if (typeof obj.sendToBack === 'function') {
      obj.sendToBack()
      return
    }
    // 2) Canvas API variant
    if (typeof (c as any).sendToBack === 'function') {
      ;(c as any).sendToBack(obj)
      return
    }
    // 3) Generic object move
    if (typeof obj.moveTo === 'function') {
      obj.moveTo(0)
      return
    }
    // 4) Fallback: manipulate internal stack
    const arr = (c as any)._objects
    if (Array.isArray(arr)) {
      const i = arr.indexOf(obj)
      if (i >= 0) {
        arr.splice(i, 1)
        arr.unshift(obj)
      }
    }
  } finally {
    c?.requestRenderAll()
  }
}

function deformText( selectedTextObject ){
  var curvedText = new fabric.CurvedText('Your Curved Text', {
      left: 100,
      top: 100,
      radius: 50, // Radius of the curve
      fill: 'blue',
      fontSize: 24,
      fontFamily: 'Arial',
      textAlign: 'center'
  });

  canvas.add(curvedText);
  canvas.requestRenderAll();

}

function addText() {
  const text = new fabric.IText('Sample Text', {
    left: 100,
    top: 100,
    fill: 'black',
    fontSize: 20,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}

function addRectangle() {
  const rect = new fabric.Rect({
    left: 150,
    top: 150,
    fill: '#00aaff',
    width: 100,
    height: 60,
    stroke: '#000000',
    strokeWidth: 1,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
}

function addCircle() {
  const circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 40,
    fill: '#ffaa00',
    stroke: '#000000',
    strokeWidth: 1,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
}


// === [CurvedText] reactive UI state ===
const curvedUI = reactive({
  text: 'Your Curved Text',
  radius: 150,
  startAngle: 270,
  spacing: 0,
  clockwise: true,
  inward: false,
  align: 'center', // 'start' | 'center' | 'end'
});



function curveSelectedText() {
  const obj = canvas?.getActiveObject?.();
  if (!obj) return;

  const isPlainText = ['text', 'i-text', 'textbox'].includes(obj.type);
  if (!isPlainText) return;

  // Effective font size = fontSize * vertical scale (usually uniform)
  const scaleY = obj.scaleY != null ? obj.scaleY : 1;
  const scaleX = obj.scaleX != null ? obj.scaleX : 1;
  const effFontSize = (obj.fontSize || 48) * (scaleY || 1);

  // Keep style
  const style = {
    fontFamily: obj.fontFamily || 'Arial',
    fontSize: effFontSize,                      // << preserve visual size
    fontWeight: obj.fontWeight || 'normal',
    italic: obj.fontStyle === 'italic',
    fill: obj.fill || '#111',
    stroke: obj.stroke || null,
    strokeWidth: obj.strokeWidth || 0,
  };

  // Center/angle
  const center = obj.getCenterPoint ? obj.getCenterPoint() : { x: obj.left, y: obj.top };
  const angle  = obj.angle || 0;

  // Seed text for panel
  curvedUI.text = obj.text || curvedUI.text;

  // Create curved group at same spot/angle; reset group scale to 1 (baked into fontSize)
  const group = createCurvedText(curvedUI.text, curvedUI, { left: center.x, top: center.y, ...style });
  group.set({ angle, scaleX: 1, scaleY: 1 });

  canvas.remove(obj);
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
}



function uncurveSelectedText() {
  const obj = canvas?.getActiveObject?.();
  if (!obj?.curved) return;

  const center = obj.getCenterPoint ? obj.getCenterPoint() : { x: obj.left, y: obj.top };
  const angle  = obj.angle || 0;
  const s = obj.textStyle || {};
  const scaleY = obj.scaleY != null ? obj.scaleY : 1;

  // Effective font size = stored fontSize * current group scale
  const effFontSize = (s.fontSize || 48) * (scaleY || 1);

  const flat = new fabric.Textbox(obj.curved.text || '', {
    left: center.x,
    top: center.y,
    originX: 'center',
    originY: 'center',
    angle,
    scaleX: 1,                      // reset; size baked into fontSize
    scaleY: 1,
    fontFamily: s.fontFamily || 'Arial',
    fontSize: effFontSize,          // << preserve visual size
    fontWeight: s.fontWeight || 'normal',
    fontStyle: s.italic ? 'italic' : 'normal',
    fill: s.fill || '#111',
    stroke: s.stroke || null,
    strokeWidth: s.strokeWidth || 0,
  });

  canvas.remove(obj);
  canvas.add(flat);
  canvas.setActiveObject(flat);
  canvas.requestRenderAll();
}


// === [CurvedText] reflow the active curved text group ===
function reflowActiveCurved(partial) {
  if (!canvas) return;
  const obj = canvas.getActiveObject?.();
  if (obj && obj.curved) {
    reflowCurvedText(obj, partial);
    canvas.requestRenderAll();
  }
}

// === [CurvedText] keep the panel in sync when user selects a curved group ===
function syncCurvedUIFrom(obj) {
  if (!obj?.curved) return;
  const { text, radius, startAngle, spacing, clockwise, inward, align } = obj.curved;
  curvedUI.text = text;
  curvedUI.radius = radius;
  curvedUI.startAngle = startAngle;
  curvedUI.spacing = spacing;
  curvedUI.clockwise = !!clockwise;
  curvedUI.inward = !!inward;
  curvedUI.align = align || 'center';
}

// === [CurvedText] watch the UI and live-update the selected curved group ===
watch(curvedUI, (v) => {
  if (!canvas) return;
  const obj = canvas.getActiveObject?.();
  if (obj && obj.curved) {
    reflowCurvedText(obj, v);
    canvas.requestRenderAll();
  }
}, { deep: true });

// === [CurvedText] unify stroke behavior for *any* selection (incl. curved) ===
function applyStrokeToActive(strokeColor, strokeWidth) {
  if (!canvas) return;
  const obj = canvas.getActiveObject?.();
  if (!obj) return;

  if (obj.curved) {
    // Our custom group
    applyStrokeToCurved(obj, strokeColor, Number(strokeWidth));
  } else {
    // Native Fabric objects
    const color = Number(strokeWidth) > 0 ? strokeColor : null;
    obj.set({
      stroke: color,
      strokeWidth: Number(strokeWidth) || 0,
    });
  }
  canvas.requestRenderAll();
}

// === [CurvedText] hook selection events so the panel reflects the current object ===
function handleSelection(e) {
  const obj = e?.selected?.[0] ?? e?.target ?? canvas?.getActiveObject?.();
  if (obj?.curved) syncCurvedUIFrom(obj);
}

onBeforeUnmount(() => {
  if (canvas?.off && _bound) {
    canvas.off('selection:created', handleSelection);
    canvas.off('selection:updated', handleSelection);
    canvas.off('selection:cleared');
    _bound = false;
  }
});

/** @param {StyleUpdate} u
 *  @returns {NormalizedStyle}
 */
function normalizeTextStyleUpdate(u) {
 /** @type {Record<string, any>} */
  const out = {};
  
  if (!u || typeof u !== 'object') return out;

  // colors
  if ('fill' in u) out.fill = String(u.fill);
  if ('color' in u) out.fill = String(u.color);
  if ('stroke' in u) out.stroke = String(u.stroke);
  if ('strokeColor' in u) out.stroke = String(u.strokeColor);

  // stroke width (allow 0)
  if ('strokeWidth' in u) out.strokeWidth = Number(u.strokeWidth);
  if ('width' in u && ('stroke' in u || 'strokeColor' in u)) out.strokeWidth = Number(u.width);

  // font family / size
  if ('fontFamily' in u) out.fontFamily = String(u.fontFamily);
  if ('family' in u) out.fontFamily = String(u.family);
  if ('fontSize' in u) out.fontSize = Number(u.fontSize);
  if ('size' in u) out.fontSize = Number(u.size);

  // weight
  if ('fontWeight' in u) out.fontWeight = String(u.fontWeight);
  if ('bold' in u) out.fontWeight = u.bold ? 'bold' : 'normal';

  // italic
  if ('fontStyle' in u) out.fontStyle = u.fontStyle;
  if ('italic' in u) out.fontStyle = u.italic ? 'italic' : 'normal';

  return out;
}


function applyTextStyleToActive(update) {
  if (!canvas) return;
  const obj = canvas.getActiveObject?.();
  if (!obj) return;

  const mapped = normalizeTextStyleUpdate(update);

  if (obj.curved) {
    // Update the group’s style “bag” (our own), then reflow
    obj.textStyle = obj.textStyle || {};

    if ('fill'       in mapped) obj.textStyle.fill       = mapped.fill;
    if ('stroke'     in mapped) obj.textStyle.stroke     = mapped.stroke;
    if ('strokeWidth'in mapped) obj.textStyle.strokeWidth= mapped.strokeWidth;

    if ('fontFamily' in mapped) obj.textStyle.fontFamily = mapped.fontFamily;
    if ('fontWeight' in mapped) obj.textStyle.fontWeight = mapped.fontWeight;
    if ('fontStyle'  in mapped) obj.textStyle.italic     = (mapped.fontStyle === 'italic');
    if ('fontSize'   in mapped) obj.textStyle.fontSize   = mapped.fontSize;

    // Reflow in-place so glyphs are rebuilt with new styles
    reflowCurvedText(obj, { textStyle: obj.textStyle });
    canvas.requestRenderAll();
    return;
  }

  // Plain Fabric text objects
  const patch = {};
  if ('fill'        in mapped) patch.fill       = mapped.fill;
  if ('stroke'      in mapped) patch.stroke     = mapped.stroke;
  if ('strokeWidth' in mapped) patch.strokeWidth= mapped.strokeWidth;
  if ('fontFamily'  in mapped) patch.fontFamily = mapped.fontFamily;
  if ('fontWeight'  in mapped) patch.fontWeight = mapped.fontWeight;
  if ('fontStyle'   in mapped) patch.fontStyle  = mapped.fontStyle;
  if ('fontSize'    in mapped) patch.fontSize   = mapped.fontSize;

  obj.set(patch);
  canvas.requestRenderAll();
}



function uploadImage() {
  fileInput.value.click();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    });
  };
  reader.readAsDataURL(file);
}

/*let obj;*/

function sendToBack() {
  const targets = getSelectionTargets()
  if (!targets.length) return alert('Select The Sign Element First')
  const minIndex = bottomIndexAboveGrid() // or 0 if you want truly bottom
  targets.forEach(o => moveToBackSafe(o, minIndex))
}

function bringToFront() {
  const targets = getSelectionTargets()
  if (!targets.length) return alert('Select The Sign Element First')
  // If you also keep a faceRect overlay etc., you can set maxIndex just below it.
  targets.forEach(o => moveToFrontSafe(o))
}


function deleteSelected() {
   const obj = assignActiveObj();
  if (obj) {
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function alignLeft() {
  const obj = assignActiveObj();
  if (obj) {
    obj.set({ left: 0 });
    canvas.requestRenderAll();
  }
}

function alignCenter() {
 const obj = assignActiveObj();
  if (obj) {
    obj.set({ left: canvas.getWidth() / 2 - obj.getScaledWidth() / 2 });
    canvas.requestRenderAll();
  }
}

function alignRight() {
  const obj = assignActiveObj();
  if (obj) {
    obj.set({ left: canvas.getWidth() - obj.getScaledWidth() });
    canvas.requestRenderAll();
  }
}

function alignTop() {
  const obj = assignActiveObj();
  if (obj) {
    obj.set({ top: 0 });
    canvas.requestRenderAll();
  }
}

function alignMiddle() {
  const obj = assignActiveObj();
  if (obj) {
    obj.set({ top: canvas.getHeight() / 2 - obj.getScaledHeight() / 2 });
    canvas.requestRenderAll();
  }
}

function alignBottom() {
  const obj = assignActiveObj();
  if (obj) {
    obj.set({ top: canvas.getHeight() - obj.getScaledHeight() });
    canvas.requestRenderAll();
  }
}

function groupObjects() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'activeSelection') {
    active.toGroup();
    canvas.requestRenderAll();
  }
}

function ungroupObjects() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'group') {
    active.toActiveSelection();
    canvas.requestRenderAll();
  }
}

//sign-type template components
function addBasePostForSign(signType) {
  let postHeight = 0;

  if (signType.startsWith('Monument')) {
    postHeight = 72; // 3 ft × 24 px
  } else if (signType.startsWith('Pylon')) {
    postHeight = 240; // 10 ft × 24 px
  }
  if (postHeight > 0) {
    const post = new fabric.Rect({
      width: 16, // 8 in wide (2/3's of 24 px)
      height: postHeight,
      fill: '#444444',
      left: canvas.getWidth() / 2 - 12,
      top: canvas.getHeight() - postHeight,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      evented: false,
    });

    canvas.add(post);
    post.sendToBack();
  }

  //Save or update user design.
  async function saveDesign() {
    const canvasData = canvas.toJSON();
    const payload = {
      name: design.value?.name || 'Untitled Design',
      canvas_data: canvasData,
    };

    if (design.value?.id) {
      // Update existing design
      await axios.put(`/api/user/canvases/${design.value.id}`, payload);
    } else {
      // Create new design
      const response = await axios.post('/api/user/canvases', payload);
      design.value = response.data; // Update current session with new ID
    }
  }

 
}

function assignActiveObj(){
  return canvas.getActiveObject();
}
// after creating gridGroup and canvas.add(gridGroup)
moveToBackSafe(gridGroup, 0)



function applyUserDimensions(widthIn, heightIn, ppi) {
  const wPx = Math.max(1, Math.round(widthIn * ppi));
  const hPx = Math.max(1, Math.round(heightIn * ppi));

  canvas.setDimensions({ width: wPx, height: hPx }, { cssOnly: false });
  canvas.calcOffset();
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.setZoom(1);
  canvas.requestRenderAll();
}

const PATH_PRESETS = {
  ArcUp: 'M 0 150 Q 150 0 300 150',
  ArcDown: 'M 0 0 Q 150 150 300 0',
  Wave: 'M 0 100 C 50 0, 100 200, 150 100 S 250 0, 300 100'
};

function addTextOnPath({
  text = 'Your curved text',
  pathD = PATH_PRESETS.ArcUp,
  fontFamily = 'Arial',
  fontSize = 48,
  letterSpacing = 2,
  startOffset = 0,
  align = 'center',
  flip = false
} = {}) {
  const group = createTextOnPath({ text, pathD, fontFamily, fontSize, letterSpacing, startOffset, align, flip });
  group.set({ left: 50, top: 50 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
}

// If the selected object is a text-on-path group, update it
function tweakSelectedTextOnPath(patch) {
  const active = canvas.getActiveObject();
  if (active?.data?.kind === 'text-on-path') {
    updateTextOnPath(active, patch);
  }
}

// After JSON load:
function loadCanvasFromJson(json) {
  canvas.loadFromJSON(json, () => {
    // Optional pass to harden sub-object flags
    canvas.getObjects().forEach(obj => rehydrateTextOnPath(obj));
    canvas.renderAll();
  });
}

function isTextOnPathGroup(obj: any) {
  return obj?.data?.kind === 'text-on-path'
    || (Array.isArray(obj?._objects) && obj._objects[0]?.type === 'path')
}

function handlePathTextChange(payload) {
  const obj = canvas?.getActiveObject()
  if (!obj || !isTextOnPathGroup(obj)) return
  updateTextOnPath(obj, payload)  // 👈 payload has fill / stroke / strokeWidth now
}

function handlePathTextApply(payload) {
  const obj = canvas?.getActiveObject()
  if (!obj || !isTextOnPathGroup(obj)) return
  updateTextOnPath(obj, payload)
}

function hydrateStyleFromObject(obj: any | null) {
  console.log("hydrateStyleFromObject was called.")
  if (!obj) {
    console.log("hydrateStyleFromObject(obj: any | null) is !obj")
    selectionKind.value = 'none'
    return
  }

  selectionKind.value = getSelectionKind(obj)
  console.log("hydrateStyleFromObject(obj: any | null) is an obj and its value is: "+selectionKind.value)
  if (isTextOnPathGroup(obj) && obj.data?.options) {
    const o = obj.data.options
    styleState.fill = o.fill ?? styleState.fill
    styleState.stroke = o.stroke ?? styleState.stroke
    styleState.strokeWidth = o.strokeWidth ?? styleState.strokeWidth
    styleState.fontFamily = o.fontFamily ?? styleState.fontFamily
    styleState.fontSize = o.fontSize ?? styleState.fontSize
    styleState.fontWeight = o.fontWeight ?? styleState.fontWeight
    styleState.fontStyle = o.fontStyle ?? styleState.fontStyle
  } else {
    styleState.fill = obj.fill ?? styleState.fill
    styleState.stroke = obj.stroke ?? styleState.stroke
    styleState.strokeWidth = obj.strokeWidth ?? styleState.strokeWidth
    styleState.fontFamily = obj.fontFamily ?? styleState.fontFamily
    styleState.fontSize = obj.fontSize ?? styleState.fontSize
    styleState.fontWeight = obj.fontWeight ?? styleState.fontWeight
    styleState.fontStyle = obj.fontStyle ?? styleState.fontStyle
  }
}

function getSelectionKind(obj: any) {
   console.log("obj.isType') is "+obj.isType)
  if (!obj) return 'none'

  if (obj.data?.kind === 'text-on-path' ||
      (Array.isArray(obj._objects) && obj._objects[0]?.type === 'path')) {
    return 'text-on-path'
  }

  if (obj.isType?.('i-text') || obj.isType?.('text')) {
    return 'text'
  }

  if (obj.isType?.('rect')) return 'rect'
  if (obj.isType?.('circle')) return 'circle'

  return 'generic'
}



</script>

<style scoped>
.btn {
  @apply w-full mb-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600;
}
canvas {
  border: 1px solid #ccc;
}
</style>
