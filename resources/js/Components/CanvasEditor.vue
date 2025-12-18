<template>
  <div class="w-full min-h-screen bg-white">
    
    <header class="max-w-[1400px] mx-auto px-4">
      <div class="grid grid-cols-12 gap-4 pt-6">
        <!-- left spacer matches sidebar width -->
        <div class="col-span-12 lg:col-span-3"></div>
        <h1 class="col-span-12 lg:col-span-9 text-center text-2xl sm:text-3xl font-semibold">
          <!-- Keep your HxW header; pull values from your current props/state -->
          Sign Face {{ formHeightIn }} x {{ formWidthIn }} (inches)
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
            <div class="flex items-center justify-center mb-4">
              <!-- If you already compute a thumbnail, keep using it; otherwise swap this binding -->
              <img :src="thumbnailSrc" alt="Sign type thumbnail" class="h-20 object-contain" />
            </div>

               <!-- Settings panel -->
   <!--  <aside class="w-80 shrink-0 border-r p-4 space-y-4 bg-white"> -->
      <h2 class="text-lg font-semibold mb-2 text-center">Design Settings</h2>

      <!-- Sign Type -->
      <label class="block font-semibold mb-4">
        Sign Type
        <select
          v-model="signType"
          class="mt-2 w-full rounded border p-2"
          aria-label="Sign type"
        >
          <option v-for="opt in signTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <!-- Dimensions -->
<div class="space-y-3">
  <h4 class="font-semibold mx-2">Sign Dimensions</h4>
    <div class="grid grid-cols-2 gap-2">
      <label class="text-sm">Height (in)</label>
      <input
        type="number"
        min="1"
        step="0.25"
        v-model.number="formHeightIn"
        :disabled="!editingDims"
        class="border rounded px-2 py-1 w-full disabled:bg-gray-100"
      />
      <label class="text-sm">Width (in)</label>
      <input
        type="number"
        min="1"
        step="0.25"
        v-model.number="formWidthIn"
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

  <div class="mt-4 space-y-2">
    <h4 class="font-semibold text-sm">Canvas Background</h4>
    <div class="flex items-center gap-2">
      <input
        type="color"
        v-model="backgroundColor"
        class="h-10 w-14 border rounded cursor-pointer"
        aria-label="Canvas background color"
        @change="onBackgroundColorCommit"
      />
      <input
        type="text"
        v-model="backgroundColor"
        class="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="#ffffff"
        @change="onBackgroundColorCommit"
      />
      <button
        type="button"
        class="px-2 py-1 text-xs border rounded hover:bg-gray-50"
        @click="onBackgroundColorReset"
      >
        Reset
      </button>
    </div>
  </div>

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
          class="mt-4"
          :hasSelection="!!hasSelection"
          :kind="selectionKind"
          :styleState="styleState"
          :fonts="availableFonts"  
          :path-meta="selectionState.pathMeta"
          @font-family="onChangeFontFamily" 
         @change-style="handlePropertiesStyleChange"
        @path-text-change="(opts) => tweakSelectedTextOnPath(opts)"
        @path-text-apply="(opts) => tweakSelectedTextOnPath(opts)"
        />
        <!-- Example toolbar snippet in CanvasEditor.vue -->
        <div class="flex items-center gap-2 mb-3">
          <!-- ...your existing buttons (add text, shapes, etc.)... -->

          <button
            type="button"
            class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            :disabled="isSaving || !canSave"
            @click="saveDesign"
          >
            <span v-if="!isSaving">Save Design</span>
            <span v-else>Saving…</span>
          </button>
        </div>

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

  <!-- TOOLBAR: directly beneath canvas, horizontal -->
  <div class="mt-3 rounded-xl border bg-white/90 backdrop-blur p-2 sticky md:static bottom-3 z-10">
    <DesignerToolsPanel  
      :snapToGrid="snapToGrid"
      :hasSelection="hasSelection"  
      :gridVisible="gridVisible"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @undo="undoCanvas"
      @toggle-snap="(val) => snapToGrid = val"
      @toggle-grid="(val) => { gridVisible = val; refreshGrid() }"
      @add-text="addText"
      @add-curved-text="addTextOnPath"     
      @add-rectangle="addRectangle"
      @add-circle="addCircle"
      @start-line-tool="beginLineDrawMode"
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
<div class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
  <div class="flex flex-col">
    <label class="text-xs font-semibold text-gray-600">
      Design Title
    </label>
    <input
      v-model="designName"
      type="text"
      class="mt-1 w-full max-w-sm rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      placeholder="My Sign Design"
    />
  </div>

  <div class="mt-2 flex items-center gap-2 sm:mt-0">
    <button
      type="button"
      class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
      :disabled="isSaving || isLoadingDesign || !canSave"
      @click="saveDesign"
    >
      <span v-if="!isSaving">{{ currentDesignId ? 'Update Design' : 'Save Design' }}</span>
      <span v-else>Saving…</span>
    </button>
  </div>
</div>


  </div>

  <!-- Canvas container -->
  <div ref="stage" class="relative bg-white border rounded-lg">
    <!-- <div class="absolute inset-0 pointer-events-none"></div> -->
    <canvas ref="canvasEl" id="canvasEl" class="w-full h-full block mx-auto"></canvas>
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
  ppi: { type: Number, default: 10 },      // 10 px per inch display scale
  canvas: Object,
  activeObject: Object,
  hasSelection: Boolean,
  designId: {
    type: Number,
    default: null, // passed via Inertia from ?design_id=123
  },
  signType: {
    type: String,
    default: null, // e.g. "wall_sign_cabinet"
  },
  signCategory: {
    type: String,
    default: null, // e.g. "Wall Sign"
  },
  signWidth: {
    type: Number,
    default: null, // inches
  },
  signHeight: {
    type: Number,
    default: null, // inches
  },
  signDepth: {
    type: Number,
    default: null, // inches
  },
}) 

// local state
const editingDims = ref(false)
const formWidthIn = ref(props.initialWidthIn)
const formHeightIn = ref(props.initialHeightIn)
const dimError = ref('')
const gridEnabled = ref(true);       // or from your existing state
const gridSize = ref(24);            // 24px squares
const backgroundColor = ref('#ffffff');

const history = ref<any[]>([]);
const historyIndex = ref(-1);
let isRestoringHistory = false;

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(
  () =>
    historyIndex.value >= 0 &&
    historyIndex.value < history.value.length - 1
);

// --- Line tool state ---
const currentTool = ref<'none' | 'line'>('none')
let isDrawingLine = false
let activeLine: fabric.Line | null = null
let lineStart = { x: 0, y: 0 }

/*const template = signTemplates[props.signType];*/
const fileInput = ref(null)

const snapToGrid = ref(false)
const selectedObject = reactive({})
/*const showDrawer = ref(false)*/
let totalHeight = 0
const activeObj = ref(null);

/** canvas + layout */
const viewport = reactive({ w: 1200, h: 620 }) // updated on mount/resize
const pad = 40 // screen-pixel padding around the face when fitting
const hasSelection = ref(false)

/*type SelectionKind =
  | 'none'
  | 'text'
  | 'text-on-path'
  | 'rect'
  | 'circle'
  | 'line'
  | 'image'
  | 'generic'
  | 'unknown';*/
const selectionKind = ref<'none' | 'text' | 'text-on-path' | 'rect' | 'circle' | 'line' | 'generic'>('none')  
const isLoadingDesign = ref(false)

