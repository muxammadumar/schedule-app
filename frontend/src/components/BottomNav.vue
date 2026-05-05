<script setup>
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()

const tabs = [
  { path: '/today', icon: '☀️', label: 'Today' },
  { path: '/schedule', icon: '📅', label: 'Schedule' },
  { path: '/workouts', icon: '💪', label: 'Workouts' },
  { path: '/meals', icon: '🍽️', label: 'Meals' },
]
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="nav-item"
      :class="{ active: route.path === tab.path }"
    >
      <span class="nav-icon">{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>
