<template>
  <div class="p-6 space-y-6 text-white">
    <button class="btn-gray" @click="$router.back()">← Back</button>

    <!-- PRODUCT -->
    <div class="bg-slate-800 p-6 rounded-xl space-y-3">
      <h1 class="text-2xl font-bold">{{ product.name }}</h1>
      <img v-if="product.image" :src="product.image" class="w-40 rounded" />
    </div>

    <!-- VARIANTS -->
    <div class="bg-slate-800 p-6 rounded-xl space-y-4">
      <h2 class="font-semibold">Variants</h2>

      <!-- LIST -->
      <div v-for="v in variants" :key="v.id" class="bg-slate-900 p-3 rounded flex justify-between items-center">
        <span class="text-gray-300">
          {{ v.variant }} · {{ v.price }} so‘m · stock {{ v.stock }}
        </span>

        <div class="flex gap-2">
          <button class="btn-yellow text-sm" @click="editVariant(v)">
            Edit
          </button>
          <button class="btn-red text-sm" @click="deleteVariant(v.id)">
            Delete
          </button>
        </div>
      </div>

      <!-- FORM -->
      <div class="grid md:grid-cols-6 gap-3 items-end pt-4 border-t border-slate-700">
        <input v-model="form.variant" placeholder="Variant" class="input md:col-span-2" />
        <input v-model.number="form.price" type="number" placeholder="Price" class="input" />
        <input v-model.number="form.stock" type="number" placeholder="Stock" class="input" />

        <button class="btn-primary md:col-span-2 h-[48px]" @click="saveVariant">
          {{ editingVariant ? 'Update variant' : 'Add variant' }}
        </button>

        <button v-if="editingVariant" class="btn-gray md:col-span-2 h-[48px]" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api'

export default {
  props: ['id'],

  data() {
    return {
      product: {},
      variants: [],
      editingVariant: null,
      form: {
        variant: '',
        price: 0,
        stock: 0,
      },
    }
  },

  mounted() {
    this.fetchProduct()
  },

  methods: {
    async fetchProduct() {
      const { data } = await api.get(`/products/${this.id}`)
      this.product = data
      this.variants = data.variants
    },

    editVariant(v) {
      this.editingVariant = v
      this.form = {
        variant: v.variant,
        price: v.price,
        stock: v.stock,
      }
    },

    cancelEdit() {
      this.editingVariant = null
      this.form = { variant: '', price: 0, stock: 0 }
    },

    async saveVariant() {
      if (this.editingVariant) {
        // UPDATE
        await api.put(`/variants/${this.editingVariant.id}`, {
          product_id: this.id,  // 🔹 yuboriladi
          ...this.form,
        })
      } else {
        // CREATE
        await api.post('/variants', {
          product_id: this.id,
          ...this.form,
        })
      }

      this.cancelEdit()
      this.fetchProduct()
    },

    async deleteVariant(id) {
      if (!confirm('Delete variant?')) return
      await api.delete(`/variants/${id}`)
      this.fetchProduct()
    },
  },
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition;
}

.btn-yellow {
  @apply bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded-lg font-medium transition;
}

.btn-red {
  @apply bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg font-medium transition;
}

.btn-gray {
  @apply bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded-lg font-medium transition;
}
</style>
