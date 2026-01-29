<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { fabric } from '@/utils/fabricRef';
import { rehydrateTextOnPath } from '@/utils/textOnPath';
import { ensureFontLoaded } from '@/utils/fontLoader';
import { FONT_CATALOG } from '@/utils/fonts';

const page = usePage();
const orders = computed(() => page.props.orders);
const isAdmin = computed(() => !!page.props.auth?.user?.is_admin);

const printState = reactive<{
  loading: Record<number, boolean>;
  error: Record<number, string>;
  url: Record<number, string>;
}>({
  loading: {},
  error: {},
  url: {},
});

const previewModal = reactive<{
  open: boolean;
  src: string;
  label: string;
}>({
  open: false,
  src: '',
  label: '',
});
const previewZoom = ref(1);
const PREVIEW_ZOOM_MIN = 0.5;
const PREVIEW_ZOOM_MAX = 3;
const PREVIEW_ZOOM_STEP = 0.25;

function openPreviewModal(order: any) {
  if (!order?.preview_image_url) return;
  previewModal.open = true;
  previewModal.src = order.preview_image_url;
  previewModal.label = order.order_number || `Order #${order.id}`;
  previewZoom.value = 1;
}

function closePreviewModal() {
  previewModal.open = false;
  previewModal.src = '';
  previewModal.label = '';
  previewZoom.value = 1;
}

function zoomInPreview() {
  previewZoom.value = Math.min(PREVIEW_ZOOM_MAX, +(previewZoom.value + PREVIEW_ZOOM_STEP).toFixed(2));
}

function zoomOutPreview() {
  previewZoom.value = Math.max(PREVIEW_ZOOM_MIN, +(previewZoom.value - PREVIEW_ZOOM_STEP).toFixed(2));
}

function resetPreviewZoom() {
  previewZoom.value = 1;
}

function handleKeydown(e: KeyboardEvent) {
  if (!previewModal.open) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closePreviewModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

async function loadFontsForCanvasObjects(objects: any[]) {
  const fontFamilies = new Set<string>();
  objects.forEach((obj) => {
    if (obj?.fontFamily) fontFamilies.add(String(obj.fontFamily));
    if (Array.isArray(obj?._objects)) {
      obj._objects.forEach((child: any) => {
        if (child?.fontFamily) fontFamilies.add(String(child.fontFamily));
      });
    }
  });

  const tasks: Promise<void>[] = [];
  fontFamilies.forEach((family) => {
    const entry = FONT_CATALOG.find(f => f.family === family);
    if (entry) {
      tasks.push(ensureFontLoaded(entry));
    }
  });
  if (tasks.length) {
    await Promise.all(tasks);
  }
}

async function generatePrintImage(order: any) {
  if (!order?.design_id) {
    printState.error[order.id] = 'Missing design for this order.';
    return;
  }

  printState.loading[order.id] = true;
  printState.error[order.id] = '';

  try {
    const { data: design } = await axios.get(`/api/designs/${order.design_id}`);

    const widthIn = Number(design.sign_width);
    const heightIn = Number(design.sign_height);
    if (!Number.isFinite(widthIn) || !Number.isFinite(heightIn)) {
      throw new Error('Missing design dimensions.');
    }

    const ppi = 300;
    const widthPx = Math.max(1, Math.round(widthIn * ppi));
    const heightPx = Math.max(1, Math.round(heightIn * ppi));

    const canvasEl = document.createElement('canvas');
    canvasEl.width = widthPx;
    canvasEl.height = heightPx;

    const c = new fabric.StaticCanvas(canvasEl, {
      backgroundColor: design.background_color || '#ffffff',
      enableRetinaScaling: false,
      renderOnAddRemove: false,
    });

    const loadResult = c.loadFromJSON(design.canvas_state);
    if (loadResult && typeof (loadResult as Promise<any>).then === 'function') {
      await loadResult;
    }

    const objects = c.getObjects();
    objects.forEach((obj: any) => {
      if (obj?.isGrid || obj?.name === 'grid' || obj?.isFaceRetainer || obj?.name === 'face-retainer') {
        obj.visible = false;
      }
      if (obj?.data?.kind === 'text-on-path') {
        rehydrateTextOnPath(obj);
      }
    });

    const baseW = Number(design.canvas_width) || widthPx;
    const baseH = Number(design.canvas_height) || heightPx;
    const scaleX = widthPx / baseW;
    const scaleY = heightPx / baseH;

    if (Number.isFinite(scaleX) && Number.isFinite(scaleY)) {
      objects.forEach((obj: any) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords?.();
      });
    }

    await loadFontsForCanvasObjects(objects);

    c.renderAll();

    const dataUrl = c.toDataURL({
      format: 'png',
      multiplier: 1,
    });

    const { data } = await axios.post(`/api/orders/${order.id}/jobs/print-image`, {
      print_image_data: dataUrl,
      print_image_ppi: 300,
      print_image_width: widthPx,
      print_image_height: heightPx,
    });

    printState.url[order.id] = data.print_image_url;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Unable to generate print image.';
    printState.error[order.id] = message;
  } finally {
    printState.loading[order.id] = false;
  }
}
</script>

