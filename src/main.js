import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import axios from 'axios'

// Configure axios globally
axios.defaults.baseURL = 'http://192.168.5.93:8000/api'
axios.defaults.withCredentials = true

const app = createApp(App)

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