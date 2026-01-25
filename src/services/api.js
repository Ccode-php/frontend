import axios from 'axios'

const api = axios.create({
  baseURL: '/api/auth', // backend URL
  //baseURL: import.meta.env.VITE_API_URL, // backend URL
})

// request interceptor: token qo'shish
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error));

export default api;
