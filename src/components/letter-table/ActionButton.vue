<template>
  <button 
    :class="[
      'inline-flex items-center justify-center rounded-lg',
      'w-10 h-10 mx-1',
      'transition-all duration-200 ease-in-out',
      'hover:shadow-md active:scale-95',
      variantClasses[variant]
    ]"
  >
    <slot>
      <!-- Default icons based on variant -->
      <template v-if="variant === 'edit'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
          <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"></path>
            <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3"></path>
            <path d="M16 5l3 3"></path>
          </g>
        </svg>
      </template>
      
      <template v-else-if="variant === 'delete'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6">
          <rect x="32" y="48" width="448" height="80" rx="32" ry="32" fill="currentColor"></rect>
          <path d="M74.45 160a8 8 0 0 0-8 8.83l26.31 252.56a1.5 1.5 0 0 0 0 .22A48 48 0 0 0 140.45 464h231.09a48 48 0 0 0 47.67-42.39v-.21l26.27-252.57a8 8 0 0 0-8-8.83zm248.86 180.69a16 16 0 1 1-22.63 22.62L256 318.63l-44.69 44.68a16 16 0 0 1-22.63-22.62L233.37 296l-44.69-44.69a16 16 0 0 1 22.63-22.62L256 273.37l44.68-44.68a16 16 0 0 1 22.63 22.62L278.62 296z" fill="currentColor"></path>
        </svg>
      </template>

      <template v-else-if="variant === 'preview'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6">
          <path d="M307.94 248L216 154.52V242a6 6 0 0 0 6 6z" fill="currentColor"></path>
          <path d="M184 268V144H60a12 12 0 0 0-12 12v328a12 12 0 0 0 12 12h248a12 12 0 0 0 12-12V280H196a12 12 0 0 1-12-12z" fill="currentColor"></path>
          <path d="M366 120h85.94L360 26.52V114a6 6 0 0 0 6 6z" fill="currentColor"></path>
          <path d="M340 152a12 12 0 0 1-12-12V16H172a12 12 0 0 0-12 12v84h42.12A40.81 40.81 0 0 1 231 124.14l109.16 111a41.11 41.11 0 0 1 11.83 29V400H452a12 12 0 0 0 12-12V152z" fill="currentColor"></path>
        </svg>
      </template>
    </slot>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    variantClasses() {
      return {
        edit: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200',
        preview: 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200',
        delete: 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200',
        default: 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 border border-gray-200'
      }
    }
  }
}
</script>

<style scoped>
button {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>