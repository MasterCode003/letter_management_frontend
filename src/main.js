import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import apiClient from './utils/apiClient'

const app = createApp(App)
app.use(router)
app.component('QuillEditor', QuillEditor)  // Register QuillEditor as a global component
app.mount('#app')