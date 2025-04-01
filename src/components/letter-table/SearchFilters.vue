<template>
  <div class="mb-6 bg-white rounded-lg shadow p-4">
    <div class="flex flex-wrap gap-4 items-center">
      <!-- Title Search -->
      <div class="flex-1 min-w-[200px]">
        <input
          :value="filters.searchQuery"
          @input="updateFilter('searchQuery', $event.target.value)"
          type="text"
          placeholder="Search by title..."
          class="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <!-- Subject Search -->
      <div class="flex-1 min-w-[200px]">
        <input
          :value="filters.searchSubject"
          @input="updateFilter('searchSubject', $event.target.value)"
          type="text"
          placeholder="Search by subject..."
          class="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <!-- Recipient Search -->
      <div class="flex-1 min-w-[200px]">
        <input
          :value="filters.searchRecipient"
          @input="updateFilter('searchRecipient', $event.target.value)"
          type="text"
          placeholder="Search by recipient..."
          class="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <!-- Type Filter -->
      <div class="w-[150px]">
        <select
          :value="filters.selectedType"
          @change="updateFilter('selectedType', $event.target.value)"
          class="w-full px-4 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="memo">Memo</option>
          <option value="business-letter">Business Letter</option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div class="flex gap-2">
        <input
          type="date"
          :value="filters.dateRange.start"
          @input="updateDateRange('start', $event.target.value)"
          class="w-[160px] px-4 py-2 border rounded-md"
        />
        <input
          type="date"
          :value="filters.dateRange.end"
          @input="updateDateRange('end', $event.target.value)"
          class="w-[160px] px-4 py-2 border rounded-md"
        />
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