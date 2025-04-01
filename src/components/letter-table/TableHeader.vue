<template>
  <div class="flex justify-end items-center mb-6">
    <button 
      @click="$emit('new-letter')" 
      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New
    </button>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  emits: ['new-letter']
}
</script>