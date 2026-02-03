import axios from 'axios'

const api = axios.create({
  baseURL: 'http://dev.myapp.local/api',
})

// Token qo'shish
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// Refresh token funksiyasi
async function refreshToken() {
  try {
    const refresh_token = localStorage.getItem('refresh_token')
    const res = await api.post('/auth/refresh', { refresh_token })
    localStorage.setItem('token', res.data.access_token)
    localStorage.setItem('refresh_token', res.data.refresh_token)
    return res.data.access_token
  } catch (e) {
    console.error('Refresh token xato', e)
    // Agar refresh token xato bo‘lsa, logout qilishingiz mumkin
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  }
}

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) { // access token expired
      const newToken = await refreshToken()
      if (newToken) {
        error.config.headers['Authorization'] = `Bearer ${newToken}`
        return api.request(error.config)
      }
    }
    return Promise.reject(error)
  }
)

export default api
