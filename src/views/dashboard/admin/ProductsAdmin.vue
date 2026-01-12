<template>
  <div class="p-6 space-y-6 ">
    <h1 class="text-2xl font-bold">Admin · Products</h1>

    <!-- CREATE / EDIT -->
    <div class="bg-slate-800 text-white p-6 rounded-xl space-y-4">
      <h2 class="font-semibold">
        {{ editingProduct ? 'Edit product' : 'Create product' }}
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <input v-model="form.name" placeholder="Name" class="input" />
        <input v-model="form.description" placeholder="Description" class="input" />

        <select v-model="form.category_id" class="input">
          <option disabled value="">Select category</option>

          <option v-for="c in flatCategories" :key="c.id" :value="c.id">
            {{ c.label }}
          </option>
        </select>

        <input type="file" @change="handleImageUpload" class="text-gray-300" />
      </div>

      <div class="flex gap-2">
        <button class="btn-primary" @click="saveProduct">
          {{ editingProduct ? 'Update' : 'Create' }}
        </button>
        <button v-if="editingProduct" class="btn-gray" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>

    <!-- LIST -->
    <div class="grid text-white md:grid-cols-2 gap-6">
      <div v-for="p in products" :key="p.id" class="bg-slate-800 p-5 rounded-xl flex justify-between">
        <div class="cursor-pointer space-y-1" @click="$router.push(`/dashboard/admin/products/${p.id}`)">
          <h2 class="text-xl font-semibold">{{ p.name }}</h2>
          <p class="text-gray-400 text-sm">{{ p.description }}</p>

          <img v-if="p.image" :src="p.image" class="w-28 h-28 object-cover rounded mt-2" />
        </div>

        <div class="flex flex-col gap-2">
          <button class="btn-yellow" @click.stop="editProduct(p)">Edit</button>
          <button class="btn-red" @click.stop="deleteProduct(p.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api'

export default {
  data() {
    return {
      products: [],
      categories: [],
      flatCategories: [],
      editingProduct: null,
      form: {
        name: '',
        description: '',
        category_id: '',
        image: null,
      },
    }
  },

  mounted() {
    this.fetchProducts()
    this.fetchCategories()
  },

  methods: {
    async fetchProducts() {
      const { data } = await api.get('/products')
      this.products = data
    },

    async fetchCategories() {
      const { data } = await api.get('/categories')
      this.categories = data
      this.flatCategories = this.flattenCategories(data)
    },

    /* 🌳 TREE → FLAT */
    flattenCategories(categories, parent = null, level = 0) {
      let result = []

      categories
        .filter(c => c.parent_id === parent)
        .forEach(c => {
          result.push({
            id: c.id,
            label: `${'— '.repeat(level)}${c.name}`,
          })

          result.push(
            ...this.flattenCategories(categories, c.id, level + 1)
          )
        })

      return result
    },

    handleImageUpload(e) {
      this.form.image = e.target.files[0]
    },

    async saveProduct() {
      const fd = new FormData()
      fd.append('name', this.form.name)
      fd.append('description', this.form.description || '')
      fd.append('category_id', this.form.category_id)
      if (this.form.image) fd.append('image', this.form.image)

      if (this.editingProduct) {
        await api.post(`/products/${this.editingProduct.id}`, fd)
      } else {
        await api.post('/products', fd)
      }

      this.cancelEdit()
      this.fetchProducts()
    },

    editProduct(p) {
      this.editingProduct = p
      this.form = {
        name: p.name,
        description: p.description,
        category_id: p.category_id,
        image: null,
      }
    },

    cancelEdit() {
      this.editingProduct = null
      this.form = {
        name: '',
        description: '',
        category_id: '',
        image: null,
      }
    },

    async deleteProduct(id) {
      if (!confirm('Delete product?')) return
      await api.delete(`/products/${id}`)
      this.fetchProducts()
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
