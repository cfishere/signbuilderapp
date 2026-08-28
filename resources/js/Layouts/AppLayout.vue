<template>
  <div class="min-h-screen bg-slate-50">
    <MainNavbar />

    <main class="w-full px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import MainNavbar from '@/Components/MainNavbar.vue';
</script>