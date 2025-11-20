<!-- resources/js/Components/CanvasEditor.vue -->
<template>
  <div class="w-full min-h-screen bg-white">
    <!-- ROW 1 -->
    <header class="max-w-[1400px] mx-auto px-4">
      <div class="grid grid-cols-12 gap-4 pt-6">
        <div class="col-span-12 lg:col-span-3"></div>
        <h1 class="col-span-12 lg:col-span-9 text-center text-2xl sm:text-3xl font-semibold">
          Sign Face ({{ heightIn }} x {{ widthIn }} inches)
        </h1>
      </div>
    </header>

    <!-- ROW 2 -->
    <main class="max-w-[1400px] mx-auto px-4">
      <div class="grid grid-cols-12 gap-6 py-6">
        <!-- LEFT -->
        <aside class="col-span-12 lg:col-span-3 space-y-6">
          <section class="border rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-center">
              <img :src="thumbnailSrc" alt="Sign type thumbnail" class="h-20 object-contain" />
            </div>
            <!-- Use titleText directly -->
            <h2 class="mt-4 text-center font-semibold">{{ titleText }}</h2>

            <dl class="mt-4 text-sm leading-6">
              <div class="flex justify-between"><dt class="text-gray-500">Style</dt><dd class="font-medium">{{ product.style }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Material</dt><dd class="font-medium">{{ product.material }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Zip Code</dt><dd class="font-medium">{{ product.zip }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Name</dt><dd class="font-medium">{{ product.name }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Illuminated</dt><dd class="font-medium">{{ product.illuminated ? 'Yes' : 'No' }}</dd></div>
              <div class="flex justify-between" v-if="product.postHeight"><dt class="text-gray-500">Post</dt><dd class="font-medium">{{ product.postHeight }} inches</dd></div>
            </dl>

            <div class="mt-6 text-2xl font-bold text-center">{{ formattedPrice }}</div>
          </section>

          <section class="border rounded-xl p-4 shadow-sm">
            <template v-if="isAuthenticated">
              <h3 class="font-semibold mb-2">Your Designs</h3>
              <button class="w-full border rounded-lg px-3 py-2 hover:bg-gray-50" @click="$emit('open-design-panel')">
                Open Design Panel
              </button>
            </template>
            <template v-else>
              <p class="text-sm text-gray-600 mb-3">Please log in or create an account to save and edit designs.</p>
              <div class="flex gap-3">
                <router-link to="/login" class="flex-1 border rounded-lg px-3 py-2 text-center hover:bg-gray-50">Login</router-link>
                <router-link to="/register" class="flex-1 border rounded-lg px-3 py-2 text-center hover:bg-gray-50">Register</router-link>
              </div>
            </template>
          </section>
        </aside>

        <!-- CANVAS -->
        <section class="col-span-12 lg:col-span-9 border rounded-xl shadow-sm p-3 relative">
          <div ref="stage" class="relative bg-white border rounded-lg" :style="stageStyle">
            <div class="absolute inset-0 pointer-events-none" :style="safeAreaStyle"></div>
            <canvas ref="canvasEl" class="w-full h-full block"></canvas>
          </div>
        </section>
      </div>
    </main>

    <!-- ROW 3 -->
    <footer class="max-w-[1400px] mx-auto px-4 pb-10">
      <div class="grid grid-cols-12">
        <div class="col-span-12 lg:col-start-4 lg:col-span-9">
          <div class="flex flex-wrap items-center justify-center gap-3 border rounded-xl p-3">
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Text</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Image</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Shapes</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Align</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Layers</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Undo</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Redo</button>
            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50">Save</button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  signType: { type: String, required: true },
  widthIn: { type: Number, required: true },
  heightIn: { type: Number, required: true },
  isAuthenticated: { type: Boolean, default: false },
  price: { type: Number, default: 4200 },
  product: { type: Object, required: true },
  titleText: { type: String, required: true },   // <-- NEW
  designData: { type: Object, default: null },   // optional: saved JSON if present
  testMode: { type: Boolean, default: false },
})

// Thumbnail can still be signType‑based
const thumbnailSrc = computed(() => {
  const map = {
    pylon_illuminated_cabinet: '/images/thumbs/pylon.png',
    wall_cabinet: '/images/thumbs/wall-cabinet.png',
    monument: '/images/thumbs/monument.png',
  }
  return map[props.signType] ?? '/images/thumbs/placeholder.png'
})

const formattedPrice = computed(() =>
  props.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
)

const stage = ref(null)
const canvasEl = ref(null)
const stageStyle = computed(() => ({ width: '100%', height: '640px', position: 'relative' }))
const safeAreaStyle = computed(() => ({ border: '3px dashed #ef4444', borderRadius: '0.5rem', top: '8%', left: '8%', right: '8%', bottom: '8%' }))

onMounted(() => {
  if (props.testMode || typeof window === 'undefined' || !window.fabric) return
  const canvas = new window.fabric.Canvas(canvasEl.value, { selection: true, preserveObjectStacking: true })

  // If a saved design JSON was provided, load it; else draw fresh cabinet
  if (props.designData?.canvas_json) {
    try {
      canvas.loadFromJSON(props.designData.canvas_json, canvas.requestRenderAll.bind(canvas))
    } catch (e) {
      console.warn('Failed to load saved canvas JSON:', e)
    }
  } else {
    const scale = 6
    const w = Math.max(50, props.widthIn * scale)
    const h = Math.max(50, props.heightIn * scale)
    canvas.add(new window.fabric.Rect({ left: 30, top: 30, width: w, height: h, rx: 8, ry: 8, fill: '#fff', stroke: '#60a5fa', strokeWidth: 2, selectable: false }))
  }

  const resize = () => {
    const el = stage.value
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    canvas.setWidth(width)
    canvas.setHeight(height)
    canvas.requestRenderAll()
  }
  resize()
  window.addEventListener('resize', resize)
})
</script>

<style scoped>
canvas { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
</style>