const SHADOW_KEYS = ['shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY']
const styleState = reactive({
  fill: '#000000' as string | null,
  stroke: null as string | null,
  strokeWidth: 0,
  opacity: 1 as number | null,
  fontFamily: 'Arial' as string | null,
  fontSize: 40 as number | null,
  fontWeight: '400' as string | null,
  fontStyle: 'normal' as string | null,
})

interface Design {
  id: number;
  user_id: number;
  name: string | null;
  slug: string | null;

  sign_type: string | null;        // "wall_sign_cabinet", etc.
  sign_category: string | null;

  // Physical sign dimensions (inches)
  sign_width: number | null;       // e.g., 120
  sign_height: number | null;      // e.g., 48
  sign_depth: number | null;       // cabinet depth, etc.

  // Canvas dimensions (pixels)
  canvas_width: number;            // e.g., 480
  canvas_height: number;           // e.g., 240

  grid_size: number;               // e.g., 24
  grid_enabled: boolean;           // stored as tinyint(1) in DB
  snap_to_grid: boolean;

  background_color: string | null; // "#ffffff"

  canvas_state: any;               // fabric.toJSON() object
  settings: any;                   // misc JSON; can be {}

  status: "draft" | "final" | string;
  order_id: number | null;
  created_at: string;
  updated_at: string;
}

let _bound = false;

let isPointerDown = false;
let pendingCurvedReflow = null;

/** optional: thumbnail from templates */
const thumbnailSrc = computed(() =>
  signTemplates[signType.value]?.thumbnail ?? 'img/sign-type/placeholder.png'
)

// Name for the design
const designName = ref('My Sign Design');
const currentDesignId = ref(null);
// Saving state
const isSaving = ref(false);
// Simple computed to prevent saving with no canvas or name
const canSave = computed(() => {
  return !!fabricCanvas.value && !!designName.value.trim();
  // or just: return !!fabricCanvas.value;
});

// 🔹 Helper: super simple toast – replace with your own UI
function showToast(message, type = 'success') {
  // Integrate with your own notification system here
  // For now, keep it dead simple:
  if (type === 'error') {
    console.error(message);
  }
  window.alert(message);
}

// Track canvas snapshot history, for undo, redo actions:
function pushHistorySnapshot(label?: string) {
  const c = fabricCanvas.value || canvas;
  if (!c || isRestoringHistory) return;

  const json = c.toJSON();

  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }

  history.value.push(json);
  historyIndex.value = history.value.length - 1;

  console.log('[history] push', {
    label,
    index: historyIndex.value,
    length: history.value.length,
  });
}

function handleCanvasMouseDown(opt: fabric.IEvent<MouseEvent>) {
  if (currentTool.value !== 'line') return
  if (!canvas) return

  const pointer = canvas.getPointer(opt.e)

  lineStart = { x: pointer.x, y: pointer.y }

  activeLine = new fabric.Line(
    [pointer.x, pointer.y, pointer.x, pointer.y],
    {
      stroke: '#000000',
      strokeWidth: 2,
      selectable: true,
      evented: true,
      // optional:
      // strokeUniform: true
    }
  )

  canvas.add(activeLine)
  isDrawingLine = true
}

function handleCanvasMouseMove(opt: fabric.IEvent<MouseEvent>) {
  if (currentTool.value !== 'line') return
  if (!isDrawingLine) return
  if (!canvas || !activeLine) return

  const pointer = canvas.getPointer(opt.e)

  activeLine.set({
    x2: pointer.x,
    y2: pointer.y
  })

  canvas.renderAll()
}

function handleCanvasMouseUp(_opt: fabric.IEvent<MouseEvent>) {
  if (currentTool.value !== 'line') return
  if (!canvas) return

  if (isDrawingLine && activeLine) {
    activeLine.setCoords()
  }

  isDrawingLine = false
  activeLine = null

  // Exit line mode after drawing one line.
  currentTool.value = 'none'
  canvas.defaultCursor = 'default'
  canvas.renderAll()
}


function normalizeObjectForEditing(obj: fabric.Object) {
  const anyObj = obj as any;
  anyObj.isGrid ??= false;
  if (anyObj.isGrid) return;

  obj.set({
    selectable: true,
    evented: true,
    hasControls: true,
    lockScalingX: false,
    lockScalingY: false,
    lockRotation: false,
    lockMovementX: false,
    lockMovementY: false,
  });

  // ensure they use the default control set
  anyObj.controls = (fabric.Object.prototype as any).controls;
}

// undo/redo: tracking indexed actions
function restoreHistoryAt(index: number) {
  const c = fabricCanvas.value || canvas;
  if (!c) return;
  if (index < 0 || index >= history.value.length) return;

  const json = history.value[index];

  console.log('[history] restore', { index });

  isRestoringHistory = true;
  c.loadFromJSON(json, () => {
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.setZoom(1);

    c.getObjects().forEach((obj: any) => {
      normalizeObjectForEditing(obj);
    });

    c.requestRenderAll();
    refreshGrid();

    isRestoringHistory = false;
  });
}

function undoCanvas() {
  if (!canUndo.value) return;
  const targetIndex = historyIndex.value;
  console.log('[history] undo →', targetIndex);
  historyIndex.value = targetIndex -1;
  restoreHistoryAt(targetIndex);
}

function redoCanvas() {
  if (!canRedo.value) return;
  const targetIndex = historyIndex.value + 1;
  console.log('[history] redo →', targetIndex);
  historyIndex.value = targetIndex;
  restoreHistoryAt(targetIndex);
}

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
  text: 'Sample Text',
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
const gridVisible = ref(true)    // default ON
const isCurvedActive = computed(() => activeObj.value && activeObj.value.customType === 'curvedText');
const selectionState = reactive({
  kind: 'none',
  pathMeta: null as any | null,
})

