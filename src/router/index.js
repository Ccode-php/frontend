import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// auth
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

// user
import DashboardHome from '../views/dashboard/DashboardHome.vue'
import Orders from '../views/dashboard/Orders.vue'
import Products from '../views/dashboard/Products.vue'
import ProductShow from '../views/dashboard/ProductShow.vue'

// admin
import ProductsAdmin from '../views/dashboard/admin/ProductsAdmin.vue'
import ProductShowAdmin from '../views/dashboard/admin/ProductShowAdmin.vue'
import categoryAdmin from '../views/dashboard/admin/categoryAdmin.vue'


const routes = [
  { path: '/', redirect: '/login' },

  // AUTH
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: Register },
    ],
  },

  // DASHBOARD
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      // USER
      { path: '', name: 'dashboard.home', component: DashboardHome },
      { path: 'orders', component: Orders },
      { path: 'products', component: Products },
      {
        path: 'products/:id',
        name: 'dashboard.product.show',
        component: ProductShow,
      },

      // ADMIN
      {
        path: 'admin/products',
        name: 'admin.products',
        component: ProductsAdmin,
      },
      {
        path: 'admin/products/:id',
        name: 'admin.product.show',
        component: ProductShowAdmin,
        props: true,
      },
      {
        path: '/dashboard/admin/categories',
        name: 'admin.categoryAdmin',
        component: categoryAdmin,
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * NAVIGATION GUARD
 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // dashboardga token siz kirmaydi
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // login / registerga token bo‘lsa kirmaydi
  if (
    (to.name === 'login' || to.name === 'register') &&
    token
  ) {
    return next('/dashboard')
  }

  next()
})

export default router
