import { createI18n } from 'vue-i18n'
import en from './en'
import ptBR from './pt-BR'

export const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'pt-BR',
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  messages: {
    en,
    'pt-BR': ptBR,
  },
})

export default i18n
