<template>
    <div>
      <button
        class="text-gray-400 mb-4 hover:underline"
        @click="$router.back()"
      >
        ← Back
      </button>
  
      <div v-if="loading" class="text-gray-400">Loading...</div>
  
      <div v-else-if="product" class="bg-slate-800 p-6 rounded-xl">
        <h1 class="text-2xl font-bold text-white mb-2">
          {{ product.name }}
        </h1>
  
        <p class="text-gray-400 mb-6">
          {{ product.description }}
        </p>
  
        <!-- VARIANTS -->
        <div
          v-for="variant in product.variants"
          :key="variant.id"
          class="bg-slate-900 p-4 rounded-lg mb-4"
        >
          <div class="flex justify-between mb-2">
            <div class="text-gray-200 font-medium">
              {{ variant.variant }}
            </div>
            <div class="text-gray-300">
              {{ variant.price }} so‘m
            </div>
          </div>
  
          <!-- QUANTITY -->
          <div class="flex items-center gap-3">
            <button
              class="px-3 py-1 bg-slate-700 rounded"
              @click="decrease(variant.id)"
            >−</button>
  
            <span class="text-white w-6 text-center">
              {{ quantities[variant.id] || 0 }}
            </span>
  
            <button
              class="px-3 py-1 bg-slate-700 rounded"
              @click="increase(variant.id, variant.stock)"
            >+</button>
  
            <span class="text-sm text-gray-400 ml-4">
              Stock: {{ variant.stock }}
            </span>
          </div>
        </div>
  
        <!-- GLOBAL BUY BUTTON -->
        <button
          class="w-full mt-6 bg-blue-600 hover:bg-blue-700
                 py-3 rounded-xl text-white font-semibold"
          @click="createOrder"
        >
          Create order
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../../services/api'
  
  export default {
    data() {
      return {
        product: null,
        loading: false,
        quantities: {}, // variant_id => quantity (default 0)
      }
    },
  
    mounted() {
      this.fetchProduct()
    },
  
    methods: {
      async fetchProduct() {
        this.loading = true
        const res = await api.get(`/products/${this.$route.params.id}`)
        this.product = res.data
        this.loading = false
      },
  
      increase(variantId, stock) {
        const current = this.quantities[variantId] || 0
        if (current < stock) {
          this.quantities[variantId] = current + 1
        }
      },
  
      decrease(variantId) {
        const current = this.quantities[variantId] || 0
        if (current > 0) {
          this.quantities[variantId] = current - 1
        }
      },
  
      async createOrder() {
        const items = Object.entries(this.quantities)
          .filter(([_, qty]) => qty > 0)
          .map(([variant_id, quantity]) => ({
            variant_id: Number(variant_id),
            quantity,
          }))
  
        if (!items.length) {
          alert('Kamida bitta variant tanlang')
          return
        }
  
        try {
          const res = await api.post('/orders', { items })
          alert('Order created. ID: ' + res.data.order.id)
          this.$router.push('/dashboard/orders')
        } catch (e) {
          alert(e.response?.data?.error || 'Error')
        }
      },
    },
  }
  </script>
  