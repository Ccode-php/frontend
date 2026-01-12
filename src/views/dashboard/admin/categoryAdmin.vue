<template>
    <div class="p-6 space-y-6 text-white">
      <h1 class="text-2xl font-bold">Admin · Categories</h1>
  
      <!-- CREATE / EDIT -->
      <div class="bg-slate-800 p-6 rounded-xl space-y-4">
        <h2 class="font-semibold">
          {{ editing ? 'Edit category' : 'Create category' }}
        </h2>
  
        <div class="grid md:grid-cols-2 gap-4">
          <input
            v-model="form.name"
            placeholder="Category name"
            class="input"
          />
  
          <select v-model="form.parent_id" class="input">
            <option :value="null">— No parent —</option>
  
            <option
              v-for="c in flatCategories"
              :key="c.id"
              :value="c.id"
              :disabled="editing && c.id === editing.id"
            >
              {{ c.label }}
            </option>
          </select>
        </div>
  
        <div class="flex gap-2">
          <button class="btn-primary" @click="saveCategory">
            {{ editing ? 'Update' : 'Create' }}
          </button>
  
          <button
            v-if="editing"
            class="btn-gray"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </div>
  
      <!-- LIST -->
      <div class="bg-slate-800 p-6 rounded-xl space-y-3">
        <h2 class="font-semibold">Categories</h2>
  
        <div
          v-for="c in flatCategories"
          :key="c.id"
          class="flex justify-between bg-slate-900 p-3 rounded"
        >
          <span>{{ c.label }}</span>
  
          <div class="flex gap-2">
            <button class="btn-yellow text-sm" @click="editCategory(c.raw)">
              Edit
            </button>
  
            <button class="btn-red text-sm" @click="deleteCategory(c.id)">
              Delete
            </button>
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
        categories: [],
        flatCategories: [],
        editing: null,
        form: {
          name: '',
          parent_id: null,
        },
      }
    },
  
    mounted() {
      this.fetchCategories()
    },
  
    methods: {
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
              raw: c,
            })
  
            result.push(
              ...this.flattenCategories(categories, c.id, level + 1)
            )
          })
  
        return result
      },
  
      async saveCategory() {
        if (this.editing) {
          await api.put(`/categories/${this.editing.id}`, this.form)
        } else {
          await api.post('/categories', this.form)
        }
  
        this.cancelEdit()
        this.fetchCategories()
      },
  
      editCategory(category) {
        this.editing = category
        this.form = {
          name: category.name,
          parent_id: category.parent_id,
        }
      },
  
      cancelEdit() {
        this.editing = null
        this.form = { name: '', parent_id: null }
      },
  
      async deleteCategory(id) {
        if (!confirm('Delete category?')) return
        await api.delete(`/categories/${id}`)
        this.fetchCategories()
      },
    },
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full px-4 py-3 rounded-lg bg-slate-700 text-white
           placeholder-gray-400 outline-none
           focus:ring-2 focus:ring-blue-500;
  }
  
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium;
  }
  
  .btn-yellow {
    @apply bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded-lg font-medium;
  }
  
  .btn-red {
    @apply bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg font-medium;
  }
  
  .btn-gray {
    @apply bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded-lg font-medium;
  }
  </style>
  