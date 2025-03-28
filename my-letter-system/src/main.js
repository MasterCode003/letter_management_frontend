import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

// Prism
import Prism from 'prismjs'
// highlight code
import 'prismjs/components/prism-json'

VMdEditor.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    json: 'json'
  }
})

// Set language to English
VMdEditor.lang.use('en-US', enUS)

const app = createApp(App)
app.use(VMdEditor)
app.mount('#app')
