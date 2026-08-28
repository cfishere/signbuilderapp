<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import axios from 'axios';

type AddOnProduct = {
  id: number;
  name: string;
  description: string | null;
  unit_price: number;
};

const props = defineProps<{
  order: {
    id: number;
    order_number: number | null;
    status: string | null;
    currency: string | null;
  };
  signType: string | null;
  baseTotal: number;
  products: AddOnProduct[];
  selectedProductIds: number[];
  selectedQuantities?: Record<number, number> | Record<string, number>;
  selectedMountTypes?: Record<number, string> | Record<string, string>;
}>();

const isSaving = ref(false);
const errorMessage = ref('');
const lineErrors = ref<Record<string, string>>({});

const currency = computed(() => props.order.currency || 'USD');

const quantities = ref<Record<number, number>>(
  props.products.reduce((acc, product) => {
    const fromMap = props.selectedQuantities?.[product.id] ?? props.selectedQuantities?.[String(product.id)] ?? 0;
    const fromIds = (props.selectedProductIds || []).includes(product.id) ? 1 : 0;
    const qty = Number(fromMap || fromIds);
    acc[product.id] = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0;
    return acc;
  }, {} as Record<number, number>)
);
const mountTypes = ref<Record<number, string>>(
  props.products.reduce((acc, product) => {
    const fromMap = props.selectedMountTypes?.[product.id] ?? props.selectedMountTypes?.[String(product.id)] ?? '';
    acc[product.id] = String(fromMap || 'ground_bolted');
    return acc;
  }, {} as Record<number, string>)
);

const selectedItems = computed(() => {
  return props.products
    .map((p) => ({
      ...p,
      quantity: Math.max(0, Number(quantities.value[p.id] || 0)),
      mount_type: mountTypes.value[p.id] || 'ground_bolted',
      billable_quantity:
        Math.max(0, Number(quantities.value[p.id] || 0)) +
        (isPoleProduct(p) && !isPoleMountingKit(p) && (mountTypes.value[p.id] || 'ground_bolted') === 'subgrade_footer' ? 3 : 0),
      line_total:
        (Math.max(0, Number(quantities.value[p.id] || 0)) +
          (isPoleProduct(p) && !isPoleMountingKit(p) && (mountTypes.value[p.id] || 'ground_bolted') === 'subgrade_footer' ? 3 : 0)) *
        Number(p.unit_price || 0),
    }))
    .filter((p) => p.quantity > 0);
});

const addOnTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + Number(item.line_total || 0), 0);
});

const grandTotal = computed(() => {
  return Number((Number(props.baseTotal || 0) + addOnTotal.value).toFixed(2));
});

function formatMoney(value: number) {
  return Number(value || 0).toFixed(2);
}

function isPoleProduct(product: AddOnProduct): boolean {
  return /\b(pole|post)\b/i.test(product.name || '');
}

function isPoleMountingKit(product: AddOnProduct): boolean {
  return /pole mounting kit/i.test(product.name || '');
}

const hasBoltMountedPoleSelection = computed(() => {
  return props.products.some((product) => {
    if (!isPoleProduct(product) || isPoleMountingKit(product)) return false;
    const qty = Number(quantities.value[product.id] || 0);
    const mountType = mountTypes.value[product.id] || 'ground_bolted';
    return qty > 0 && mountType === 'ground_bolted';
  });
});

function updateQuantity(productId: number, raw: string) {
  const parsed = Number(raw);
  quantities.value[productId] = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  delete lineErrors.value[`quantities.${productId}`];
}

function clearSelections() {
  for (const product of props.products) {
    quantities.value[product.id] = 0;
  }
  lineErrors.value = {};
}

function setMountType(productId: number, mountType: string) {
  mountTypes.value[productId] = mountType;
  delete lineErrors.value[`mount_types.${productId}`];
}

function billableQuantity(product: AddOnProduct): number {
  const qty = Math.max(0, Number(quantities.value[product.id] || 0));
  if (isPoleProduct(product) && (mountTypes.value[product.id] || 'ground_bolted') === 'subgrade_footer' && qty > 0) {
    return qty + 3;
  }
  return qty;
}

function extendedPrice(product: AddOnProduct): number {
  return billableQuantity(product) * Number(product.unit_price || 0);
}

watch(
  () => hasBoltMountedPoleSelection.value,
  (eligible) => {
    if (eligible) return;
    for (const product of props.products) {
      if (isPoleMountingKit(product)) {
        quantities.value[product.id] = 0;
      }
    }
  }
);

