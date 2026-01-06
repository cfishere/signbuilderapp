<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import axios from 'axios';

const page = usePage();
const order = ref(page.props.order);
const form = ref({
  customer_name: order.value.customer_name || '',
  address_line1: order.value.address_line1 || '',
  address_line2: order.value.address_line2 || '',
  city: order.value.city || '',
  region: order.value.region || '',
  postal_code: order.value.postal_code || '',
  country: order.value.country || 'US',
});
const errors = ref<Record<string, string>>({});
const isSaving = ref(false);
const statusMessage = ref('');

async function submitCustomerInfo() {
  if (!order.value?.id) return;
  errors.value = {};
  statusMessage.value = '';
  isSaving.value = true;

  try {
    const { data } = await axios.put(`/api/orders/${order.value.id}`, {
      ...form.value,
      status: 'submitted',
    });
    order.value = { ...order.value, ...data };
    statusMessage.value = 'Customer details saved.';
  } catch (err: any) {
    const serverErrors = err?.response?.data?.errors;
    if (serverErrors) {
      const flat: Record<string, string> = {};
      Object.keys(serverErrors).forEach((key) => {
        flat[key] = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : String(serverErrors[key]);
      });
      errors.value = flat;
    } else {
      statusMessage.value = 'Unable to save customer details.';
    }
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-xs uppercase tracking-wide text-gray-500">Order</div>
          <h1 class="text-2xl font-semibold">
            {{ order.order_number || `Order #${order.id}` }}
          </h1>
        </div>
        <Link
          href="/orders"
          class="inline-flex items-center rounded-md border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Back to Orders
        </Link>
      </div>

      <div class="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div class="rounded-lg border bg-white/80 p-4">
          <div class="text-sm font-semibold mb-2">Preview</div>
          <div
            v-if="order.preview_image_url"
            class="rounded border bg-white p-2"
          >
            <img
              :src="order.preview_image_url"
              alt="Order preview"
              class="w-full h-auto rounded"
            />
          </div>
          <div v-else class="text-xs text-gray-500">
            No preview image saved yet.
          </div>
        </div>

        <div class="rounded-lg border bg-white/80 p-4">
          <div class="text-sm font-semibold mb-3">Details</div>
          <form class="text-sm text-gray-700 space-y-3" @submit.prevent="submitCustomerInfo">
            <div>
              <label class="text-xs uppercase text-gray-400">Customer Name</label>
              <input
                v-model="form.customer_name"
                type="text"
                class="mt-1 w-full rounded border px-2 py-1 text-sm"
                required
              />
              <div v-if="errors.customer_name" class="text-xs text-red-600">{{ errors.customer_name }}</div>
            </div>
            <div>
              <label class="text-xs uppercase text-gray-400">Address Line 1</label>
              <input
                v-model="form.address_line1"
                type="text"
                class="mt-1 w-full rounded border px-2 py-1 text-sm"
                required
              />
              <div v-if="errors.address_line1" class="text-xs text-red-600">{{ errors.address_line1 }}</div>
            </div>
            <div>
              <label class="text-xs uppercase text-gray-400">Address Line 2</label>
              <input
                v-model="form.address_line2"
                type="text"
                class="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs uppercase text-gray-400">City</label>
                <input
                  v-model="form.city"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm"
                  required
                />
                <div v-if="errors.city" class="text-xs text-red-600">{{ errors.city }}</div>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Region</label>
                <input
                  v-model="form.region"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm"
                  required
                />
                <div v-if="errors.region" class="text-xs text-red-600">{{ errors.region }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs uppercase text-gray-400">Postal Code</label>
                <input
                  v-model="form.postal_code"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm"
                  required
                />
                <div v-if="errors.postal_code" class="text-xs text-red-600">{{ errors.postal_code }}</div>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Country</label>
                <input
                  v-model="form.country"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm"
                />
              </div>
            </div>
            <div>
              <span class="text-xs uppercase text-gray-400">Status</span>
              <div>{{ order.status || 'draft' }}</div>
            </div>
            <div>
              <span class="text-xs uppercase text-gray-400">Submitted</span>
              <div>{{ order.submitted_at || '-' }}</div>
            </div>
            <div>
              <span class="text-xs uppercase text-gray-400">Last Updated</span>
              <div>{{ order.updated_at || '-' }}</div>
            </div>
            <div>
              <span class="text-xs uppercase text-gray-400">Notes</span>
              <div class="whitespace-pre-line">{{ order.notes || '-' }}</div>
            </div>
            <div class="flex items-center gap-2 pt-2">
              <button
                type="submit"
                class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Submit Customer Info' }}
              </button>
              <span v-if="statusMessage" class="text-xs text-gray-500">{{ statusMessage }}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
