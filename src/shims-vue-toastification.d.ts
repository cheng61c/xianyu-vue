// shims-vue-toastification.d.ts
declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  import { ToastOptions } from 'vue-toastification'
  const useToast: (options?: ToastOptions) => any
  export { useToast }

  const Toast: Plugin
  export default Toast
}
