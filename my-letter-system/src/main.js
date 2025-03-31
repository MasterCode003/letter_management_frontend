import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LetterForm from './components/LetterForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LetterForm
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
