<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(email.value, password.value, name.value)
    router.push('/today')
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-logo">Planner 🏋️</div>
    <p class="auth-sub">Create your account to get started</p>

    <form @submit.prevent="submit">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input v-model="name" type="text" class="form-input" placeholder="Your name" required autocomplete="name" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-input" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password" />
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top: 8px" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="auth-switch">
      Already have an account? <a @click="$router.push('/login')">Sign in</a>
    </p>
  </div>
</template>
