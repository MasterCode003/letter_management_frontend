import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.snow.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import apiClient from './utils/apiClient'
import '@/assets/styles/quill-font.css'

const app = createApp(App)

// Register global properties
app.config.globalProperties.$http = apiClient

// Register QuillEditor globally
app.component('QuillEditor', QuillEditor)

// Configure toast notifications
app.use(Toast, {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
})

app.use(router)
app.mount('#app')