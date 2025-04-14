<template>
  <div id="app">
    <nav class="bg-white border-b shadow-sm">
      <div class="container mx-auto">
        <div class="flex items-center justify-between px-4">
          <div class="flex space-x-8">
            <router-link 
              to="/letters" 
              class="px-6 py-5 text-lg font-semibold text-gray-800 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition-all duration-200 focus:outline-none"
              :class="{ 'text-blue-700 border-blue-700 bg-blue-50/30': $route.path === '/letters' }"
              :exact="true"
            >
              Letters Management
            </router-link>
            <router-link 
              to="/recipients" 
              class="px-6 py-5 text-lg font-semibold text-gray-800 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition-all duration-200 focus:outline-none"
              :class="{ 'text-blue-700 border-blue-700 bg-blue-50/30': $route.path === '/recipients' }"
            >
              Recipients Management
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Add your logo or additional navigation items here -->
          </div>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-8">
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
