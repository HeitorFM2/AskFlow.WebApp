import axios from 'axios'
import { Notify } from 'quasar'
import { i18n } from 'src/i18n'

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

function redirectToLogin() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/#/login'
}

const api = axios.create({
  baseURL: process.env.VUE_APP_API || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request: inject Bearer token ────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response: handle 401 with silent refresh ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/Auth/Logout')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        isRefreshing = false
        processQueue(error)
        redirectToLogin()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${process.env.VUE_APP_API || 'http://localhost:5000'}/api/v2/Auth/RefreshToken`,
          { refreshToken }
        )
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
        processQueue(null, data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError)
        redirectToLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ─── Global error feedback ────────────────────────────────────────────────
    const { t } = i18n.global
    if (error.response?.status === 429) {
      Notify.create({ type: 'warning', message: t('errors.tooManyRequests') })
    } else if (error.response?.status >= 500) {
      Notify.create({ type: 'negative', message: t('errors.serverError') })
    }

    return Promise.reject(error)
  }
)

export { api }