function updateSelectionFromCanvasSelection() {
  if (!canvas) {
    selectionKind.value = 'none';
    selectionState.pathMeta = null;
    return;
  }

  const obj = canvas.getActiveObject?.();
  if (!obj) {
    selectionKind.value = 'none';
    selectionState.pathMeta = null;
    return;
  }

  const kind = getSelectionKind(obj as any);
  console.log('getSelectionKind(obj), returns :', kind);
  selectionKind.value = kind;

  if (kind === 'text-on-path') {
    const anyObj = obj as any;
    // Prefer sbPathMeta (panel/live), fall back to data.options (initial)
    const opts = anyObj.sbPathMeta || anyObj.data?.options || {};

    selectionState.pathMeta = {
      text:          opts.text          ?? 'Sample Text',
      presetKey:     opts.presetKey     ?? 'ArcUp',      // or whatever your default preset key is
      letterSpacing: opts.letterSpacing ?? 0,
      startOffset:   opts.startOffset   ?? 0,
      align:         opts.align         ?? 'center',
      flip:          opts.flip          ?? false,
      showPath:      opts.showPath      ?? false,
    };
  } else {
    // For non text-on-path selections, clear pathMeta
    selectionState.pathMeta = null;
  }
}


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
    /*console.log("e.selected[0] is: "+e.selected[0])
    console.log("Calling hydrateStyleFromObject, passing  e.selected[0]")*/
    hydrateStyleFromObject(e.selected?.[0] ?? null);
    onSelectionChange
    syncActive;
    
  });
  fCanvas.on('selection:updated', (e) => {
    hydrateStyleFromObject(e.selected?.[0] ?? null);
    onSelectionChange
    syncActive;
    
  });
  fCanvas.on('selection:cleared', () => { 
    onSelectionClear
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

const fabricCanvas = ref(null);
const canvasRef = ref(null);     // <canvas ref="canvasRef">
const wrapRef = ref(null);       // wrapper <div ref="wrapRef">

/*let gridGroup: fabric.Group | null = null*/
let canvas: fabric.Canvas | null = null;
let gridGroup: fabric.Object | null = null;
function hydrateStyleFromObject(obj: any | null) {
  
  if (!obj) {
    selectionKind.value = 'none'
    return
  }

  selectionKind.value = getSelectionKind(obj)
  console.log("getSelectionKind(obj), returns : "+selectionKind.value) //e.g. returns: rect
  if (isTextOnPathGroup(obj)) {
  const o = obj.sbPathMeta || obj.data?.options || {};

  styleState.fill = o.fill ?? styleState.fill;
  styleState.stroke = o.stroke ?? styleState.stroke;
  styleState.strokeWidth = o.strokeWidth ?? styleState.strokeWidth;
  styleState.fontFamily = o.fontFamily ?? styleState.fontFamily;
  styleState.fontSize = o.fontSize ?? styleState.fontSize;
  styleState.fontWeight = o.fontWeight ?? styleState.fontWeight;
  styleState.fontStyle = o.fontStyle ?? styleState.fontStyle;
  styleState.opacity = typeof obj.opacity === 'number' ? obj.opacity : styleState.opacity;

  return;
} else {
    styleState.fill = obj.fill ?? styleState.fill
    styleState.stroke = obj.stroke ?? styleState.stroke
    styleState.strokeWidth = obj.strokeWidth ?? styleState.strokeWidth
    styleState.fontFamily = obj.fontFamily ?? styleState.fontFamily
    styleState.fontSize = obj.fontSize ?? styleState.fontSize
    styleState.fontWeight = obj.fontWeight ?? styleState.fontWeight
    styleState.fontStyle = obj.fontStyle ?? styleState.fontStyle
    styleState.opacity = typeof obj.opacity === 'number' ? obj.opacity : styleState.opacity
  }
}
function syncSelectionState() {
  if (!canvas) return;

  // 1) update selection snapshot (your existing logic)
  updateSelectedObject();

  // 2) update selectionKind + pathMeta (new logic)
  updateSelectionFromCanvasSelection();

  // 3) update hasSelection
  hasSelection.value = !!canvas.getActiveObject?.();
}
function onSelectionChange() {
  const obj = canvas.getActiveObject()
  if (!obj) return
  syncStyleStateFromObject(obj)
}

function onSelectionClear() {
  styleState.fill = null
  styleState.stroke = null
  styleState.strokeWidth = 0
  styleState.opacity = 1
  styleState.fontFamily = null
  styleState.fontSize = null
  styleState.fontWeight = null
  styleState.fontStyle = null
  ;(styleState as any).shadow = null
}


function clearSelectionState() {
  // Clear your selectedObject reactive bag
  Object.keys(selectedObject).forEach(key => delete (selectedObject as any)[key]);

  // Clear kind/meta (however you store them)
  selectionKind.value = 'none';
  selectionState.pathMeta = null;

  // Clear hasSelection
  hasSelection.value = false;
}

function setBackgroundColor(color: string) {
  const normalized = color || '#ffffff';
  backgroundColor.value = normalized;
  if (!canvas) return;

  // Use Fabric helper when available; otherwise fall back to setting the prop directly.
  const c: any = canvas as any;
  if (typeof c.setBackgroundColor === 'function') {
    c.setBackgroundColor(normalized, () => canvas?.requestRenderAll());
  } else {
    c.backgroundColor = normalized;
    canvas.requestRenderAll();
  }
}

function onBackgroundColorCommit() {
  setBackgroundColor(backgroundColor.value);
  pushHistorySnapshot('backgroundColor');
}

function onBackgroundColorReset() {
  setBackgroundColor('#ffffff');
  pushHistorySnapshot('backgroundColor');
}

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

  fabricCanvas.value = canvas;
  // TS-safe global exposure for debugging
  (window as any).canvas = canvas;
  setBackgroundColor(backgroundColor.value);

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

  // === selection listeners (single, unified pipeline) ===
canvas.on('selection:created', (e) => {
  const obj = e.selected?.[0] ?? canvas.getActiveObject?.() ?? null;

  hydrateStyleFromObject(obj);    // keeps styleState/UI in sync with selection
  updateSelectedObject();         // sets selectionState.kind + selectionState.pathMeta
  hasSelection.value = true;      // keeps your existing flag correct
});

canvas.on('selection:updated', (e) => {
  const obj = e.selected?.[0] ?? canvas.getActiveObject?.() ?? null;

  hydrateStyleFromObject(obj);
  updateSelectedObject();
  hasSelection.value = true;
});

canvas.on('selection:cleared', () => {
  hydrateStyleFromObject(null);

  // Clear the selectedObject reactive bag if you still use it elsewhere
  Object.keys(selectedObject).forEach(key => delete (selectedObject as any)[key]);

  selectionState.kind = 'none';
  selectionState.pathMeta = null;

  selectionKind.value = 'none';
  hasSelection.value = false;
});


  //for line drawing.
  canvas.on('mouse:down', handleCanvasMouseDown)
  canvas.on('mouse:move', handleCanvasMouseMove)
  canvas.on('mouse:up', handleCanvasMouseUp)

  canvas.on('object:moving', (e) => {
    if (!snapToGrid.value) return
      if (isRestoringHistory) return;
    const obj = e.target    
    obj.set({
      left: Math.round(obj.left / 24) * 24,
      top: Math.round(obj.top / 24) * 24,
    })    
    pushHistorySnapshot('object:moved');
  })
  canvas.on('object:added', (e) => {
    if (isRestoringHistory) return;
    const target: any = e.target;
    if (!target) return;
    if (target.isGrid) return; // don't track grid-only changes

    /*object:added was duplicating the pushHistory snapshots that 
    addCircle, etc, were calling:
    pushHistorySnapshot('object:added');*/
  });

  canvas.on('object:modified', (e) => {
  if (isRestoringHistory) return;
  const target: any = e.target;
  if (!target) return;
  if (target.isGrid) return;
  pushHistorySnapshot('object:modified');
});

  canvas.on('object:removed', (e) => {
    if (isRestoringHistory) return;
    const target: any = e.target;
    if (!target) return;
    if (target.isGrid) return;

    pushHistorySnapshot('object:removed');
  });

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
 
  if (!props.designId) {
    /*drawGrid(canvas);*/
    gridVisible.value = true;
    refreshGrid();
    /*canvas.requestRenderAll();*/
  }
   bindCanvasSelectionEvents(canvas);
   if(props.designId) {
    await loadDesignById(props.designId);
  }
  // Take initial history snapshot once everything is in a stable state
  pushHistorySnapshot('initial');
})

