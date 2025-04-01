<template>
  <div>
    <!-- New Button -->
    <div class="flex justify-end mb-4">
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

    <!-- Search Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center gap-4">
        <!-- Title Search -->
        <input
          :value="filters.searchQuery"
          @input="updateFilter('searchQuery', $event.target.value)"
          type="text"
          placeholder="Search by title..."
          class="flex-1 px-4 py-2 border rounded-md min-w-[120px]"
        />

        <!-- Subject Search -->
        <input
          :value="filters.searchSubject"
          @input="updateFilter('searchSubject', $event.target.value)"
          type="text"
          placeholder="Search by subject..."
          class="flex-1 px-4 py-2 border rounded-md min-w-[120px]"
        />

        <!-- Recipient Search -->
        <input
          :value="filters.searchRecipient"
          @input="updateFilter('searchRecipient', $event.target.value)"
          type="text"
          placeholder="Search by recipient..."
          class="flex-1 px-4 py-2 border rounded-md min-w-[120px]"
        />

        <!-- Type Filter -->
        <select
          :value="filters.selectedType"
          @change="updateFilter('selectedType', $event.target.value)"
          class="w-[150px] px-4 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="Memo">Memo</option>
          <option value="Business Letter">Business Letter</option>
        </select>

        <!-- Date Range Filter -->
        <div class="flex gap-2">
          <input
            type="date"
            :value="filters.dateRange.start"
            @input="updateDateRange('start', $event.target.value)"
            class="w-[140px] px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            :value="filters.dateRange.end"
            @input="updateDateRange('end', $event.target.value)"
            class="w-[140px] px-4 py-2 border rounded-md"
          />
        </div>
      </div>
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
  methods: {
    updateFilter(key, value) {
      this.$emit('update:filters', { ...this.filters, [key]: value });
    },
    updateDateRange(key, value) {
      this.$emit('update:filters', {
        ...this.filters,
        dateRange: {
          ...this.filters.dateRange,
          [key]: value
        }
      });
    }
  }
}
</script>