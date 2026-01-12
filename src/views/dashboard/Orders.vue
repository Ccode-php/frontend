<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-white">My Orders</h1>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <div v-else-if="orders.length === 0" class="text-gray-400">
      No orders yet
    </div>

    <!-- ORDERS -->
    <div class="grid md:grid-cols-2 gap-6">
      <div v-for="o in orders" :key="o.id" class="bg-slate-800 p-6 rounded-xl space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-white font-semibold">
            Order #{{ o.id }}
          </h2>

          <span class="px-3 py-1 rounded-full text-sm font-medium" :class="statusClass(o.status)">
            {{ o.status }}
          </span>
        </div>

        <div class="text-gray-400 text-sm">
          {{ formatDate(o.created_at) }}
        </div>

        <div class="text-white text-lg font-bold">
          {{ o.total_price }} so‘m
        </div>

        <!-- ACTIONS -->
        <div class="flex gap-2">
          <button v-if="o.status === 'pending'" class="btn-primary" @click="payOrder(o.id)">
            Pay now
          </button>

          <button v-if="o.status === 'pending'" class="btn-gray" @click="cancelOrder(o.id)">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  data() {
    return {
      orders: [],
      loading: false,
    }
  },

  mounted() {
    this.fetchOrders()
  },

  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const { data } = await api.get('/orders')
        this.orders = data
      } finally {
        this.loading = false
      }
    },

    async payOrder(orderId) {
      if (!confirm('Proceed to payment?')) return

      const order = this.orders.find(o => o.id === orderId)
      if (!order) return alert('Order not found')

      await api.post('/payments', {
        order_id: orderId,
        amount: order.total_price,
        provider: 'fake', // hozircha
      })

      this.fetchOrders()
    },

    async cancelOrder(orderId) {
      if (!confirm('Cancel this order?')) return

      await api.post(`/orders/${orderId}/cancel`)
      this.fetchOrders()
    },

    statusClass(status) {
      return {
        pending: 'bg-yellow-500 text-black',
        paid: 'bg-green-600 text-white',
        cancelled: 'bg-red-600 text-white',
      }[status] || 'bg-gray-500 text-white'
    },

    formatDate(date) {
      return new Date(date).toLocaleString()
    },
  },
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium;
}

.btn-gray {
  @apply bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium;
}
</style>
