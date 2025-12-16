<template>
  <div class="transition-all duration-300">
    <h2 class="text-lg font-bold mb-4">Design Tools</h2>

    <!-- existing tools -->
   
  <button
    type="button"
    class="btn mx-2 my-1"
    :disabled="!canUndo"
    @click="$emit('undo')"
  >
    ⟲ Undo
  </button>

  <button
    type="button"
    class="btn mx-2 my-1"
    :disabled="!canRedo"
    @click="$emit('redo')"
  >
    ⟳ Redo
  </button>
    <button class="btn mx-2 my-1" @click="$emit('add-text')">Text</button>
    <button class="btn mx-2 my-1" @click="$emit('add-curved-text')" title="Curved Text">
      Curved Text
    </button>
    <button class="btn mx-2 my-1" @click="$emit('add-rectangle')">Add Rectangle</button>
    <button class="btn mx-2 my-1" @click="$emit('add-circle')">Add Circle</button>
    <!-- Click & Drag Line Tool -->
    <button type="button" class="btn mx-2 my-1" @click="emit('start-line-tool')">
      Click &amp; Drag Line
    </button>
    <button class="btn mx-2 my-1" @click="$emit('upload-image')">Upload Image</button>
    <button class="btn mx-2 my-1" @click="$emit('bring-to-front')">Bring to Front</button>
    <button class="btn mx-2 my-1" @click="$emit('send-to-back')">Send to Back</button>
    <button class="btn mx-2 my-1" @click="$emit('delete-selected')">Delete Selected</button>
    <button class="btn mx-2 my-1" @click="$emit('align-left')">Align Left</button>
    <button class="btn mx-2 my-1" @click="$emit('align-center')">Align Center</button>
    <button class="btn mx-2 my-1" @click="$emit('align-right')">Align Right</button>
    <button class="btn mx-2 my-1" @click="$emit('align-top')">Align Top</button>
    <button class="btn mx-2 my-1" @click="$emit('align-middle')">Align Middle</button>
    <button class="btn mx-2 my-1" @click="$emit('align-bottom')">Align Bottom</button>
    <button class="btn mx-2 my-1" @click="$emit('group')">Group</button>
    <button class="btn mx-2 my-1" @click="$emit('ungroup')">Ungroup</button>


<!-- ===== [CurvedText] Panel END ===== -->
  <div>
    <span class="mx-2 my-1 inline-block">    
    <input
      type="checkbox"
      :checked="snapToGrid"
      @change="$emit('toggle-snap', !snapToGrid)"
    />
    <label class="inline-block mx-2 text-sm">Snap to Grid</label>
  </span>

    <!-- NEW: Show Grid -->
    <span class="mx-2 my-1 inline-block">   
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
  import { reactive, watch } from 'vue'
  //ensure alignment tools reset Fabric's active object overlay (bounding boxes can get stranded to the prior location)
  import { alignLeft, alignRight, alignCenterX, alignTop, alignBottom, alignMiddleY } from '@/utils/align';

type FontOpt = { family: string } | string

const props = defineProps<{  
  canUndo: boolean
  canRedo: boolean
  snapToGrid: boolean
  gridVisible?: boolean
  hasSelection: boolean
}>()

const emit = defineEmits([
  'add-text','add-curved-text','add-rectangle','add-circle','upload-image','bring-to-front','send-to-back',
  'delete-selected','align-left','align-center','align-right','align-top','align-middle',
  'align-bottom','group','ungroup','toggle-snap','file-upload','toggle-grid','fonts','start-line-tool','undo','redo'
])

</script>

<style scoped>
.btn {
  @apply px-3 py-2 border rounded-lg text-sm whitespace-nowrap md:w-auto w-full inline-flex items-center justify-center;
}
</style>
