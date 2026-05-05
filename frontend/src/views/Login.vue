<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/today')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-logo">Planner 🏋️</div>
    <p class="auth-sub">Track your workouts, meals & habits</p>

    <form @submit.prevent="submit">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top: 8px" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="auth-switch">
      No account? <a @click="$router.push('/register')">Register</a>
    </p>
  </div>
</template>
