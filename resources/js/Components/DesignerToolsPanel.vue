<template>

<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <!-- Base style conventions:
       viewBox 0 0 24 24
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round"
  -->

  <!-- Add Shape -->
  <symbol id="i-add-shape" viewBox="0 0 24 24">
    <rect x="4" y="5" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M17 11h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M19.5 8v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Align: Object -->
  <symbol id="i-align-object" viewBox="0 0 24 24">
    <path d="M5 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="8" y="7" width="11" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="8" y="13" width="8" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Left -->
  <symbol id="i-align-left" viewBox="0 0 24 24">
    <path d="M5 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="8" y="7" width="10" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="8" y="13" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Center (horizontal) -->
  <symbol id="i-align-center" viewBox="0 0 24 24">
    <path d="M12 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="7" y="7" width="10" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="8.5" y="13" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Right -->
  <symbol id="i-align-right" viewBox="0 0 24 24">
    <path d="M19 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="6" y="7" width="10" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="9" y="13" width="7" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Top -->
  <symbol id="i-align-top" viewBox="0 0 24 24">
    <path d="M4 5h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="7" y="8" width="4" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="13" y="8" width="4" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Middle (vertical) -->
  <symbol id="i-align-middle" viewBox="0 0 24 24">
    <path d="M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="7" y="7" width="4" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="13" y="8.5" width="4" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Align: Bottom -->
  <symbol id="i-align-bottom" viewBox="0 0 24 24">
    <path d="M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="7" y="6" width="4" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="13" y="9" width="4" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Delete -->
  <symbol id="i-delete" viewBox="0 0 24 24">
    <path d="M7 7l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M17 7L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Copy -->
  <symbol id="i-copy" viewBox="0 0 24 24">
    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Paste -->
  <symbol id="i-paste" viewBox="0 0 24 24">
    <rect x="4" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/>
  </symbol>

  <!-- Add Text -->
  <symbol id="i-add-text" viewBox="0 0 24 24">
    <path d="M7 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 6v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M19 14h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M17 12v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Add Curved Text (text on a path) -->
  <symbol id="i-add-curved-text" viewBox="0 0 24 24">
    <path d="M4 17c3-4 13-4 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 6v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Edit Stroke -->
  <symbol id="i-edit-stroke" viewBox="0 0 24 24">
    <path d="M4 17h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M14 6l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 8l-2 6 6-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>

  <!-- Undo -->
  <symbol id="i-undo" viewBox="0 0 24 24">
    <path d="M9 7H5v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 11c2-3 5-5 9-5 4.5 0 8 3.2 8 7.5S18.5 21 14 21c-2.2 0-4.2-.7-5.8-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Redo -->
  <symbol id="i-redo" viewBox="0 0 24 24">
    <path d="M15 7h4v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 11c-2-3-5-5-9-5-4.5 0-8 3.2-8 7.5S5.5 21 10 21c2.2 0 4.2-.7 5.8-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Group -->
  <symbol id="i-group" viewBox="0 0 24 24">
    <rect x="5" y="6" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <rect x="13" y="12" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <path d="M12 9v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Ungroup -->
  <symbol id="i-ungroup" viewBox="0 0 24 24">
    <rect x="5" y="6" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <rect x="13" y="12" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <path d="M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Shapes: Rectangle -->
  <symbol id="i-shape-rect" viewBox="0 0 24 24">
    <rect x="5" y="7" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Shapes: Circle -->
  <symbol id="i-shape-circle" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
  </symbol>

  <!-- Shapes: Line -->
  <symbol id="i-shape-line" viewBox="0 0 24 24">
    <path d="M5 19L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </symbol>

  <!-- Upload Image -->
  <symbol id="i-upload-image" viewBox="0 0 24 24">
    <rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <circle cx="9" cy="11" r="1.5" stroke="currentColor" stroke-width="2"/>
    <path d="M4 17l4-4 3 3 3-3 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 3v4M9 6l3-3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>

  <!-- Bring to Front -->
  <symbol id="i-bring-front" viewBox="0 0 24 24">
    <rect x="5" y="9" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M12 4v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M9 7l3-3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>

  <!-- Send to Back -->
  <symbol id="i-send-back" viewBox="0 0 24 24">
    <rect x="5" y="5" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M12 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M9 17l3 3 3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</svg>










  <div ref="panelRoot" class="relative z-50 transition-all duration-300">
    <h2 class="mb-4 text-lg font-bold">Design Tools</h2>

    <div class="tool-grid">
      <button
        type="button"
        class="tool-btn"
        :disabled="!canUndo"
        title="Undo"
        aria-label="Undo"
        @click="$emit('undo')"
      >
        <svg class="tool-icon" aria-hidden="true"><use href="#i-undo" /></svg>
      </button>

      <button
        type="button"
        class="tool-btn"
        :disabled="!canRedo"
        title="Redo"
        aria-label="Redo"
        @click="$emit('redo')"
      >
        <svg class="tool-icon" aria-hidden="true"><use href="#i-redo" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Copy" aria-label="Copy" @click="$emit('copy')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-copy" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Paste" aria-label="Paste" @click="$emit('paste')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-paste" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Delete" aria-label="Delete" @click="$emit('delete-selected')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-delete" /></svg>
      </button>

      <details class="tool-menu">
        <summary class="tool-btn" title="Add Shape" aria-label="Add Shape">
          <svg class="tool-icon" aria-hidden="true"><use href="#i-add-shape" /></svg>
        </summary>
        <div class="tool-menu-panel">
          <button type="button" class="tool-btn" title="Rectangle" aria-label="Rectangle" @click="emitAndClose($event, 'add-rectangle')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-shape-rect" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Circle" aria-label="Circle" @click="emitAndClose($event, 'add-circle')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-shape-circle" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Line" aria-label="Line" @click="emitAndClose($event, 'start-line-tool')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-shape-line" /></svg>
          </button>
        </div>
      </details>

      <button type="button" class="tool-btn" title="Add Text" aria-label="Add Text" @click="$emit('add-text')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-add-text" /></svg>
      </button>

      <button
        type="button"
        class="tool-btn"
        title="Add Curved Text"
        aria-label="Add Curved Text"
        @click="$emit('add-curved-text')"
      >
        <svg class="tool-icon" aria-hidden="true"><use href="#i-add-curved-text" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Upload Image" aria-label="Upload Image" @click="$emit('upload-image')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-upload-image" /></svg>
      </button>

      <details class="tool-menu">
        <summary class="tool-btn" title="Align Object" aria-label="Align Object">
          <svg class="tool-icon" aria-hidden="true"><use href="#i-align-object" /></svg>
        </summary>
        <div class="tool-menu-panel">
          <button type="button" class="tool-btn" title="Align Left" aria-label="Align Left" @click="emitAndClose($event, 'align-left')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-left" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Align Center" aria-label="Align Center" @click="emitAndClose($event, 'align-center')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-center" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Align Right" aria-label="Align Right" @click="emitAndClose($event, 'align-right')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-right" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Align Top" aria-label="Align Top" @click="emitAndClose($event, 'align-top')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-top" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Align Middle" aria-label="Align Middle" @click="emitAndClose($event, 'align-middle')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-middle" /></svg>
          </button>
          <button type="button" class="tool-btn" title="Align Bottom" aria-label="Align Bottom" @click="emitAndClose($event, 'align-bottom')">
            <svg class="tool-icon" aria-hidden="true"><use href="#i-align-bottom" /></svg>
          </button>
        </div>
      </details>

      <button type="button" class="tool-btn" title="Bring to Front" aria-label="Bring to Front" @click="$emit('bring-to-front')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-bring-front" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Send to Back" aria-label="Send to Back" @click="$emit('send-to-back')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-send-back" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Group" aria-label="Group" @click="$emit('group')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-group" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Ungroup" aria-label="Ungroup" @click="$emit('ungroup')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-ungroup" /></svg>
      </button>

      <button type="button" class="tool-btn" title="Edit Stroke" aria-label="Edit Stroke" @click="$emit('edit-stroke')">
        <svg class="tool-icon" aria-hidden="true"><use href="#i-edit-stroke" /></svg>
      </button>
    </div>


