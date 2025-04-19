import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.ts'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './i18n.js'
import { useDeviceStore } from '@/stores/device.js'
import './style.css'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
const deviceStore = useDeviceStore()
const userAgent = navigator.userAgent.toLowerCase()
if (
  userAgent.match(/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i)
) {
  deviceStore.device = 1
} else {
  deviceStore.device = 2
}
app.mount('#app')
