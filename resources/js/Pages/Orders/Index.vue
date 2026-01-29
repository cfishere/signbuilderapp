<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';

const page = usePage();
const orders = computed(() => page.props.orders);
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