<!-- ===== [CurvedText] Panel END ===== -->
  <div>
    <span class="inline-block mx-2 my-1">
    <input
      type="checkbox"
      :checked="snapToGrid"
      @change="$emit('toggle-snap', !snapToGrid)"
    />
    <label class="inline-block mx-2 text-sm">Snap to Grid</label>
  </span>

    <!-- NEW: Show Grid -->
    <span class="inline-block mx-2 my-1">
    <input
      type="checkbox"
      :checked="gridVisible"
      @change="$emit('toggle-grid', !gridVisible)"
    />
     <label class="inline-block mx-2 mb-1 text-sm">Show Grid</label>
  </span>
</div>
    <input type="file" ref="fileInput" class="hidden" @change="$emit('file-upload', $event)" accept="image/*" />
  </div>
</template>

<script setup lang="ts">
  import { createCurvedText, reflowCurvedText, applyStrokeToCurved } from '@/utils/curvedText';
  import { reactive, watch, ref, onMounted, onBeforeUnmount } from 'vue'
  //ensure alignment tools reset Fabric's active object overlay (bounding boxes can get stranded to the prior location)
  import { alignLeft, alignRight, alignCenterX, alignTop, alignBottom, alignMiddleY } from '@/utils/align';

type FontOpt = { family: string } | string

