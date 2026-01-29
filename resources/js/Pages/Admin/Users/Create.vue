<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();
const status = computed(() => page.props.status ?? null);

const form = useForm({
  name: '',
  email: '',
  password: '',
  is_admin: true,
});

function submit() {
  form.post(route('admin.users.store'));
}
</script>

<template>
  <AdminLayout>
    <Head title="Create Admin User" />

    <div class="max-w-xl mx-auto py-8">
      <h1 class="text-2xl font-semibold">Create Admin User</h1>

      <div v-if="status" class="mt-4 text-sm font-medium text-green-600">
        {{ status }}
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <InputLabel for="name" value="Name" />
          <TextInput
            id="name"
            v-model="form.name"
            type="text"
            class="mt-1 block w-full"
            required
            autocomplete="name"
          />
          <InputError class="mt-2" :message="form.errors.name" />
        </div>

        <div>
          <InputLabel for="email" value="Email" />
          <TextInput
            id="email"
            v-model="form.email"
            type="email"
            class="mt-1 block w-full"
            required
            autocomplete="email"
          />
          <InputError class="mt-2" :message="form.errors.email" />
        </div>

        <div>
          <InputLabel for="password" value="Temporary Password" />
          <TextInput
            id="password"
            v-model="form.password"
            type="password"
            class="mt-1 block w-full"
            required
            autocomplete="new-password"
          />
          <InputError class="mt-2" :message="form.errors.password" />
        </div>

        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" v-model="form.is_admin" class="rounded border-gray-300" />
          Admin account
        </label>

        <div class="pt-2">
          <PrimaryButton
            :class="{ 'opacity-25': form.processing }"
            :disabled="form.processing"
          >
            Create User
          </PrimaryButton>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>
