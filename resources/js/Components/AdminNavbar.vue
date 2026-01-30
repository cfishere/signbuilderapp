<template>
  <header class="border-b bg-slate-900 text-white">
    <nav class="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <Link href="/admin" class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-slate-900 rounded-lg bg-amber-400">
            SB
          </span>
          <span class="text-base font-semibold">Admin</span>
        </Link>

        <div class="items-center hidden gap-4 ml-6 text-sm md:flex">
          <Link href="/admin" class="text-slate-100 hover:text-white">Dashboard</Link>
          <Link href="/admin/add-ons" class="text-slate-100 hover:text-white">Add-Ons</Link>
          <Link href="/admin/orders" class="text-slate-100 hover:text-white">Orders</Link>
          <Link href="/admin/designs" class="text-slate-100 hover:text-white">Designs</Link>
          <Link href="/admin/users/create" class="text-slate-100 hover:text-white">Admin Users</Link>
        </div>
      </div>

      <div class="flex items-center gap-3 text-sm">
        <Link href="/" class="rounded-md border border-slate-500 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800">
          Public Home
        </Link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
</script>
