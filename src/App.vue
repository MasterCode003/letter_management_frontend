<template>
  <div id="app">
    <nav class="bg-white border-b shadow-sm p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex space-x-4">
          <router-link 
            to="/letters" 
            class="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200"
            active-class="text-blue-600 border-blue-600"
          >
            Letters
          </router-link>
          <router-link 
            to="/recipients" 
            class="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 border-b-2 border-transparent hover:border-green-600 transition-all duration-200"
            active-class="text-green-600 border-green-600"
          >
            Recipients
          </router-link>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>