const props = defineProps<{
  canUndo: boolean
  canRedo: boolean
  snapToGrid: boolean
  gridVisible?: boolean
  hasSelection: boolean
  fonts?: FontOpt[]
}>()

const emit = defineEmits([
  'add-text','add-curved-text','add-rectangle','add-circle','upload-image','bring-to-front','send-to-back',
  'delete-selected','align-left','align-center','align-right','align-top','align-middle',
  'align-bottom','group','ungroup','toggle-snap','file-upload','toggle-grid','fonts','start-line-tool','undo','redo',
  'copy','paste','edit-stroke'
])

const fileInput = ref<HTMLInputElement | null>(null)
const panelRoot = ref<HTMLElement | null>(null)

function openFileDialog() {
  fileInput.value?.click()
}

function emitAndClose(event: Event, name: string) {
  emit(name)
  const target = event.currentTarget as HTMLElement | null
  const details = target?.closest('details')
  if (details) {
    details.removeAttribute('open')
  }
}

function closeOpenMenus() {
  panelRoot.value?.querySelectorAll('details[open]').forEach((el) => {
    el.removeAttribute('open')
  })
}

function handleClickAway(event: MouseEvent) {
  const root = panelRoot.value
  const target = event.target as Node | null
  if (!root || !target || root.contains(target)) return
  closeOpenMenus()
}

onMounted(() => {
  document.addEventListener('click', handleClickAway)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickAway)
})

defineExpose({ openFileDialog })

</script>

<style scoped>
.tool-grid {
  @apply flex flex-wrap gap-2;
}

.tool-btn {
  @apply inline-flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40;
}

.tool-icon {
  width: 1.625rem;
  height: 1.625rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tool-menu {
  @apply relative z-50;
}

.tool-menu-panel {
  @apply absolute z-50 mt-2 grid grid-cols-3 gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg;
  left: 0;
  box-sizing: border-box;
  grid-template-columns: repeat(3, 2.5rem);
  min-width: 9.5rem;
  overflow: visible;
}

.tool-menu > summary {
  list-style: none;
}

.tool-menu > summary::-webkit-details-marker {
  display: none;
}

</style>