async function loadDesignById(id: number | null) {
  if (!id) return;
  if (!fabricCanvas.value) {
    console.warn('[loadDesignById] Fabric canvas not ready yet');
    return;
  }

  isLoadingDesign.value = true;

  try {
    console.log('[loadDesignById] Fetching design', id);
    const { data: design } = await axios.get(`/api/designs/${id}`);

    currentDesignId.value = design.id;
    designName.value = design.name || 'My Sign Design';

    const c = fabricCanvas.value;

    // 1) Resolve inches (for the UI fields)
    const widthInches = design.sign_width ?? pxToInches(design.canvas_width);
    const heightInches = design.sign_height ?? pxToInches(design.canvas_height);

    if (widthInches) formWidthIn.value = widthInches;
    if (heightInches) formHeightIn.value = heightInches;

    // 2) Set canvas pixel dimensions straight from DB
    const pxW = design.canvas_width || c.getWidth();
    const pxH = design.canvas_height || c.getHeight();

    c.setDimensions({ width: pxW, height: pxH }, { cssOnly: false });
    c.calcOffset();

    // 3) Restore per-design PPI / grid step
    if (design.grid_size) {
      ppi.value = design.grid_size; // now matches what was used when saved
    }

    // 4) Background color
    if (design.background_color) {
      setBackgroundColor(design.background_color);
    } else {
      setBackgroundColor('#ffffff');
    }

    // 5) Load Fabric JSON
    if (design.canvas_state) {
      await new Promise((resolve) => {
        c.loadFromJSON(design.canvas_state, () => {
          c.setViewportTransform([1, 0, 0, 1, 0, 0]);
          c.setZoom(1);

          c.getObjects().forEach((obj: any) => {
            normalizeObjectForEditing(obj);
          });

          c.requestRenderAll();
          refreshGrid();
        });
      });
    }

    // 6) Rebuild grid overlay AFTER objects are in place
    gridVisible.value = design.grid_enabled ?? true;
    refreshGrid();
    // New: reset history for this design
    history.value = [];
    historyIndex.value = -1;
    pushHistorySnapshot('loaded design');

    showToast('Design loaded.');
  } catch (error) {
    console.error('[loadDesignById] Error loading design', error);
    window.alert('Failed to load design.');
  } finally {
    isLoadingDesign.value = false;
  }
}

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
/*function inchesToPixels (inches) {
  return Math.round(inches * props.ppi)
}*/
function isTextOnPathGroup(obj: any): boolean {
  if (!obj) return false;
  if (obj.data?.kind === 'text-on-path') return true;
  return obj.type === 'group' && Array.isArray(obj._objects) && obj._objects[0]?.type === 'path';
}

function inchesToPixels(inches: number | null | undefined): number | null {
  if (!inches || !ppi.value) return null;
  return Math.round(inches * ppi.value);
}

function pxToInches(px: number | null | undefined): number | null {
  if (!px || !ppi.value) return null;
  return +(px / ppi.value).toFixed(2); // keep a couple decimals
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
function getSelectionKind(obj: fabric.Object | null | undefined): SelectionKind {
  if (!obj) return 'none';

  const anyObj = obj as any;

  // Text-on-path: your canonical marker
  if (anyObj.data?.kind === 'text-on-path') return 'text-on-path';

  const type = anyObj.type;

  if (type === 'i-text' || type === 'textbox' || type === 'text') return 'text';
  if (type === 'rect') return 'rect';
  if (type === 'circle') return 'circle';
  if (type === 'line') return 'line';
  if (type === 'image') return 'image';

  return 'generic';
}

// Apply a style patch to ONE object (plain text / shapes)
function applyStyleToObject(obj, patch) {
  console.log('applyStyleToObject called for', obj.type, 'with patch', patch)

  // 1) Normalize basic keys
  const mapped = {
    ...(patch.fill         != null ? { fill: String(patch.fill) } : {}),
    ...(patch.stroke       != null ? { stroke: String(patch.stroke) } : {}),
    ...(patch.strokeWidth  != null ? { strokeWidth: Number(patch.strokeWidth) } : {}),
    ...(patch.fontFamily   != null ? { fontFamily: String(patch.fontFamily) } : {}),
    ...(patch.fontWeight   != null ? { fontWeight: String(patch.fontWeight) } : {}),
    ...(patch.fontStyle    != null ? { fontStyle: patch.fontStyle } : {}),
    ...(patch.fontSize     != null ? { fontSize: Number(patch.fontSize) } : {}),

    // shadow-related keys from ObjectPropertiesPanel (adjust names if needed)
    ...(patch.shadowColor   != null ? { shadowColor: String(patch.shadowColor) } : {}),
    ...(patch.shadowBlur    != null ? { shadowBlur: Number(patch.shadowBlur) } : {}),
    ...(patch.shadowOffsetX != null ? { shadowOffsetX: Number(patch.shadowOffsetX) } : {}),
    ...(patch.shadowOffsetY != null ? { shadowOffsetY: Number(patch.shadowOffsetY) } : {}),
    ...(patch.shadowEnabled != null ? { shadowEnabled: !!patch.shadowEnabled } : {}),
    ...(patch.shadow        != null ? { shadow: patch.shadow } : {}),
  }

  // 2) Build the native patch for Fabric (fill/stroke/fonts/etc.)
  const patchNative: any = {}
  if ('fill'        in mapped) patchNative.fill        = mapped.fill
  if ('stroke'      in mapped) patchNative.stroke      = mapped.stroke
  if ('strokeWidth' in mapped) patchNative.strokeWidth = mapped.strokeWidth
  if ('fontFamily'  in mapped) patchNative.fontFamily  = mapped.fontFamily
  if ('fontWeight'  in mapped) patchNative.fontWeight  = mapped.fontWeight
  if ('fontStyle'   in mapped) patchNative.fontStyle   = mapped.fontStyle
  if ('fontSize'    in mapped) patchNative.fontSize    = mapped.fontSize

  // ---- STROKE: simple, since text scaling is normalized already ----
  if ('stroke' in mapped || 'strokeWidth' in mapped) {
    patchNative.strokeUniform = true
  }

  // ---- SHADOW: make blur/offset feel like px, even on scaled shapes ----
  const hasShadowFields =
    'shadow'        in mapped ||
    'shadowColor'   in mapped ||
    'shadowBlur'    in mapped ||
    'shadowOffsetX' in mapped ||
    'shadowOffsetY' in mapped ||
    'shadowEnabled' in mapped

  if (hasShadowFields) {
    const existingShadow = obj.shadow || {}
    const scaleX = obj.scaleX ?? 1
    const scaleY = obj.scaleY ?? 1
    const avgScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2 || 1

    // Decide if we are turning shadow OFF explicitly
    if (mapped.shadowEnabled === false || patch.shadow === null) {
      obj.set('shadow', null)
    } else {
      // treat presence of any shadow field as "enable shadow"
      const color =
        mapped.shadowColor ??
        (mapped.shadow && mapped.shadow.color) ??
        existingShadow.color ??
        'rgba(0,0,0,0.5)'

      const logicalBlur =
        mapped.shadowBlur ??
        (mapped.shadow && mapped.shadow.blur) ??
        existingShadow.blur ??
        0

      const logicalOffsetX =
        mapped.shadowOffsetX ??
        (mapped.shadow && mapped.shadow.offsetX) ??
        existingShadow.offsetX ??
        0

      const logicalOffsetY =
        mapped.shadowOffsetY ??
        (mapped.shadow && mapped.shadow.offsetY) ??
        existingShadow.offsetY ??
        0

      // Normalize by scale so UI values feel like px on screen
      const shadow = new fabric.Shadow({
        color,
        blur:    logicalBlur    / (avgScale || 1),
        offsetX: logicalOffsetX / (avgScale || 1),
        offsetY: logicalOffsetY / (avgScale || 1),
        affectStroke: false,
      })

      obj.set('shadow', shadow)
    }
  }

  obj.set(patchNative)
  obj.setCoords?.()
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

  refreshGrid();

  canvas.requestRenderAll()
}


function updateTextOnPath(group: any, patch: Record<string, any>) {
  // If you already have text/content layout logic, keep it above this block.

  // 🔑 Apply the style patch to **every** text glyph in the group
  forEachTextGlyphInPathGroup(group, (glyph) => {
    applyStyleToObject(glyph, patch)
  })

  group.setCoords?.()
  group.canvas?.requestRenderAll()
}



function applyStyleToSelection(style: Record<string, any>) {
  console.log("applyStyleToSelection Called")
  const sel = canvas?.getActiveObject()
  if (!sel) return

  const applyToOne = (o: any) => {
    // If this is your special text-on-path group, keep using its own updater
    if (isTextOnPathGroup && isTextOnPathGroup(o)) {
      updateTextOnPath(o, style)
    } else {
      applyStyleToObject(o, style)   // 🔴 now we actually use the helper
    }
  }

  if (sel.type === 'activeSelection' && sel.forEachObject) {
    sel.forEachObject((o: any) => applyToOne(o))
  } else {
    applyToOne(sel)
  }

  canvas.requestRenderAll()
}
function isTextOnPathGeometryUpdate(o: any) {
  return (
    o &&
    (
      'preset' in o ||
      'presetKey' in o ||
      'pathD' in o ||
      'text' in o ||
      'letterSpacing' in o ||
      'startOffset' in o ||
      'align' in o ||
      'flip' in o
    )
  );
}

function stripStyleFieldsFromGeometryUpdate(o: any) {
  const out = { ...(o || {}) };

  // Remove UI snapshot style keys that should not clobber existing styling
  delete out.fill;
  delete out.fillColor;
  delete out.stroke;
  delete out.strokeColor;
  delete out.strokeWidth;

  delete out.fontFamily;
  delete out.fontSize;
  delete out.fontWeight;
  delete out.fontStyle;

  delete out.opacity;

  return out;
}

// Shared helper to apply a gradient descriptor to a text-on-path group
function applyGradientToTextOnPathGroup(group: any, desc: any) {
  if (!group || !desc || !Array.isArray(desc.colorStops)) return false;
  const glyphs = group._objects?.slice(1) || [];
  if (!glyphs.length) return false;

  const union = glyphs.reduce(
    (acc: any, glyph: any) => {
      const b = glyph.getBoundingRect?.(true, true) || { left: 0, top: 0, width: 0, height: 0 };
      const right = b.left + b.width;
      const bottom = b.top + b.height;
      return {
        left: Math.min(acc.left, b.left),
        top: Math.min(acc.top, b.top),
        right: Math.max(acc.right, right),
        bottom: Math.max(acc.bottom, bottom),
      };
    },
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );
  const unionWidth = Math.max(1, union.right - union.left);
  const unionHeight = Math.max(1, union.bottom - union.top);

  glyphs.forEach((glyph: any) => {
    const b = glyph.getBoundingRect?.(true, true) || { left: 0, top: 0, width: unionWidth, height: unionHeight };
    const dx = b.left - union.left;
    const dy = b.top - union.top;

    let coords: any;
    switch (desc.direction) {
      case 'vertical':
        coords = { x1: 0 - dx, y1: 0 - dy, x2: 0 - dx, y2: unionHeight - dy };
        break;
      case 'diagonal':
        coords = { x1: 0 - dx, y1: 0 - dy, x2: unionWidth - dx, y2: unionHeight - dy };
        break;
      case 'horizontal':
      default:
        coords = { x1: 0 - dx, y1: 0 - dy, x2: unionWidth - dx, y2: 0 - dy };
        break;
    }

    const grad = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords,
      colorStops: (desc.colorStops || []).map((cs: any) => ({
        offset: Number(cs.offset),
        color: String(cs.color),
      })),
    });

    glyph.set('fill', grad);
    glyph.dirty = true;
  });

  group.dirty = true;
  return true;
}


