<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { getBasePriceForSignType } from '@/utils/pricing';

declare global {
  interface Window {
    paypal?: any;
  }
}

const page = usePage();
const order = ref(page.props.order);
const customerProfile = (page.props.customer_profile || {}) as Record<string, string>;
const paypalClientId = page.props.paypal_client_id as string | null;
const isAdmin = computed(() => !!page.props.auth?.user?.is_admin);
const isPaid = computed(() => {
  const status = String(order.value?.status || '').toLowerCase();
  return status === 'paid' || status === 'completed';
});
const form = ref({
  company_name: customerProfile.company_name || '',
  customer_name: order.value.customer_name || customerProfile.customer_name || '',
  address_line1: order.value.address_line1 || customerProfile.address_line1 || '',
  address_line2: order.value.address_line2 || customerProfile.address_line2 || '',
  city: order.value.city || customerProfile.city || '',
  region: order.value.region || customerProfile.region || '',
  postal_code: order.value.postal_code || customerProfile.postal_code || '',
  country: order.value.country || customerProfile.country || 'US',
  nonprofit: Boolean(customerProfile.nonprofit),
  delivery_method: order.value.delivery_method || '',
  total_amount: order.value.total_amount ?? '',
  currency: order.value.currency || 'USD',
});
const errors = ref<Record<string, string>>({});
const isSaving = ref(false);
const statusMessage = ref('');
const paypalError = ref('');
const paypalStatus = ref('');
const paypalContainer = ref<HTMLElement | null>(null);
const isPaying = ref(false);
const isGeneratingInvoice = ref(false);
const invoiceState = ref(order.value.invoice || null);
const deliveryRates: Record<string, number> = {
  UPS: 200,
  Freight: 370,
  FedEx: 190,
  USPS: 350,
  'Local Pickup': 0,
};
const OH_SALES_TAX_RATE = 0.08;
const US_STATE_OPTIONS = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
] as const;
const REGION_NAME_TO_CODE = US_STATE_OPTIONS.reduce((acc, s) => {
  acc[s.name.toLowerCase()] = s.code;
  return acc;
}, {} as Record<string, string>);
const baseSignTotal = ref(0);
const addOnTotal = ref(0);
const requiredCustomerFields = [
  'customer_name',
  'address_line1',
  'city',
  'region',
  'postal_code',
  'delivery_method',
] as const;
const missingCustomerFields = computed(() => {
  return requiredCustomerFields.filter((key) => !String(form.value[key] || '').trim());
});
const hasCustomerDetails = computed(() => missingCustomerFields.value.length === 0);
const hasValidTotal = computed(() => Number(form.value.total_amount || 0) > 0);
const canSubmitCustomerInfo = computed(() => hasCustomerDetails.value && hasValidTotal.value);
const merchandiseSubtotal = computed(() => baseSignTotal.value + addOnTotal.value);
const deliveryFee = computed(() => getDeliveryFee(form.value.delivery_method));
const isOhioTaxable = computed(() => {
  const raw = String(form.value.region || '').trim();
  if (!raw) return false;
  return raw.toUpperCase() === 'OH' || raw.toLowerCase() === 'ohio';
});
const isTaxExempt = computed(() => Boolean(form.value.nonprofit));
const salesTax = computed(() => {
  const taxableAmount = merchandiseSubtotal.value + deliveryFee.value;
  if (!isOhioTaxable.value || isTaxExempt.value) return 0;
  return Number((taxableAmount * OH_SALES_TAX_RATE).toFixed(2));
});
const orderSubtotal = computed(() => {
  return Number((merchandiseSubtotal.value + deliveryFee.value + salesTax.value).toFixed(2));
});

function getDeliveryFee(method?: string | null): number {
  return deliveryRates[String(method || '')] ?? 0;
}

function applyDeliveryPricedTotal() {
  const total = orderSubtotal.value;
  form.value.total_amount = Number(total.toFixed(2));
}

function normalizeRegionToStateCode(value: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const upper = normalized.toUpperCase();
  if (US_STATE_OPTIONS.some((s) => s.code === upper)) return upper;
  return REGION_NAME_TO_CODE[normalized.toLowerCase()] || normalized;
}

function canRenderPayPal() {
  const status = String(order.value?.status || '').toLowerCase();
  return status !== 'paid' && status !== 'completed';
}

function printOrder() {
  window.print();
}

async function generateInvoice() {
  if (!order.value?.id) return;
  isGeneratingInvoice.value = true;
  statusMessage.value = '';
  try {
    const { data } = await axios.post(`/api/orders/${order.value.id}/invoice/generate`);
    invoiceState.value = data?.invoice || null;
    statusMessage.value = 'Invoice generated.';
  } catch (err: any) {
    statusMessage.value = err?.response?.data?.message || 'Unable to generate invoice.';
  } finally {
    isGeneratingInvoice.value = false;
  }
}

