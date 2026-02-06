import axios from 'axios'

const api = axios.create({
  baseURL: 'http://dev.myapp.local/api',
  withCredentials: true, // 🔥 refresh cookie ketishi uchun
})

/**
 * Request interceptor
 * → access token qo‘shadi
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Refresh token (cookie orqali)
 */
async function refreshToken() {
  try {
    const res = await api.post('/auth/refresh')
    localStorage.setItem('token', res.data.access_token)
    return res.data.access_token
  } catch (e) {
    // refresh token ham yaroqsiz
    localStorage.removeItem('token')
    window.location.href = '/login'
    return null
  }
}

/**
 * Response interceptor
 * → 401 bo‘lsa refresh qiladi
 */
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      const newToken = await refreshToken()
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`
        return api.request(error.config)
      }
    }

    return Promise.reject(error)
  }
)

export default api
