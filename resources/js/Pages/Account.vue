<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto py-8">
      <h1 class="text-2xl font-semibold">My Account</h1>

      <div class="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <div class="text-sm text-gray-500">Name</div>
        <div class="text-base text-gray-900">{{ user?.name || '-' }}</div>

        <div class="mt-4 text-sm text-gray-500">Email</div>
        <div class="text-base text-gray-900">{{ user?.email || '-' }}</div>
      </div>
    </div>
  </AppLayout>
</template>
