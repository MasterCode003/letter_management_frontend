<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="flex items-center gap-4">
      <!-- Title Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchQuery"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by title..."
        />
      </div>

      <!-- Date Range -->
      <div class="flex items-center gap-2">
        <input
          type="date"
          v-model="localFilters.dateRange.start"
          @change="updateFilters"
          class="border rounded-md px-3 py-2 w-36"
        />
        <span>-</span>
        <input
          type="date"
          v-model="localFilters.dateRange.end"
          @change="updateFilters"
          class="border rounded-md px-3 py-2 w-36"
        />
      </div>

      <!-- Type Filter -->
      <div class="w-40">
        <select
          v-model="localFilters.selectedType"
          @change="updateFilters"
          class="w-full border rounded-md px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="Business Letter">Business Letter</option>
          <option value="Memo">Memo</option>
        </select>
      </div>

      <!-- Subject Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchSubject"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by subject..."
        />
      </div>

      <!-- Recipient Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchRecipient"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by recipient..."
        />
      </div>

      <!-- New Letter Button -->
      <button
        @click="$emit('new-letter')"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-shrink-0"
      >
        New Letter
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localFilters: {
        searchQuery: '',
        searchSubject: '',
        searchRecipient: '',
        selectedType: '',
        dateRange: {
          start: '',
          end: ''
        }
      }
    }
  },
  watch: {
    filters: {
      immediate: true,
      handler(newFilters) {
        this.localFilters = {
          searchQuery: newFilters.searchQuery || '',
          searchSubject: newFilters.searchSubject || '',
          searchRecipient: newFilters.searchRecipient || '',
          selectedType: newFilters.selectedType || '',
          dateRange: {
            start: newFilters.dateRange?.start || '',
            end: newFilters.dateRange?.end || ''
          }
        }
      }
    }
  },
  methods: {
    updateFilters() {
      this.$emit('update:filters', this.localFilters)
    }
  }
}
</script>