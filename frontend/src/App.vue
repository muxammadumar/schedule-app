<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
const auth = useAuthStore()

const showNav = computed(() => auth.isAuthenticated && !route.meta.public)
</script>

<template>
  <RouterView />
  <BottomNav v-if="showNav" />
</template>
