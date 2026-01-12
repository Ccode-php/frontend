<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Products</h1>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <div v-else class="grid md:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.id" class="bg-slate-800 p-4 rounded-xl cursor-pointer"
        @click="$router.push(`/dashboard/products/${product.id}`)">

        <img v-if="product.image" :src="product.image" class="w-full h-40 object-cover rounded-md mb-2" />

        <h2 class="text-xl font-bold text-white">{{ product.name }}</h2>
        <p class="text-gray-400 text-sm">{{ product.description }}</p>
        <p class="text-gray-300 text-sm">
          From {{ minPrice(product) }} so‘m
        </p>


      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  data() {
    return { products: [], loading: false }
  },

  mounted() {
    this.fetchProducts()
  },

  methods: {
    

    minPrice(product) {
        if (!product.variants || !product.variants.length) return 0;
        return Math.min(...product.variants.map(v => v.price));
      },
      
    async fetchProducts() {
      this.loading = true
      try {
        const res = await api.get('/products')
        this.products = res.data
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
