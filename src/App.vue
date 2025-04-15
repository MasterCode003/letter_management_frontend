<template>
  <div id="app">
    <nav class="bg-white border-b shadow-sm">
      <div class="container mx-auto">
        <div class="flex items-center justify-between px-4">
          <div class="flex space-x-4">
            <router-link 
              to="/letters" 
              class="px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 border-b-2"
              :class="{ 
                'text-blue-700 border-blue-700': $route.path === '/letters',
                'text-gray-600 hover:text-blue-700 border-transparent': $route.path !== '/letters'
              }"
              exact
            >
              Letters
            </router-link>
            <router-link 
              to="/recipients" 
              class="px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 border-b-2"
              :class="{ 
                'text-blue-700 border-blue-700': $route.path === '/recipients',
                'text-gray-600 hover:text-blue-700 border-transparent': $route.path !== '/recipients'
              }"
            >
              Recipients
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
