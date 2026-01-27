<template>
  <div>
    <div class="text-center space-y-2 mb-6">
      <h1 class="text-3xl font-bold text-white">MicroShop</h1>
      <p class="text-gray-400 text-sm">Create your account</p>
    </div>

    <div class="space-y-5">
      <input v-model="name" type="text" placeholder="Name"
        class="w-full px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      <input v-model="email" type="email" placeholder="Email"
        class="w-full px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      <input v-model="password" type="password" placeholder="••••••••"
        class="w-full px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

      <button @click="register" :disabled="loading"
        class="w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 transition text-white disabled:bg-gray-600">
        <span v-if="!loading">Register</span>
        <span v-else>Registering...</span>
      </button>

      <p class="mt-4 text-center text-gray-400 text-sm">
        Already have an account?
        <router-link class="text-blue-400 font-semibold" to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      loading: false,
      error: null,
    }
  },
  methods: {
    async register() {
      this.error = null
      this.loading = true
      try {
        await api.post('/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        alert('Registration successful! Please login.')
        this.$router.push('/login')
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
