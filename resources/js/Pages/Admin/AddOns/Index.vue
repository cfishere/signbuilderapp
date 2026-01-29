<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Add-On Products</h1>
          <p class="text-sm text-slate-600">Read-only catalog seeded from the current pricing rules.</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-3">Product</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Sign Types</th>
              <th class="px-4 py-3">Pricing Rule</th>
              <th class="px-4 py-3">Options</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="product in products" :key="product.id" class="align-top">
              <td class="px-4 py-3">
                <div class="font-semibold text-slate-900">{{ product.name }}</div>
                <div class="mt-1 text-xs text-slate-500">{{ product.description }}</div>
                <div class="mt-2 text-xs text-slate-500">
                  <span class="font-semibold">Unit:</span> {{ product.unit_type }}
                  <span v-if="product.length_min" class="ml-2">
                    {{ product.length_min }}-{{ product.length_max }} {{ product.length_unit || 'ft' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ product.category || '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="type in product.sign_types"
                    :key="type"
                    class="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
                  >
                    {{ type }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-slate-600">
                <pre class="whitespace-pre-wrap rounded bg-slate-50 p-2">{{ formatJson(product.pricing) }}</pre>
              </td>
              <td class="px-4 py-3 text-xs text-slate-600">
                <pre class="whitespace-pre-wrap rounded bg-slate-50 p-2">{{ formatJson(product.options) }}</pre>
              </td>
            </tr>
            <tr v-if="!products.length">
              <td colspan="5" class="px-4 py-6 text-center text-sm text-slate-500">
                No add-on products found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});

const formatJson = (value) => {
  if (!value) return '—';
  return JSON.stringify(value, null, 2);
};
</script>
