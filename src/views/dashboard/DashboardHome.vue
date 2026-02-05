<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">
      Welcome, {{ user.name }}
    </h2>

    <p class="text-gray-700">
      Email: {{ user.email }}
    </p>
  </div>
</template>

<script>
import api from '../../services/api' // sizning api.js

export default {
  data() {
    return {
      user: {},
      loading: true,
    }
  },

  async mounted() {
    try {
      const res = await api.get('/auth/user')
      this.user = res.data
    } catch (e) {
      console.error('User olinmadi', e)
    } finally {
      this.loading = false
    }
  },
}
</script>
