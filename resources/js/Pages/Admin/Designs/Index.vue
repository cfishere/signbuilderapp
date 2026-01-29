<script setup lang="ts">
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { computed, ref, onMounted, onBeforeUnmount, reactive, watch } from 'vue';
import axios from 'axios';

const page = usePage();

const designs = computed(() => page.props.designs);
const perPage = computed(() => page.props.perPage ?? 25);
const filters = computed(() => page.props.filters ?? {});
const signTypes = computed(() => page.props.signTypes ?? []);
const openMenuId = ref<number | null>(null);
const isDeleting = ref<number | null>(null);

function toggleMenu(id: number) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleClickAway(event: MouseEvent) {
  if (!openMenuId.value) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (target.closest('[data-actions-menu="true"]')) return;
  openMenuId.value = null;
}

onMounted(() => {
  document.addEventListener('click', handleClickAway);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickAway);
});

const localFilters = reactive({
  sign_type: filters.value.sign_type || '',
  owner: filters.value.owner || '',
  admin_only: filters.value.admin_only || false,
});

watch(
  () => localFilters.admin_only,
  () => {
    applyFilters();
  }
);

function updatePerPage(value: number) {
  router.get('/admin/designs', { ...localFilters, per_page: value }, { preserveState: true, preserveScroll: true });
}

function applyFilters() {
  router.get('/admin/designs', { ...localFilters, per_page: perPage.value }, { preserveState: true, preserveScroll: true });
}

function clearFilters() {
  localFilters.sign_type = '';
  localFilters.owner = '';
  localFilters.admin_only = false;
  router.get('/admin/designs', { per_page: perPage.value }, { preserveState: true, preserveScroll: true });
}

async function deleteDesign(id: number) {
  const confirmed = window.confirm('Delete this design? This cannot be undone.');
  if (!confirmed) return;

  isDeleting.value = id;
  try {
    await axios.delete(`/api/designs/${id}`);
    window.location.reload();
  } catch (err) {
    console.error('[deleteDesign] Failed:', err);
    window.alert('Unable to delete this design. Please try again.');
  } finally {
    isDeleting.value = null;
    openMenuId.value = null;
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-6xl py-8 mx-auto">
      <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">All Designs</h1>
          <p class="text-sm text-gray-600">Admin view across all users.</p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <label class="text-gray-600">Per page</label>
          <select
            class="px-2 py-1 border rounded"
            :value="perPage"
            @change="updatePerPage(Number($event.target.value))"
          >
            <option :value="25">25</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <div class="p-4 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="text-xs font-semibold text-slate-600">Sign type</label>
            <select
              v-model="localFilters.sign_type"
              class="w-full px-2 py-1 mt-1 text-sm border rounded"
            >
              <option value="">All</option>
              <option v-for="type in signTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Owner</label>
            <input
              v-model="localFilters.owner"
              type="text"
              class="w-full px-2 py-1 mt-1 text-sm border rounded"
              placeholder="Name or email"
            />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" v-model="localFilters.admin_only" class="rounded border-slate-300" />
              Admin-owned only
            </label>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <button
            type="button"
            class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            @click="applyFilters"
          >
            Apply Filters
          </button>
          <button
            type="button"
            class="rounded-md border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            @click="clearFilters"
          >
            Clear
          </button>
        </div>
      </div>

      <div v-if="!designs.data.length" class="text-sm text-gray-500">
        No designs found.
      </div>

      <div v-else class="overflow-x-auto border rounded-lg bg-white/80">
        <table class="min-w-full text-sm">
          <thead class="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th class="px-3 py-2 text-left">Name</th>
              <th class="px-3 py-2 text-left">Owner</th>
              <th class="px-3 py-2 text-left">Sign Type</th>
              <th class="px-3 py-2 text-left">Size (H × W in)</th>
              <th class="px-3 py-2 text-left">Status</th>
              <th class="px-3 py-2 text-left">Updated</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="design in designs.data"
              :key="design.id"
              class="border-t last:border-b bg-white/60"
            >
              <td class="px-3 py-2 font-medium">
                {{ design.name || `Design #${design.id}` }}
              </td>
              <td class="px-3 py-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="text-sm font-medium"
                    :class="design.owner?.is_admin ? 'text-amber-700' : 'text-gray-700'"
                  >
                    {{ design.owner?.name || '—' }}
                  </span>
                  <span
                    v-if="design.owner?.is_admin"
                    class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
                  >
                    ADMIN
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ design.owner?.email || '—' }}
                </div>
              </td>
              <td class="px-3 py-2">
                {{ design.sign_type || '—' }}
              </td>
              <td class="px-3 py-2">
                <span v-if="design.sign_height && design.sign_width">
                  {{ design.sign_height }} × {{ design.sign_width }}
                </span>
                <span v-else>—</span>
              </td>
              <td class="px-3 py-2">
                <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  {{ design.status || 'draft' }}
                </span>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500">
                {{ design.updated_at || '—' }}
              </td>
              <td class="px-3 py-2 text-right">
                <div class="relative inline-block text-left" data-actions-menu="true">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center w-8 h-8 text-gray-600 border rounded hover:bg-gray-50"
                    @click="toggleMenu(design.id)"
                    aria-label="Open actions menu"
                  >
                    ⋮
                  </button>
                  <div
                    v-if="openMenuId === design.id"
                    class="absolute right-0 z-10 mt-2 origin-top-right bg-white border rounded-md shadow w-36"
                  >
                    <Link
                      :href="`/canvas?design_id=${design.id}`"
                      class="block px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-50"
                    >
                      View/Update
                    </Link>
                    <button
                      type="button"
                      class="block w-full px-3 py-2 text-xs text-left text-red-600 hover:bg-red-50 disabled:opacity-60"
                      :disabled="isDeleting === design.id"
                      @click="deleteDesign(design.id)"
                    >
                      {{ isDeleting === design.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="designs.links && designs.links.length > 3"
        class="flex flex-col gap-3 mt-4 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          Page {{ designs.current_page }} of {{ designs.last_page }}
        </div>
        <div class="space-x-1">
          <Link
            v-for="link in designs.links"
            :key="link.label"
            :href="link.url || '#'"
            class="px-2 py-1 border rounded"
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
  </AdminLayout>
</template>
