import axios from 'axios'

const api = axios.create({
  baseURL: 'http://dev.myapp.local/api',
})

function isTokenExpired(token) {
  if (!token) return true
  const payload = JSON.parse(atob(token.split('.')[1]))
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token')
  if (!refresh_token) return null

  try {
    const res = await axios.post(
      'http://dev.myapp.local/api/auth/refresh',
      { refresh_token }
    )

    localStorage.setItem('token', res.data.access_token)
    localStorage.setItem('refresh_token', res.data.refresh_token)

    return res.data.access_token
  } catch (e) {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
    return null
  }
}

/**
 * REQUEST interceptor
 */
api.interceptors.request.use(async config => {
  let token = localStorage.getItem('token')

  if (token && isTokenExpired(token)) {
    token = await refreshToken()
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * RESPONSE interceptor (fallback)
 */
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
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