<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold">Orders</h1>
        <Link
          href="/canvas"
          class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700"
        >
          New Order
        </Link>
      </div>

      <div v-if="!orders.data.length" class="text-sm text-gray-500">
        You do not have any orders yet.
      </div>

      <div v-else class="overflow-x-auto border rounded-lg bg-white/80">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-3 py-2 text-left">Order</th>
              <th class="px-3 py-2 text-left">Delivery</th>
              <th class="px-3 py-2 text-left">Status</th>
              <th class="px-3 py-2 text-left">Preview</th>
              <th class="px-3 py-2 text-left">Updated</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders.data"
              :key="order.id"
              class="border-t last:border-b bg-white/60"
            >
              <td class="px-3 py-2 font-medium">
                {{ order.order_number || `Order #${order.id}` }}
              </td>
              <td class="px-3 py-2">
                {{ order.delivery_method || '-' }}
              </td>
              <td class="px-3 py-2">
                <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  {{ order.status || 'unpaid' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <button
                  v-if="order.preview_image_url"
                  type="button"
                  class="group"
                  @click="openPreviewModal(order)"
                >
                  <img
                    :src="order.preview_image_url"
                    :alt="order.order_number || `Order #${order.id}`"
                    class="h-12 w-auto rounded border transition group-hover:opacity-90"
                  />
                </button>
                <span v-else class="text-xs text-gray-400">None</span>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500">
                {{ order.updated_at || '-' }}
              </td>
              <td class="px-3 py-2 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Link
                    :href="`/orders/${order.id}`"
                    class="inline-flex items-center rounded-md border border-emerald-600 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    View
                  </Link>
                  <button
                    v-if="isAdmin"
                    type="button"
                    class="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                    :disabled="printState.loading[order.id]"
                    @click="generatePrintImage(order)"
                  >
                    {{ printState.loading[order.id] ? 'Generating…' : 'Generate Hi-Res' }}
                  </button>
                </div>
                <div v-if="isAdmin && (printState.error[order.id] || order.print_image_url || printState.url[order.id])" class="mt-1 text-[11px] text-gray-500">
                  <span v-if="printState.error[order.id]" class="text-red-600">{{ printState.error[order.id] }}</span>
                  <span v-else>
                    <a
                      :href="printState.url[order.id] || order.print_image_url"
                      class="underline"
                      target="_blank"
                      rel="noopener"
                    >
                      Download
                    </a>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="orders.links && orders.links.length > 3"
        class="mt-4 flex justify-between items-center text-xs text-gray-600"
      >
        <div>
          Page {{ orders.current_page }} of {{ orders.last_page }}
        </div>
        <div class="space-x-1">
          <Link
            v-for="link in orders.links"
            :key="link.label"
            :href="link.url || '#'"
            class="px-2 py-1 rounded border"
            :class="[
              link.active
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
            v-html="link.label"
            preserve-scroll
          />
        </div>
      </div>
    </div>

    <div
      v-if="previewModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Order preview"
      @click.self="closePreviewModal"
    >
      <div class="relative w-full max-w-3xl">
        <button
          type="button"
          class="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white text-gray-700 shadow"
          aria-label="Close preview"
          @click="closePreviewModal"
        >
          ✕
        </button>
        <div class="rounded-lg bg-white p-3">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-gray-500">{{ previewModal.label }}</div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <button
                type="button"
                class="rounded border px-2 py-1 hover:bg-gray-50"
                @click="zoomOutPreview"
                :disabled="previewZoom <= PREVIEW_ZOOM_MIN"
              >
                −
              </button>
              <button
                type="button"
                class="rounded border px-2 py-1 hover:bg-gray-50"
                @click="resetPreviewZoom"
              >
                100%
              </button>
              <button
                type="button"
                class="rounded border px-2 py-1 hover:bg-gray-50"
                @click="zoomInPreview"
                :disabled="previewZoom >= PREVIEW_ZOOM_MAX"
              >
                +
              </button>
            </div>
          </div>
          <div class="max-h-[70vh] overflow-auto">
            <img
              :src="previewModal.src"
              alt="Order preview"
              class="w-full object-contain"
              :style="{ transform: `scale(${previewZoom})`, transformOrigin: 'top center' }"
            />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
