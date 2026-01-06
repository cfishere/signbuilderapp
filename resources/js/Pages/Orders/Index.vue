<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();
const orders = computed(() => page.props.orders);
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
                <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  {{ order.status || 'draft' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <img
                  v-if="order.preview_image_url"
                  :src="order.preview_image_url"
                  alt="Order preview"
                  class="h-12 w-auto rounded border"
                />
                <span v-else class="text-xs text-gray-400">None</span>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500">
                {{ order.updated_at || '-' }}
              </td>
              <td class="px-3 py-2 text-right">
                <Link
                  :href="`/orders/${order.id}`"
                  class="inline-flex items-center rounded-md border border-emerald-600 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  View
                </Link>
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
  </AppLayout>
</template>
