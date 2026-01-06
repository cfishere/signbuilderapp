<template>
  <header class="border-b bg-white/80 backdrop-blur">
    <nav class="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Left: Brand / Home -->
      <div class="flex items-center gap-3">
        <Link href="/" class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-lg bg-emerald-600">
            SB
          </span>
          <span class="text-base font-semibold text-gray-800">
            Sign Builder
          </span>
        </Link>

        <!-- Optional: primary nav links -->
        <div class="items-center hidden gap-4 ml-6 text-sm md:flex">
          <Link
            href="/canvas"
            class="text-gray-600 hover:text-gray-900"
          >
            Canvas
          </Link>
          <Link
            href="/designs"
            class="text-gray-600 hover:text-gray-900"
            v-if="authUser"
          >
            My Designs
          </Link>
        </div>
      </div>

      <!-- Right: Auth Controls -->
      <div class="flex items-center gap-3 text-sm">
        <!-- When authenticated -->
        <template v-if="authUser">
          <span class="hidden text-gray-700 sm:inline">
            Welcome, <span class="font-semibold">{{ authUser.name }}</span>
          </span>

          <button
            type="button"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            @click="goToMyDesigns"
          >
            My Designs
          </button>

          <button
            type="button"
            class="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-rose-700"
            @click="logout"
          >
            Logout
          </button>
        </template>

        <!-- When guest -->
        <template v-else>
          <Link
            href="/login"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Log in
          </Link>
          <Link
            href="/register"
            class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700"
          >
            Register
          </Link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';

const page = usePage();
const authUser = computed(() => page.props.auth?.user ?? null);

function logout() {
  // Laravel default logout route is POST /logout
  router.post('/logout');
}

function goToMyDesigns() {
  router.get('/my-designs');
}
</script>