function handlePropertiesStyleChange(update: any) {
  if (!canvas) return;
  const obj = canvas.getActiveObject?.();
  if (!obj) return;

  // Gradient fill: build a fabric.Gradient and apply as obj.fill
  if (update?.gradientFill) {
    const g = update.gradientFill;
    const colorStops = (g.colorStops || []).map((cs: any) => ({
      offset: Number(cs.offset),
      color: String(cs.color),
    }));

    // Simple percentage-based gradient for non-path objects
    const makePercentGradient = (direction: string) => {
      let coords: any;
      switch (direction) {
        case 'vertical':
          coords = { x1: 0, y1: 0, x2: 0, y2: 1 };
          break;
        case 'diagonal':
          coords = { x1: 0, y1: 0, x2: 1, y2: 1 };
          break;
        case 'horizontal':
        default:
          coords = { x1: 0, y1: 0, x2: 1, y2: 0 };
          break;
      }
      return new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'percentage',
        coords,
        colorStops,
      });
    };

    // Text-on-path groups: use union of glyph bounds and offset per glyph
    if (isTextOnPathGroup(obj)) {
      const anySel: any = obj;
      applyGradientToTextOnPathGroup(anySel, g);
      anySel.sbPathMeta = { ...(anySel.sbPathMeta || {}), fill: g };
      anySel.dirty = true;
    } else {
      const gradient = makePercentGradient(g.direction);
      (obj as any).set('fill', gradient);
      (obj as any).dirty = true;
    }

    canvas.requestRenderAll();
    pushHistorySnapshot('styleChange');
    return;
  }

  // 1) Shadow: universal (all object types)
  if ('shadow' in update) {
    if (update.shadow == null) {
      (obj as any).set('shadow', null);
    } else {
      (obj as any).set('shadow', new fabric.Shadow({
        color: update.shadow.color ?? 'rgba(0,0,0,0.35)',
        blur: update.shadow.blur ?? 0,
        offsetX: update.shadow.offsetX ?? 0,
        offsetY: update.shadow.offsetY ?? 0,
      }));
    }

    (obj as any).dirty = true;
    canvas.requestRenderAll();
    pushHistorySnapshot('styleChange');
    return;
  }

  // 2) Text-on-path: route text style into your meta/reflow pipeline
  if (isTextOnPathGroup(obj)) {
    const mapped = normalizeTextStyleUpdate(update);
    const opts: any = {};

    if ('fill' in mapped) opts.fill = mapped.fill;
    if ('opacity' in mapped) opts.opacity = mapped.opacity;

    if ('stroke' in mapped) opts.stroke = mapped.stroke;
    if ('strokeWidth' in mapped) opts.strokeWidth = mapped.strokeWidth;

    if ('fontFamily' in mapped) opts.fontFamily = mapped.fontFamily;
    if ('fontSize' in mapped) opts.fontSize = mapped.fontSize;
    if ('fontWeight' in mapped) opts.fontWeight = mapped.fontWeight;
    if ('fontStyle' in mapped) opts.fontStyle = mapped.fontStyle;

    tweakSelectedTextOnPath(opts);

    canvas.requestRenderAll();
    pushHistorySnapshot('styleChange');
    return;
  }

  // 3) Everything else: actually apply the patch to the active object
  const patch = normalizeTextStyleUpdate(update);

  // IMPORTANT: apply
  (obj as any).set(patch);

  (obj as any).dirty = true;
  obj.setCoords?.();

  canvas.requestRenderAll();
  pushHistorySnapshot('styleChange');
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

