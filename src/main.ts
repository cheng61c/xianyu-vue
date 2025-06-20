import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router/index.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './i18n.js'
import { useDeviceStore } from '@/stores/device.js'
import Notifications from '@kyvg/vue3-notification'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@cyhnkckali/vue3-color-picker/dist/style.css'
import './style.css'
import { useConfigStore } from './stores/configStore.js'

const options = {
  maxToasts: 4,
  newestOnTop: true,
  containerClassName: ['text-white', 'mt-6'],
  timeout: 3000,
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(Notifications)
app.use(Toast, options)
app.use(router)

// 加载配置
const configStore = useConfigStore()
configStore.loadRuntimeConfig()

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
