<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

const page = usePage();

// Inertia paginated data
const designs = computed(() => page.props.designs);
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
  <AppLayout>
    <div class="max-w-5xl mx-auto py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold">My Designs</h1>
        <Link
          href="/canvas"
          class="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-700"
        >
          New Design
        </Link>
      </div>

      <div v-if="!designs.data.length" class="text-sm text-gray-500">
        You don’t have any saved designs yet.
      </div>

      <div v-else class="overflow-x-auto border rounded-lg bg-white/80">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-3 py-2 text-left">Name</th>
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
                    class="inline-flex h-8 w-8 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                    @click="toggleMenu(design.id)"
                    aria-label="Open actions menu"
                  >
                    ⋮
                  </button>
                  <div
                    v-if="openMenuId === design.id"
                    class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md border bg-white shadow"
                  >
                    <Link
                      :href="`/canvas?design_id=${design.id}`"
                      class="block px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                    >
                      View/Update
                    </Link>
                    <button
                      type="button"
                      class="block w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
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

      <!-- Simple pagination controls -->
      <div
        v-if="designs.links && designs.links.length > 3"
        class="mt-4 flex justify-between items-center text-xs text-gray-600"
      >
        <div>
          Page {{ designs.current_page }} of {{ designs.last_page }}
        </div>
        <div class="space-x-1">
          <Link
            v-for="link in designs.links"
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