function loadPayPalSdk() {
  if (!paypalClientId) {
    paypalError.value = 'PayPal client ID is not configured.';
    return Promise.reject(new Error('Missing PayPal client ID'));
  }

  if ((window as any).paypal) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-paypal-sdk="true"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load.')));
      return;
    }

    const script = document.createElement('script');
    const currency = order.value.currency || 'USD';
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=${currency}&intent=capture`;
    script.async = true;
    script.defer = true;
    script.dataset.paypalSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load.'));
    document.body.appendChild(script);
  });
}

async function renderPayPalButtons() {
  if (!paypalContainer.value || !(window as any).paypal) return;
  if (!order.value?.id) return;
  if (!canRenderPayPal()) return;

  paypalContainer.value.innerHTML = '';

  const paypal = (window as any).paypal;
  paypal.Buttons({
    createOrder: async () => {
      paypalStatus.value = '';
      try {
        if (!hasCustomerDetails.value) {
          paypalStatus.value = 'Please submit customer details before starting payment.';
          throw new Error('Missing customer details');
        }
        if (!hasValidTotal.value) {
          paypalStatus.value = 'Order total must be greater than 0 before starting payment.';
          throw new Error('Invalid order total');
        }

        const needsTotalUpdate =
          String(form.value.total_amount) !== String(order.value.total_amount ?? '') ||
          String(form.value.currency || 'USD') !== String(order.value.currency || 'USD');

        if (needsTotalUpdate) {
          const { data: updated } = await axios.put(`/api/orders/${order.value.id}`, {
            total_amount: form.value.total_amount,
            currency: form.value.currency || 'USD',
          });
          order.value = { ...order.value, ...updated };
        }

        const { data } = await axios.post(`/api/orders/${order.value.id}/paypal/create`);
        return data.paypal_order_id;
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Unable to start PayPal checkout.';
        paypalStatus.value = message;
        throw err;
      }
    },
    onApprove: async (data: any) => {
      isPaying.value = true;
      paypalStatus.value = 'Capturing payment...';
      try {
        const { data: updated } = await axios.post(`/api/orders/${order.value.id}/paypal/capture`, {
          paypal_order_id: data.orderID,
        });
        order.value = { ...order.value, ...updated };
        paypalStatus.value = 'Payment captured.';
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Payment capture failed.';
        paypalStatus.value = message;
        console.error('[PayPal] Capture failed', err);
      } finally {
        isPaying.value = false;
      }
    },
    onError: (err: any) => {
      console.error('[PayPal] Error', err);
      paypalStatus.value = 'Payment failed. Please try again.';
      axios.post(`/api/orders/${order.value.id}/abandoned`, {
        reason: 'paypal_error',
      }).catch(() => {});
      isPaying.value = false;
    },
    onCancel: () => {
      paypalStatus.value = 'Payment was not completed.';
      axios.post(`/api/orders/${order.value.id}/abandoned`, {
        reason: 'paypal_cancel',
      }).catch(() => {});
      isPaying.value = false;
    },
  }).render(paypalContainer.value);
}

onMounted(async () => {
  form.value.region = normalizeRegionToStateCode(form.value.region);
  const metadata = (order.value?.metadata || {}) as Record<string, any>;
  const metaBase = Number(metadata?.base_total_amount);
  const metaAddOn = Number(metadata?.add_on_total_amount);

  if (Number.isFinite(metaBase)) {
    baseSignTotal.value = metaBase;
    addOnTotal.value = Number.isFinite(metaAddOn) ? metaAddOn : 0;
  } else {
    const currentTotal = Number(order.value?.total_amount || 0);
    baseSignTotal.value = Math.max(0, currentTotal - getDeliveryFee(form.value.delivery_method));
    addOnTotal.value = 0;
  }

  if (!Number.isFinite(baseSignTotal.value) || baseSignTotal.value <= 0) {
    const signType = order.value.metadata?.sign_type as string | undefined;
    baseSignTotal.value = Number(getBasePriceForSignType(signType) || 0);
    addOnTotal.value = 0;
  }

  applyDeliveryPricedTotal();

  try {
    await loadPayPalSdk();
    await renderPayPalButtons();
  } catch (err: any) {
    paypalError.value = err?.message || 'PayPal SDK failed to load.';
  }
});

watch(
  () => [order.value.total_amount, order.value.currency],
  async () => {
    if (paypalContainer.value) {
      await renderPayPalButtons();
    }
  }
);

watch(
  () => form.value.delivery_method,
  () => {
    applyDeliveryPricedTotal();
  }
);
watch(
  () => form.value.region,
  (value) => {
    const normalized = normalizeRegionToStateCode(value);
    if (normalized !== value) {
      form.value.region = normalized;
      return;
    }
    applyDeliveryPricedTotal();
  }
);

watch(
  () => [form.value.customer_name, form.value.address_line1, form.value.city, form.value.region, form.value.postal_code, form.value.delivery_method, form.value.total_amount],
  async () => {
    if (!paypalContainer.value) return;
    await renderPayPalButtons();
  }
);

async function submitCustomerInfo() {
  if (!order.value?.id) return;
  errors.value = {};
  statusMessage.value = '';
  isSaving.value = true;

  try {
    const { data } = await axios.put(`/api/orders/${order.value.id}`, {
      ...form.value,
      status: 'unpaid',
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
      <div class="flex items-center justify-between mb-6 print:hidden">
        <div>
          <div class="text-xs uppercase tracking-wide text-gray-500">Order</div>
          <h1 class="text-2xl font-semibold">
            {{ order.order_number || `Order #${order.id}` }}
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <a
            v-if="order.preview_image_url"
            :href="order.preview_image_url"
            class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            target="_blank"
            rel="noopener"
          >
            Download Preview
          </a>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="printOrder"
          >
            Print
          </button>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            :disabled="isGeneratingInvoice"
            @click="generateInvoice"
          >
            {{ isGeneratingInvoice ? 'Generating Invoice...' : (invoiceState ? 'Regenerate Invoice' : 'Generate Invoice') }}
          </button>
          <a
            v-if="invoiceState?.download_url"
            :href="invoiceState.download_url"
            class="inline-flex items-center rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Download Invoice
          </a>
          <Link
            href="/orders"
            class="inline-flex items-center rounded-md border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div class="rounded-lg border bg-white/80 p-4 print:border-none print:bg-white">
          <div class="text-sm font-semibold mb-2">Preview</div>
          <div
            v-if="order.preview_image_url"
            class="rounded border bg-white p-2"
          >
            <img
              :src="order.preview_image_url"
              alt="Order preview"
              class="w-full h-auto rounded mb-5"
            />
            <div class="text-center text-xs text-gray-500">
              Low Resolution Preview Image
            </div>
          </div>
          <div v-else class="text-xs text-gray-500">
            No preview image saved yet.
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-lg border bg-white/80 p-4">
            <div class="text-sm font-semibold mb-3">Details</div>
            <form class="text-sm text-gray-700 space-y-3" @submit.prevent="submitCustomerInfo">
              <div>
                <label class="text-xs uppercase text-gray-400">Company Name</label>
                <input
                  v-model="form.company_name"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  :disabled="!isAdmin && isPaid"
                />
              </div>
              <div class="flex items-center gap-2">
                <input
                  id="nonprofit"
                  v-model="form.nonprofit"
                  type="checkbox"
                  class="rounded border-gray-300"
                  :disabled="!isAdmin && isPaid"
                />
                <label for="nonprofit" class="text-xs uppercase text-gray-400">Nonprofit (Tax Exempt)</label>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Customer Name</label>
                <input
                  v-model="form.customer_name"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  :disabled="!isAdmin && isPaid"
                />
                <div v-if="errors.customer_name" class="text-xs text-red-600">{{ errors.customer_name }}</div>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Address Line 1</label>
                <input
                  v-model="form.address_line1"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  :disabled="!isAdmin && isPaid"
                />
                <div v-if="errors.address_line1" class="text-xs text-red-600">{{ errors.address_line1 }}</div>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Address Line 2</label>
                <input
                  v-model="form.address_line2"
                  type="text"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  :disabled="!isAdmin && isPaid"
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs uppercase text-gray-400">City</label>
                  <input
                    v-model="form.city"
                    type="text"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    required
                    :disabled="!isAdmin && isPaid"
                  />
                  <div v-if="errors.city" class="text-xs text-red-600">{{ errors.city }}</div>
                </div>
                <div>
                  <label class="text-xs uppercase text-gray-400">Region</label>
                  <select
                    v-model="form.region"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    required
                    :disabled="!isAdmin && isPaid"
                  >
                    <option value="">Select state...</option>
                    <option v-for="state in US_STATE_OPTIONS" :key="state.code" :value="state.code">
                      {{ state.name }}
                    </option>
                  </select>
                  <div v-if="errors.region" class="text-xs text-red-600">{{ errors.region }}</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs uppercase text-gray-400">Postal Code</label>
                  <input
                    v-model="form.postal_code"
                    type="text"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    required
                    :disabled="!isAdmin && isPaid"
                  />
                  <div v-if="errors.postal_code" class="text-xs text-red-600">{{ errors.postal_code }}</div>
                </div>
                <div>
                  <label class="text-xs uppercase text-gray-400">Country</label>
                  <input
                    v-model="form.country"
                    type="text"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    :disabled="!isAdmin && isPaid"
                  />
                </div>
              </div>
              <div>
                <label class="text-xs uppercase text-gray-400">Delivery Method</label>
                <select
                  v-model="form.delivery_method"
                  class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  :disabled="!isAdmin && isPaid"
                >
                  <option value="">Select...</option>
                  <option value="Freight">Freight</option>
                  <option value="UPS">UPS</option>
                  <option value="USPS">USPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="Local Pickup">Local Pickup</option>
                </select>
                <div v-if="errors.delivery_method" class="text-xs text-red-600">{{ errors.delivery_method }}</div>
              </div>
              <div class="grid grid-cols-[1fr,100px] gap-2">
                <div>
                  <label class="text-xs uppercase text-gray-400">Order Total</label>
                  <input
                    v-model="form.total_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="0.00"
                    :disabled="!isAdmin && isPaid"
                  />
                  <div v-if="errors.total_amount" class="text-xs text-red-600">{{ errors.total_amount }}</div>
                </div>
                <div>
                  <label class="text-xs uppercase text-gray-400">Currency</label>
                  <input
                    v-model="form.currency"
                    type="text"
                    class="mt-1 w-full rounded border px-2 py-1 text-sm uppercase disabled:bg-gray-100 disabled:text-gray-500"
                    :disabled="!isAdmin && isPaid"
                  />
                </div>
              </div>
              <div>
              <span class="text-xs uppercase text-gray-400">Status</span>
              <div>{{ order.status || 'unpaid' }}</div>
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
              <div>
                <span class="text-xs uppercase text-gray-400">Invoice</span>
                <div v-if="invoiceState">
                  {{ invoiceState.invoice_number || '-' }} ({{ String(invoiceState.status || '-').toUpperCase() }})
                </div>
                <div v-else>-</div>
              </div>
              <div class="flex items-center gap-2 pt-2 print:hidden">
                <button
                  v-if="isAdmin || !isPaid"
                  type="submit"
                  class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                  :disabled="isSaving || !canSubmitCustomerInfo"
                >
                  {{ isSaving ? 'Saving...' : 'Submit Customer Info' }}
                </button>
                <span
                  v-if="!canSubmitCustomerInfo && (isAdmin || !isPaid)"
                  class="text-xs text-amber-700"
                >
                  Complete required fields and delivery method to continue.
                </span>
                <span v-if="statusMessage" class="text-xs text-gray-500">{{ statusMessage }}</span>
              </div>
            </form>
          </div>

          <div class="rounded-lg border bg-white/80 p-4 print:hidden">
            <div class="text-sm font-semibold mb-3">Checkout</div>
            <div class="text-xs text-gray-500 mb-3">
              Total: {{ order.total_amount || '0.00' }} {{ order.currency || 'USD' }}
            </div>
            <div class="mb-3 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700 space-y-1">
              <div class="flex items-center justify-between">
                <span>Base Sign</span>
                <span>{{ baseSignTotal.toFixed(2) }} {{ order.currency || 'USD' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Add-Ons</span>
                <span>{{ addOnTotal.toFixed(2) }} {{ order.currency || 'USD' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Delivery</span>
                <span>{{ deliveryFee.toFixed(2) }} {{ order.currency || 'USD' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>OH Sales Tax (8%)</span>
                <span>{{ salesTax.toFixed(2) }} {{ order.currency || 'USD' }}</span>
              </div>
              <div class="flex items-center justify-between border-t pt-1 font-semibold text-slate-900">
                <span>Subtotal</span>
                <span>{{ orderSubtotal.toFixed(2) }} {{ order.currency || 'USD' }}</span>
              </div>
            </div>
            <div v-if="paypalError" class="text-xs text-red-600 mb-2">{{ paypalError }}</div>
            <div v-if="!canRenderPayPal()" class="text-xs text-gray-500">
              Payment complete.
            </div>
            <div v-else-if="isAdmin || !isPaid" ref="paypalContainer"></div>
            <div
              v-if="canRenderPayPal() && !hasCustomerDetails"
              class="text-xs text-amber-700 mt-2"
            >
              Missing required customer details will block payment on submit.
            </div>
            <div
              v-if="canRenderPayPal() && !hasValidTotal"
              class="text-xs text-amber-700 mt-1"
            >
              Order total must be greater than 0 to start payment.
            </div>
            <div v-if="paypalStatus" class="text-xs text-gray-500 mt-2">{{ paypalStatus }}</div>
            <div class="mt-3 text-xs text-gray-500">
              Order Status: {{ order.status || 'unpaid' }} • PayPal Status: {{ order.paypal_status || '-' }} • Paid At: {{ order.paid_at || '-' }}
            </div>
            <div v-if="isPaying" class="text-xs text-gray-500 mt-1">
              Processing payment...
            </div>
          </div>

        </div>
      </div>
    </div>
  </AppLayout>
</template>

