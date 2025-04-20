import { useToast } from 'vue-toastification'

class ToastService {
  readonly options
  readonly toast
  constructor() {
    this.options = {
      className: 'h-10',
    }
    this.toast = useToast()
  }

  success(message: string, options: any) {
    const toastInstance = this.toast(message, { ...options, ...this.options })
    toastInstance.success()
  }
  error(message: string, options: any) {
    const toastInstance = this.toast.error(message, {
      ...options,
      ...this.options,
    })
    toastInstance.error()
  }
  info(message: string, options: any) {
    const toastInstance = this.toast(message, { ...options, ...this.options })
    toastInstance.info()
  }
  warning(message: string, options: any) {
    const toastInstance = this.toast(message, { ...options, ...this.options })
    toastInstance.warning()
  }
}
export default ToastService
