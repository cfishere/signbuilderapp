<template>
  <div class="transition-all duration-300">
    <h2 class="text-lg font-bold mb-4">Design Tools</h2>

    <!-- existing tools -->
    <button class="btn" @click="$emit('add-text')">Text</button>
    <button class="btn" @click="$emit('add-curved-text')" title="Curved Text">
      Curved Text
    </button>
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
  snapToGrid: boolean
  gridVisible?: boolean
  hasSelection: boolean
}>()


const emit = defineEmits([
  'add-text','add-curved-text','add-rectangle','add-circle','upload-image','bring-to-front','send-to-back',
  'delete-selected','align-left','align-center','align-right','align-top','align-middle',
  'align-bottom','group','ungroup','toggle-snap','file-upload','toggle-grid','fonts' 
])


</script>

<style scoped>
.btn {
  @apply px-3 py-2 border rounded-lg text-sm whitespace-nowrap md:w-auto w-full inline-flex items-center justify-center;
}
</style>
