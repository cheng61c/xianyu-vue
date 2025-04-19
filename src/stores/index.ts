import { createPinia } from 'pinia'

const pinia = createPinia()

// Pinia 持久化插件
pinia.use(({ store }) => {
  const storeKey = `pinia-${store.$id}`

  // 初始化时从 LocalStorage 加载状态
  const savedState = localStorage.getItem(storeKey)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 每次状态变化时保存到 LocalStorage
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(storeKey, JSON.stringify(state))
  })
})

export default pinia
