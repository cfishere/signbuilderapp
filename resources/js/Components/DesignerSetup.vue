<script setup>
  import { Inertia } from '@inertiajs/inertia'  
  import { useForm } from '@inertiajs/vue3'



const form = useForm({
  email: null,
  width: null,
  height: null,
  signType: null,
  postalCode: null,
  designId: null,   // optional when loading a saved design
});
function submit() {
  form.post('canvas', form, {
    preserveScroll: true
  })
}

</script>

<style scoped>
input:invalid, select:invalid {
  border-color: red;
}
</style>
<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Sign Designer Setup</h1>

    <form @submit.prevent="submit" class="space-y-4">

      <div>
        <label class="block mb-1 font-medium">Email
          <input
            type="email"
            v-model.trim="form.email"
            name="email"
            required
            class="w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <!-- Sign Width -->
      <div>
        <label class="block mb-1 font-medium" >Sign Width (feet)
        <input
          type="number"
          v-model.number="form.width"
          name="width"
          required
          min="1"
          class="w-full border rounded px-3 py-2"
        />
      </label>
      </div>

      <!-- Sign Height -->
      <div>
        <label class="block mb-1 font-medium">Sign Height (feet)
        <input
          type="number"
          v-model.number="form.height"
          name="height"
          required
          min="1"
          class="w-full border rounded px-3 py-2"
        />
      </label>
      </div>

      <!-- Sign Type - Option Names must match those in /templates/signTemplates.js -->
      <div>
        <label class="block mb-1 font-medium">Sign Type
          <select v-model="form.signType" required class="w-full border rounded px-3 py-2">
            <option disabled value="">-- Select Sign Type --</option>
            <option>Wall Sign Illuminated Cabinet</option>
            <option>Wall Sign Printed</option>
            <option>Pylon Illuminated Cabinet</option>
            <option>Pylon Dark Cabinet</option>
            <option>Monument Illuminated Cabinet</option>
            <option>Monument Dark Cabinet</option>
            <option>Channel Letters</option>
            <option>Face Replacement</option>
          </select>
        </label>
      </div>

      <!-- Postal Code -->
      <div>
        <label class="block mb-1 font-medium">Postal Code
          <input
            type="text"
            v-model.trim="form.postalCode"
            name="postalCode"
            required
            class="w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <!-- Spoof designId as empty to avoid query param not found in destination props -->
      <input
          type="hidden"
          v-model="form.designId"
          name="designId"          
          min="1"
          value="2"
          class=""
        /> 

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Designing
        </button>
      </div>
    </form>
  </div>
</template>


