import { createApp } from 'vue';
import App from './App.vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import router from './router';
import './style.css';  // Add this line

const app = createApp(App);
app.component('MdEditor', MdEditor);
app.use(router);
app.mount('#app');
