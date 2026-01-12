<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside :class="['bg-gray-900 text-white flex flex-col transition-all', open ? 'w-64' : 'w-16']">
      <div class="p-6 text-xl font-bold border-b border-gray-800 flex justify-between items-center">
        <span v-if="open">MicroShop</span>
        <button @click="toggleSidebar" class="text-gray-400">☰</button>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link to="/dashboard" class="block p-2 rounded hover:bg-gray-800">Home</router-link>
        <router-link to="/dashboard/admin/products" class="block p-2 rounded hover:bg-gray-800">Products CRUD</router-link>
        <router-link to="/dashboard/admin/categories" class="block p-2 rounded hover:bg-gray-800">categories CRUD</router-link>
        <router-link to="/dashboard/products" class="block p-2 rounded hover:bg-gray-800">Products</router-link>
        <router-link to="/dashboard/orders" class="block p-2 rounded hover:bg-gray-800">Orders</router-link>
        
      </nav>
      <button @click="logout" class="m-4 p-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
    </aside>

    <!-- Content -->
    <main class="flex-1 p-6 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return { open: true }
  },
  methods: {
    toggleSidebar() { this.open = !this.open },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
