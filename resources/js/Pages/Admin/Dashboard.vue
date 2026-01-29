<template>
  <AdminLayout>
    <section class="space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p class="text-sm text-slate-600">
          Quick links to admin tools and management pages.
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
        >
          <h2 class="text-lg font-semibold text-slate-900">{{ item.label }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ item.description }}</p>
        </a>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';

const navItems = [
  {
    href: '/admin/add-ons',
    label: 'Add-On Products',
    description: 'View catalog items, pricing rules, and sign type mappings.',
  },
  {
    href: '/admin/users/create',
    label: 'Create Admin User',
    description: 'Add new admin accounts for staff.',
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    description: 'Review all customer orders and production status.',
  },
  {
    href: '/admin/designs',
    label: 'Designs',
    description: 'Browse saved designs across all users.',
  },
];
</script>
