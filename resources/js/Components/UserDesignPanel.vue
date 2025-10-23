<template>
  <transition name="slide-left">
   <!--  <div
  v-if="showDrawer"
  class="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300"
> -->
    <div
      v-if="showDrawer"
      class="fixed top-0 left-0 h-full w-72 max-w-full bg-white border-r shadow-lg z-50 p-4 overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">My Designs</h2>
        <button @click="closeDrawer" class="text-gray-500 hover:text-black">&times;</button>
      </div>
      <ul v-if="designs.length">
        <li
          v-for="design in designs"
          :key="design.id"
          @click="selectDesign(design)"
          class="mb-2 cursor-pointer text-blue-600 hover:underline"
        >
          {{ design.title || 'Untitled Design #' + design.id }}
        </li>
      </ul>
      <p v-else class="text-gray-500">No saved designs.</p>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import axios from 'axios';

const props = defineProps({
  showDrawer: Boolean
});
const emits = defineEmits(['load-design', 'close']);

const designs = ref([]);

async function fetchDesigns() {

  console.log('🎯 inside fetchDesigns: starting axios.get');
  const res = await axios.get('/api/user/canvases');
  console.log('🎯 fetchDesigns received response:', res);
  if(res.data){
    designs.value = res.data;
  }
}

function selectDesign(design) {
  emits('load-design', design);
  emits('close');
}

function closeDrawer() {
  emits('close');
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeDrawer();
  }
}

function handleResize() {
  if (window.innerWidth < 640) {
    closeDrawer();
  }
}

onMounted(() => {
  fetchDesigns();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>

