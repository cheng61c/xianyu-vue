import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import pinia from './stores/index.js'
import {} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './i18n.js'

const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
