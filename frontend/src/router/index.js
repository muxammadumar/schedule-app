import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue'), meta: { public: true } },
  { path: '/register', component: () => import('../views/Register.vue'), meta: { public: true } },
  { path: '/', redirect: '/today' },
  { path: '/today', component: () => import('../views/Today.vue') },
  { path: '/schedule', component: () => import('../views/Schedule.vue') },
  { path: '/workouts', component: () => import('../views/Workouts.vue') },
  { path: '/meals', component: () => import('../views/Meals.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return '/login'
  if (to.meta.public && auth.isAuthenticated && (to.path === '/login' || to.path === '/register')) return '/today'
})

export default router
