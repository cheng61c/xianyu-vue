// i18n.ts
import { createI18n } from 'vue-i18n'
import zh from './lang/zh.json'
import en from './lang/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    zh,
    en,
  },
})

export default i18n
