<!-- <template>
  <div class="w-full h-screen">
    <CanvasEditor
    :width="Number($page.props.width)"
    :height="Number($page.props.height)"
    :email="$page.props.email"
    :postalCode="$page.props.postalCode"
    :signType="$page.props.signType"
    :designId="$page.props.designId"
  />  
  </div>
</template>

<script setup>
import CanvasEditor from '@/Components/CanvasEditor.vue';
</script> -->
<!-- resources/js/Pages/Canvas.vue -->
<script setup>
/*const isAuthenticated = !!(page?.props?.auth && page.props.auth.user)*/
import AppLayout from '@/Layouts/AppLayout.vue';
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import CanvasEditor from '@/Components/CanvasEditor.vue';

const page = usePage();
const designId = computed(() => page.props.designId ?? null);
const signType = computed(() => page.props.signType ?? null);
</script>

<template>
  <AppLayout>
    <CanvasEditor
      :design-id="designId"
      :sign-type="signType"
    />
  </AppLayout>
</template>

