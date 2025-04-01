<template>
  <div class="mt-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <button
        @click="$emit('previous')"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <!-- Pagination buttons -->
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div class="text-sm text-gray-600">
      Page {{ currentPage }} of {{ totalPages }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    currentPage: Number,
    totalPages: Number,
    displayedPages: Array
  },
  emits: ['previous', 'next', 'goto-page']
}
</script>