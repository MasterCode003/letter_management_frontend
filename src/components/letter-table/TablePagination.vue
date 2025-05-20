<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
    <!-- Mobile pagination with arrows -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Enhanced Desktop pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing 
          <span class="font-semibold text-gray-900">{{ startIndex + 1 }}</span> 
          to
          <span class="font-semibold text-gray-900">{{ endIndex }}</span> 
          of
          <span class="font-semibold text-gray-900">{{ totalItems }}</span> 
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex items-center space-x-1" aria-label="Pagination">
          <!-- Previous button -->
          <button
            @click="$emit('previous')"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-lg px-2 py-2 text-gray-400 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page numbers -->
          <div class="isolate inline-flex -space-x-px rounded-lg shadow-sm">
            <button
              v-for="pageNum in displayedPages"
              :key="pageNum"
              @click="$emit('goto-page', pageNum)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200"
              :class="[
                currentPage === pageNum
                  ? 'z-10 bg-blue-600 text-white hover:bg-blue-700 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 border border-gray-300',
                pageNum === displayedPages[0] ? 'rounded-l-lg' : '',
                pageNum === displayedPages[displayedPages.length - 1] ? 'rounded-r-lg' : ''
              ]"
            >
              {{ pageNum }}
            </button>
          </div>

          <!-- Next button -->
          <button
            @click="$emit('next')"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-lg px-2 py-2 text-gray-400 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    displayedPages: {
      type: Array,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    }
  },
  emits: ['previous', 'next', 'goto-page']
}
</script>