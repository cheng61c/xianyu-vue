import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.ts'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './i18n.js'
import { useDeviceStore } from '@/stores/device.js'
import Notifications from '@kyvg/vue3-notification'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'

const options = {
  maxToasts: 4,
  newestOnTop: true,
  containerClassName: ['text-white', 'mt-6'],
  timeout: 3000,
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Notifications)
app.use(Toast, options)

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