function updateSelectedObject() {
  const sel = canvas?.getActiveObject();

  if (!sel) {
    selectionState.kind = 'none';
    selectionState.pathMeta = null;

    selectionKind.value = 'none';
    hasSelection.value = false;
    return;
  }

  hasSelection.value = true;

  // Prefer using getSelectionKind everywhere so you’re not maintaining two classification systems
  const kind = getSelectionKind(sel as any);
  selectionState.kind = kind;
  selectionKind.value = kind;

  if (kind === 'text-on-path' && isTextOnPathGroup(sel)) {
    // Use sbPathMeta if it exists, otherwise fall back to the serialized meta you showed earlier
    const opts = (sel as any).sbPathMeta
      || (sel as any).data?.options
      || {};

    selectionState.pathMeta = {
      text:          opts.text ?? 'Your curved text',
      presetKey:     opts.presetKey ?? 'ArcUp',
      letterSpacing: opts.letterSpacing ?? 2,
      startOffset:   opts.startOffset ?? 0,
      align:         opts.align ?? 'center',
      flip:          !!opts.flip,
      showPath:      !!opts.showPath,
    };
  } else {
    selectionState.pathMeta = null;
  }
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

function removeGrid() {
  if (!canvas) return;

  console.log(
    '[removeGrid] before:',
    canvas.getObjects().map(o => (o as any).isGrid ? 'grid' : (o as any).name)
  );

  canvas.getObjects().forEach((obj) => {
    const anyObj = obj as any;
    if (anyObj.isGrid || anyObj.name === 'grid') {
      canvas!.remove(obj);
    }
  });

  gridGroup = null;

  console.log(
    '[removeGrid] after:',
    canvas.getObjects().map(o => (o as any).isGrid ? 'grid' : (o as any).name)
  );
}

function refreshGrid() {
  if (!canvas) return;

  console.log(
    '[refreshGrid] gridVisible:',
    gridVisible.value,
    'objects:',
    canvas.getObjects().map(o => (o as any).isGrid ? 'grid' : (o as any).name)
  );

  removeGrid();

  if (!gridVisible.value) {
    canvas.requestRenderAll();
    return;
  }

  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const step = ppi.value;
  const z = canvas.getZoom() || 1;

  const lines: fabric.Object[] = [];

  for (let x = 0; x <= w; x += step) {
    lines.push(new fabric.Line([x, 0, x, h], {
      stroke: '#ccffff',
      strokeWidth: 1 / z,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      isGrid: true,
    }) as any);
  }

  for (let y = 0; y <= h; y += step) {
    lines.push(new fabric.Line([0, y, w, y], {
      stroke: '#ccffff',
      strokeWidth: 1 / z,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      isGrid: true,
    }) as any);
  }

  gridGroup = new fabric.Group(lines, {
    left: 0,
    top: 0,
    selectable: false,
    evented: false,
    excludeFromExport: true,
    isGrid: true,
    name: 'grid',
  } as any);

  canvas.add(gridGroup);
  sendObjectToBackSafe(canvas, gridGroup);
  canvas.requestRenderAll();

  console.log(
    '[refreshGrid] after rebuild:',
    canvas.getObjects().map(o => (o as any).isGrid ? 'grid' : (o as any).name)
  );
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
  arr.splice(i, 1); arr.splice(minIndex, 0, obj);
  canvas.requestRenderAll();
  pushHistorySnapshot('zOrderChange');
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
  arr.splice(i, 1); arr.push(obj); 
  canvas.requestRenderAll();
  pushHistorySnapshot('zOrderChange');
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
  var curvedText = new fabric.CurvedText('Sample Text', {
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
    fill: '#999999',
    fontSize: 20,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
  pushHistorySnapshot('addText');
}

function addRectangle() {
  const rect = new fabric.Rect({
    left: 150,
    top: 150,
    fill: '#999999',
    width: 100,
    height: 60,
    stroke: '#000000',
    strokeWidth: 1,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  pushHistorySnapshot('addRectangle');
}


function addCircle() {
  const circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 40,
    fill: '#999999',
    stroke: '#000000',
    strokeWidth: 1,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
  pushHistorySnapshot('addCircle');
}

function beginLineDrawMode() {
  if (!canvas) return

  currentTool.value = 'line'
  isDrawingLine = false
  activeLine = null

  // Optional: disable current selection while drawing
  canvas.discardActiveObject()
  canvas.defaultCursor = 'crosshair'
  canvas.renderAll()
}

// === [CurvedText] reactive UI state ===
const curvedUI = reactive({
  text: 'Sample Text',
  radius: 150,
  startAngle: 270,
  spacing: 0,
  clockwise: true,
  inward: false,
  align: 'center', // 'start' | 'center' | 'end'
});



/*function curveSelectedText() {
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
*/

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
  if ('fill' in u) out.fill = u.fill; // allow strings OR fabric.Gradient OR patterns
  if ('color' in u) out.fill = String(u.color);
  if ('stroke' in u) out.stroke = String(u.stroke);
  if ('strokeColor' in u) out.stroke = String(u.strokeColor);

  // stroke width (allow 0)
  if ('strokeWidth' in u) out.strokeWidth = Number(u.strokeWidth);
  if ('width' in u && ('stroke' in u || 'strokeColor' in u)) out.strokeWidth = Number(u.width);

  // opacity (allow 0–1 or 0–100)
  if ('opacity' in u) {
    const raw = Number(u.opacity);
    if (Number.isFinite(raw)) {
      out.opacity = raw > 1 ? raw / 100 : raw;
    }
  }

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

  // shadow
  if ('shadowEnabled' in u) out.shadowEnabled = true;
  if ('shadowColor' in u) out.shadowColor = String(u.shadowColor);;
  if ('shadowBlur' in u) out.shadowBlur = Number(u.shadowBlur);
  if ('shadowOffsetX' in u) out.shadowOffsetX = Number(u.shadowOffsetX);
  if ('shadowOffsetY' in u) out.shadowOffsetY = Number(u.shadowOffsetY);

  return out;
}


/*function applyTextStyleToActive(update) {
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


// NEW: Text-On-Path group styling (same concept as curved)
  if (isTextOnPathGroup(obj)) {
    obj.sbPathMeta = obj.sbPathMeta || obj.data?.options || {};
    obj.sbPathMeta = { ...obj.sbPathMeta };

    // apply mapped styles into sbPathMeta
    if ('fill'        in mapped) obj.sbPathMeta.fill        = mapped.fill;
    if ('stroke'      in mapped) obj.sbPathMeta.stroke      = mapped.stroke;
    if ('strokeWidth' in mapped) obj.sbPathMeta.strokeWidth = mapped.strokeWidth;

    if ('fontFamily'  in mapped) obj.sbPathMeta.fontFamily  = mapped.fontFamily;
    if ('fontWeight'  in mapped) obj.sbPathMeta.fontWeight  = mapped.fontWeight;
    if ('fontStyle'   in mapped) obj.sbPathMeta.fontStyle   = mapped.fontStyle; // keep as fontStyle, do not convert to italic boolean
    if ('fontSize'    in mapped) obj.sbPathMeta.fontSize    = mapped.fontSize;

    // keep serialized options aligned (optional but recommended)
    if ((obj as any).data?.options) {
      (obj as any).data.options = { ...(obj as any).data.options, ...obj.sbPathMeta };
    }

    // Rebuild/reflow the text-on-path glyphs using your existing builder
    reflowTextOnPath(obj, obj.sbPathMeta); // we will wire this to your existing createTextOnPath logic
    canvas.requestRenderAll();
    return;
  }
}
*/

  function reflowTextOnPath(group: any, meta: any) {
  // 1) Remove existing glyphs, keep path at index 0
  const pathObj = group._objects?.[0];
  if (!pathObj) return;

  // Remove everything except the path
  const toRemove = group._objects.slice(1);
  toRemove.forEach(o => group.remove(o));

  // 2) Rebuild glyphs using your existing createTextOnPath logic
  // Easiest: call createTextOnPath(meta) and steal its glyphs (without replacing transforms)
  const fresh = createTextOnPath(meta) as any;

  // fresh._objects[0] is a new path; keep existing pathObj unless pathD changed
  const freshPath = fresh._objects[0];
  if (meta.pathD && pathObj.path?.toString?.() !== freshPath.path?.toString?.()) {
    // replace path object when shape changed
    group.remove(pathObj);
    group.insertAt(freshPath, 0, false);
  }

  // Add new glyphs
  fresh._objects.slice(1).forEach((g: any) => group.add(g));

  // 3) Preserve meta
  group.sbPathMeta = meta;

  // 4) Refresh geometry
  group._calcBounds?.();
  group._updateObjectsCoords?.();
  group.setCoords();
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
  pushHistorySnapshot('deleteSelected');
}

function alignLeft() {
  if (!canvas) return;

  withActiveObjects((obj) => {
    obj.set({ left: 0 });
    obj.setCoords(); // 🔑 keep bounding box / hit test in sync
  });
  pushHistorySnapshot('alignLeft')
}

function alignCenter() {
 if (!canvas) return;

  const canvasWidth = canvas.getWidth();
  withActiveObjects((obj) => {
    const width = obj.getScaledWidth();
    obj.set({ left: (canvasWidth - width) / 2 });
    obj.setCoords();
  });
  pushHistorySnapshot('alignCenter')
}

function alignRight() {
  if (!canvas) return;

  const canvasWidth = canvas.getWidth();
  withActiveObjects((obj) => {
    const width = obj.getScaledWidth();
    obj.set({ left: canvasWidth - width });
    obj.setCoords();
  });
  pushHistorySnapshot('alignRight')
}

function alignTop() {
  if (!canvas) return;

  withActiveObjects((obj) => {
    obj.set({ top: 0 });
    obj.setCoords();
  });
  pushHistorySnapshot('alignTop')
}

function alignMiddle() {
  if (!canvas) return;

  const canvasHeight = canvas.getHeight();
  withActiveObjects((obj) => {
    const height = obj.getScaledHeight();
    obj.set({ top: (canvasHeight - height) / 2 });
    obj.setCoords();
  });
  pushHistorySnapshot('alignMiddle')
}

function alignBottom() {
  if (!canvas) return;

  const canvasHeight = canvas.getHeight();
  withActiveObjects((obj) => {
    const height = obj.getScaledHeight();
    obj.set({ top: canvasHeight - height });
    obj.setCoords();
  });
  pushHistorySnapshot('alignBottom')
}


//ensure objs moved with align tools maintain bounding box coordinates.
function withActiveObjects(fn: (obj: fabric.Object) => void) {
  if (!canvas) return;

  const active = canvas.getActiveObjects();
  if (!active.length) return;

  active.forEach((obj) => fn(obj));
  canvas.requestRenderAll();
}

function groupObjects() {
  if (!canvas) return;

  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects.length) return;

  // If there's only one object and it's already a group, nothing to do
  if (activeObjects.length === 1 && (activeObjects[0] as any).type === 'group') {
    return;
  }

  const group = new fabric.Group(activeObjects, {
    selectable: true,
    evented: true,
  });

  activeObjects.forEach(obj => canvas!.remove(obj));

  canvas.add(group);
  canvas.setActiveObject(group);
  group.setCoords();
  canvas.requestRenderAll();
}


function ungroupObjects() {
  if (!canvas) return;

  const active = canvas.getActiveObject() as any;
  if (!active || active.type !== 'group') return;

  const group = active as fabric.Group;
  const items = (group as any)._objects || [];

  // Restore original child state (positions, transforms)
  if (typeof (group as any)._restoreObjectsState === 'function') {
    (group as any)._restoreObjectsState();
  }

  // Remove the group from the canvas
  canvas.remove(group);
  canvas.discardActiveObject();

  // Add each child back to the canvas as a standalone object
  items.forEach((obj: fabric.Object) => {
    obj.set({
      selectable: true,
      evented: true,
    });
    obj.setCoords();
    canvas.add(obj);
  });

  // Optionally select them all as a multi-selection
  if (items.length) {
    const selection = new fabric.ActiveSelection(items, { canvas });
    canvas.setActiveObject(selection);
  }

  canvas.requestRenderAll();
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
 
}

async function saveDesign() {
  if (!fabricCanvas.value) {
    showToast('Canvas is not ready yet.', 'error');
    return;
  }

  isSaving.value = true;

  try {
    const c = fabricCanvas.value;
    const fabricJson = c.toJSON();

    // 1) Resolve inches from form / props / fallback from px
    const widthInches =
      formWidthIn.value
      ?? props.signWidth
      ?? pxToInches(c.getWidth());

    const heightInches =
      formHeightIn.value
      ?? props.signHeight
      ?? pxToInches(c.getHeight());

    const pxW = c.getWidth();
    const pxH = c.getHeight();

    // 2) Compute effective PPI for this design, if we can
    let effectivePpi = ppi.value;
    if (widthInches && pxW) {
      effectivePpi = pxW / widthInches; // e.g. 576 / 48 = 12
    }

    // 3) Build payload
    const payload = {
      name: designName.value || null,
      slug: null,

      sign_type: props.signType || 'wall_sign_cabinet',
      sign_category: props.signCategory || null,

      // inches
      sign_width: widthInches,
      sign_height: heightInches,
      sign_depth: props.signDepth ?? null,

      // pixels
      canvas_width: pxW,
      canvas_height: pxH,

      // treat grid_size as "ppi" (or at least step size)
      grid_size: effectivePpi,
      grid_enabled: gridVisible.value ?? true,
      snap_to_grid: snapToGrid.value ?? false,
      background_color: backgroundColor.value || '#ffffff',

      canvas_state: fabricJson,
      settings: {},

      order_id: null,
      status: 'draft',
    };

    const isUpdate = !!currentDesignId.value;
    const url = isUpdate
      ? `/api/designs/${currentDesignId.value}`
      : `/api/designs`;
    const method = isUpdate ? 'put' : 'post';

    const { data: design } = await axios[method](url, payload);

    currentDesignId.value = design.id;
    designName.value = design.name || designName.value;
    // For brand-new designs, rewrite URL to include ?design_id=...
    if (!isUpdate && design.id) {
      const newUrl = `/canvas?design_id=${design.id}`;
      window.history.replaceState({}, '', newUrl);
    }

    showToast(isUpdate ? 'Design updated successfully.' : 'Design saved successfully.');
  } catch (err) {
    console.error('[saveDesign] Error:', err);
    showToast('Failed to save design. Please try again.', error);
  } finally {
    isSaving.value = false;
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
  text = 'Sample Text',
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
  updateSelectedObject()
  pushHistorySnapshot('addTextOnPath');
   // make sure panel sees the new object
}

// If the selected object is a text-on-path group, update it
function tweakSelectedTextOnPath(opts: any) {
  const sel = canvas?.getActiveObject();
  if (!sel || !isTextOnPathGroup(sel)) return;
  // Normalize keys first
  let normalized = normalizeTextOnPathOpts(opts);

  // If this is a geometry/preset update, do NOT allow style fields to overwrite current meta
  if (isTextOnPathGeometryUpdate(normalized)) {
    normalized = stripStyleFieldsFromGeometryUpdate(normalized);
  }

  const anySel = sel as any;   

  const base = {
    ...(anySel.data?.options || {}),
    ...(anySel.sbPathMeta || {}),
  };

  const merged = { ...base, ...normalized };

  anySel.sbPathMeta = merged;
  anySel.data = anySel.data || { kind: 'text-on-path', version: 1, options: {} };
  anySel.data.options = merged;

  const needsRebuild = isTextOnPathGeometryUpdate(opts) || isTextOnPathGeometryUpdate(normalized);

  if (needsRebuild) {
    replaceTextOnPathGroup(anySel, merged);
    return;
  }

  applyTextOnPathStyleInPlace(anySel, merged);
  canvas?.requestRenderAll();
}



  function normalizeTextOnPathOpts(opts: any) {
  const out = { ...(opts || {}) };

  // Prefer explicit modern keys, but support legacy UI keys
  if (out.fill == null && out.fillColor != null) out.fill = out.fillColor;
  if (out.stroke == null && out.strokeColor != null) out.stroke = out.strokeColor;

  // Normalize preset naming: prefer the direct user selection
  if (out.preset != null) out.presetKey = out.preset;
  if (out.presetKey != null && typeof out.presetKey === 'string') {
    // keep as-is
  }

  // If you ever receive bold/italic booleans, normalize to Fabric props
  if (out.bold != null && out.fontWeight == null) out.fontWeight = out.bold ? 'bold' : 'normal';
  if (out.italic != null && out.fontStyle == null) out.fontStyle = out.italic ? 'italic' : 'normal';

  return out;
}


  // Otherwise: style-only changes can be applied in-place to glyph children
  function applyTextOnPathStyleInPlace(group: any, meta: any) {
  const glyphs = group._objects?.slice(1) || [];

  for (const g of glyphs) {
    if (!g || g.type !== 'text') continue;

    // Preserve gradients: if meta.fill is a descriptor, rebuild gradient spanning the group
    if (meta.fill && meta.fill.colorStops) {
      applyGradientToTextOnPathGroup(group, meta.fill);
    } else if (meta.fill != null) {
      g.set('fill', meta.fill);
    }
    if (meta.opacity != null) g.set('opacity', meta.opacity);

    if (meta.fontFamily != null) g.set('fontFamily', meta.fontFamily);
    if (meta.fontSize != null) g.set('fontSize', meta.fontSize);
    if (meta.fontWeight != null) g.set('fontWeight', meta.fontWeight);
    if (meta.fontStyle != null) g.set('fontStyle', meta.fontStyle);

    if (meta.stroke != null) g.set('stroke', meta.stroke);
    if (meta.strokeWidth != null) g.set('strokeWidth', meta.strokeWidth);

    // CRITICAL: mark child dirty for cached rendering
    g.dirty = true;
  }
console.log('glyph[0] fill after:', group._objects?.[1]?.fill);
  // CRITICAL: mark group dirty too
  group.dirty = true;

  group.setCoords();
}



// After JSON load:
function loadCanvasFromJson(json) {
  canvas.loadFromJSON(json, () => {
    // Optional pass to harden sub-object flags
    canvas.getObjects().forEach(obj => rehydrateTextOnPath(obj));
    canvas.renderAll();
  });
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









  function syncStyleStateFromObject(obj: any) {
    if (!obj) return;
  }

  function replaceTextOnPathGroup(oldGroup: any, meta: any) {
  if (!canvas) return;

  // Preserve transform + group-level styling
  const preserved = {
    left: oldGroup.left,
    top: oldGroup.top,
    angle: oldGroup.angle,
    scaleX: oldGroup.scaleX,
    scaleY: oldGroup.scaleY,
    skewX: oldGroup.skewX,
    skewY: oldGroup.skewY,
    flipX: oldGroup.flipX,
    flipY: oldGroup.flipY,
    opacity: oldGroup.opacity,
    shadow: oldGroup.shadow, // keep drop shadow across rebuilds
    selectable: oldGroup.selectable,
    evented: oldGroup.evented,
  };

  const idx = canvas.getObjects().indexOf(oldGroup);

  // Build a fresh group using your existing builder
  const next = createTextOnPath(meta) as any;

  // Safety: ensure we are not inserting non-Fabric children
  const bad = (next?._objects || []).filter((o: any) => !o || typeof o._set !== 'function');
  if (bad.length) {
    console.error('[TextOnPath] replace aborted: invalid children in rebuilt group', bad);
    return;
  }

  // Keep metadata conventions intact
  next.sbPathMeta = meta;
  next.data = next.data || { kind: 'text-on-path', version: 1, options: {} };
  next.data.kind = 'text-on-path';
  next.data.version = next.data.version ?? 1;
  next.data.options = meta;

  // Apply preserved transforms/styles
  next.set(preserved);
  next.setCoords();

  // Re-apply gradient fill if present in meta
  if (meta?.fill?.colorStops) {
    const glyphs = next._objects?.slice(1) || [];
    if (glyphs.length) {
      const union = glyphs.reduce(
        (acc: any, glyph: any) => {
          const b = glyph.getBoundingRect?.(true, true) || { left: 0, top: 0, width: 0, height: 0 };
          const right = b.left + b.width;
          const bottom = b.top + b.height;
          return {
            left: Math.min(acc.left, b.left),
            top: Math.min(acc.top, b.top),
            right: Math.max(acc.right, right),
            bottom: Math.max(acc.bottom, bottom),
          };
        },
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
      );
      const unionWidth = Math.max(1, union.right - union.left);
      const unionHeight = Math.max(1, union.bottom - union.top);

      glyphs.forEach((glyph: any) => {
        const b = glyph.getBoundingRect?.(true, true) || { left: 0, top: 0, width: unionWidth, height: unionHeight };
        const dx = b.left - union.left;
        const dy = b.top - union.top;

        let coords: any;
        switch (meta.fill.direction) {
          case 'vertical':
            coords = { x1: 0 - dx, y1: 0 - dy, x2: 0 - dx, y2: unionHeight - dy };
            break;
          case 'diagonal':
            coords = { x1: 0 - dx, y1: 0 - dy, x2: unionWidth - dx, y2: unionHeight - dy };
            break;
          case 'horizontal':
          default:
            coords = { x1: 0 - dx, y1: 0 - dy, x2: unionWidth - dx, y2: 0 - dy };
            break;
        }

        const grad = new fabric.Gradient({
          type: 'linear',
          gradientUnits: 'pixels',
          coords,
          colorStops: (meta.fill.colorStops || []).map((cs: any) => ({
            offset: Number(cs.offset),
            color: String(cs.color),
          })),
        });

        glyph.set('fill', grad);
        glyph.dirty = true;
      });

      next.dirty = true;
    }
  }

  // Replace in canvas (safe across Fabric versions)
  canvas.remove(oldGroup);
  canvas.add(next);

  // Restore z-index if possible
  if (typeof (canvas as any).moveTo === 'function' && idx >= 0) {
    (canvas as any).moveTo(next, idx);
  }

  canvas.setActiveObject(next);
  canvas.requestRenderAll();

  // Keep selection state/panel synced
  updateSelectedObject();
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
