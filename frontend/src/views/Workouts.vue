<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWorkoutsStore } from '../stores/workouts'

const store = useWorkoutsStore()
const expanded = ref({})
const loading = ref(true)

onMounted(async () => {
  await store.fetchTemplates()
  loading.value = false
})

function toggle(id) {
  expanded.value[id] = !expanded.value[id]
}

// Strength workouts (Mon/Wed/Fri)
const strengthWorkouts = computed(() =>
  store.templates.filter((t) => t.type === 'strength').sort((a, b) => {
    const order = { 1: 0, 3: 1, 5: 2 }
    return (order[a.dayOfWeek] ?? 9) - (order[b.dayOfWeek] ?? 9)
  }),
)

const morningRun = computed(() => store.templates.find((t) => t.type === 'cardio'))

const dayName = { 1: 'Monday', 3: 'Wednesday', 5: 'Friday' }
const dayBadge = { 1: 'Mon', 3: 'Wed', 5: 'Fri' }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Workouts</h1>
      <p class="page-date" style="margin-top: 4px">Your weekly program</p>
    </div>

    <div v-if="loading" class="loading">Loading workouts...</div>

    <template v-else>
      <!-- Morning Run -->
      <div v-if="morningRun" class="card">
        <div class="card-header" @click="toggle('run')">
          <div>
            <div class="meal-type-label">Gym Days · 6:15am</div>
            <div style="font-weight: 700; font-size: 1rem">🏃 {{ morningRun.name }}</div>
            <div style="font-size: 0.82rem; color: var(--text2); margin-top: 2px">{{ morningRun.description }}</div>
          </div>
          <span class="expand-arrow" :class="{ open: expanded['run'] }">▼</span>
        </div>
        <div v-if="expanded['run']" class="expand-content">
          <div v-for="ex in morningRun.exercises" :key="ex.name" class="exercise-row">
            <span>{{ ex.name }}</span>
            <span class="exercise-sets">{{ ex.reps }}</span>
          </div>
        </div>
      </div>

      <!-- Strength sessions -->
      <div v-for="w in strengthWorkouts" :key="w.id" class="card">
        <div class="card-header" @click="toggle(w.id)">
          <div>
            <div class="meal-type-label">{{ dayName[w.dayOfWeek] }}</div>
            <div style="font-weight: 700; font-size: 1rem">💪 {{ w.name }}</div>
            <div style="font-size: 0.82rem; color: var(--text2); margin-top: 2px">{{ w.description }}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="badge badge-gym">{{ dayBadge[w.dayOfWeek] }}</span>
            <span class="expand-arrow" :class="{ open: expanded[w.id] }">▼</span>
          </div>
        </div>
        <div v-if="expanded[w.id]" class="expand-content">
          <div v-for="ex in w.exercises" :key="ex.name" class="exercise-row">
            <span>{{ ex.name }}</span>
            <span class="exercise-sets">{{ ex.sets }}×{{ ex.reps }}</span>
          </div>
        </div>
      </div>

      <!-- Rest days -->
      <div class="card" style="border-color: rgba(52,199,89,0.2)">
        <div class="section-title" style="margin-bottom: 6px">😌 Rest Days</div>
        <p style="font-size: 0.88rem; color: var(--text2)">
          Tue &amp; Thu — Active rest. 20-min walk in the evening to keep moving without overloading recovery.
        </p>
      </div>

      <!-- Weekend -->
      <div class="card" style="border-color: rgba(255,159,10,0.2)">
        <div class="section-title" style="margin-bottom: 6px">🏖️ Weekend</div>
        <p style="font-size: 0.88rem; color: var(--text2)">
          Sat &amp; Sun — Full rest. Optional walk or light activity. Focus on recovery, sleep, and meal prep.
        </p>
      </div>
    </template>
  </div>
</template>