async function continueToCheckout() {
  isSaving.value = true;
  errorMessage.value = '';

  try {
    const { data } = await axios.put(`/api/orders/${props.order.id}/add-ons`, {
      quantities: quantities.value,
      mount_types: mountTypes.value,
    });

    window.location.href = data?.next_url || `/orders/${props.order.id}`;
  } catch (err: any) {
    const responseErrors = err?.response?.data?.errors || {};
    lineErrors.value = Object.keys(responseErrors).reduce((acc: Record<string, string>, key: string) => {
      const value = responseErrors[key];
      acc[key] = Array.isArray(value) ? String(value[0]) : String(value);
      return acc;
    }, {});
    errorMessage.value = err?.response?.data?.message || 'Unable to save add-ons. Please try again.';
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto py-8 space-y-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-xs uppercase tracking-wide text-gray-500">Order</div>
          <h1 class="text-2xl font-semibold">
            {{ order.order_number || `Order #${order.id}` }} Add-Ons
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            {{ signType ? `${signType} may need accessories.` : 'Select optional accessories for this order.' }}
          </p>
        </div>
        <Link
          :href="`/orders/${order.id}?skip_addons=1`"
          class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Skip to Checkout
        </Link>
      </div>

      <div class="rounded-lg border bg-white/80 p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold">Available Add-Ons</div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            @click="clearSelections"
          >
            No Add-Ons
          </button>
        </div>

        <div v-if="!products.length" class="text-sm text-gray-500">
          No add-ons are configured for this sign type.
        </div>

        <div v-else class="space-y-2">
          <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div class="col-span-5">Add-On</div>
            <div class="col-span-2 text-right">Price Each</div>
            <div class="col-span-2 text-right">Quantity</div>
            <div class="col-span-3 text-right">Extended Price</div>
          </div>
          <div
            v-for="product in products"
            :key="product.id"
            class="grid grid-cols-12 items-center gap-2 rounded-md border p-3"
          >
            <div class="col-span-5">
              <div class="text-sm font-medium text-slate-900">{{ product.name }}</div>
              <div class="text-xs text-slate-500">{{ product.description || '-' }}</div>
              <div v-if="isPoleProduct(product) && !isPoleMountingKit(product)" class="text-[11px] text-slate-500 mt-1">
                Quantity = linear feet
              </div>
              <div
                v-if="isPoleMountingKit(product)"
                class="text-[11px] text-slate-500 mt-1"
              >
                Above grade, Ground-Bolted Installations
              </div>
              <div
                v-if="isPoleMountingKit(product) && !hasBoltMountedPoleSelection"
                class="text-[11px] text-slate-500 mt-1"
              >
                Available only when a pole/post is selected with Ground Bolted mount.
              </div>
            </div>
            <div class="col-span-2 text-right text-sm text-slate-700">
              {{ formatMoney(product.unit_price) }} {{ currency }}
            </div>
            <div class="col-span-2">
              <input
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                class="w-full rounded border px-2 py-1 text-right text-sm"
                :value="quantities[product.id] ?? 0"
                :disabled="isPoleMountingKit(product) && !hasBoltMountedPoleSelection"
                @input="updateQuantity(product.id, ($event.target as HTMLInputElement).value)"
              />
              <div v-if="lineErrors[`quantities.${product.id}`]" class="mt-1 text-[11px] text-red-600">
                {{ lineErrors[`quantities.${product.id}`] }}
              </div>
              <div v-if="isPoleProduct(product) && !isPoleMountingKit(product) && (quantities[product.id] || 0) > 0" class="mt-2 space-y-1">
                <select
                  class="w-full rounded border px-2 py-1 text-xs"
                  :value="mountTypes[product.id] || 'ground_bolted'"
                  @change="setMountType(product.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="ground_bolted">Ground Bolted</option>
                  <option value="subgrade_footer">Subgrade Footer (+3 ft)</option>
                </select>
                <div v-if="lineErrors[`mount_types.${product.id}`]" class="text-[11px] text-red-600">
                  {{ lineErrors[`mount_types.${product.id}`] }}
                </div>
              </div>
            </div>
            <div class="col-span-3 text-right text-sm font-semibold text-slate-800">
              {{ formatMoney(extendedPrice(product)) }} {{ currency }}
              <div
                v-if="isPoleProduct(product) && !isPoleMountingKit(product) && (quantities[product.id] || 0) > 0 && (mountTypes[product.id] || 'ground_bolted') === 'subgrade_footer'"
                class="text-[11px] text-slate-500"
              >
                Billed feet: {{ billableQuantity(product) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-white/80 p-4">
        <div class="grid gap-2 text-sm sm:grid-cols-2">
          <div class="text-slate-600">Sign Base Total</div>
          <div class="text-right font-medium">{{ formatMoney(baseTotal) }} {{ currency }}</div>
          <div class="text-slate-600">Add-Ons Total</div>
          <div class="text-right font-medium">{{ formatMoney(addOnTotal) }} {{ currency }}</div>
          <div class="text-slate-900 font-semibold border-t pt-2">Subtotal</div>
          <div class="text-right text-slate-900 font-semibold border-t pt-2">
            {{ formatMoney(grandTotal) }} {{ currency }}
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-500">
          Sales Tax will be calculated upon Checkout.
        </div>

        <div v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</div>

        <div class="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            :disabled="isSaving"
            @click="continueToCheckout"
          >
            {{ isSaving ? 'Saving...' : 'Continue to Checkout' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
