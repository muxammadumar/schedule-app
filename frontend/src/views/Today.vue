<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import { useChecklistStore } from '../stores/checklist'

const checklist = useChecklistStore()
const today = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/schedule/today')
    today.value = data
    await checklist.fetchToday()
  } finally {
    loading.value = false
  }
})

async function toggle(task) {
  const current = checklist.checklist?.tasks?.[task]
  await checklist.toggleTask(task, !current)
}

const dayBadgeClass = computed(() => {
  if (!today.value) return ''
  return { gym: 'badge-gym', rest: 'badge-rest', weekend: 'badge-weekend' }[today.value.dayType] || ''
})

const mealTypeLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Pre-Gym Snack' }

const taskLabels = {
  morningRun: '🏃 Morning run (5km)',
  gymSession: '💪 Gym session',
  water3L: '💧 Drink 3L water',
  lunchWalk: '🚶 10-min walk after lunch',
  bedBy11: '🌙 In bed by 11pm',
}
</script>

<template>
  <div class="page">
    <div v-if="loading" class="loading">Loading today...</div>

    <template v-else-if="today">
      <!-- Header -->
      <div class="page-header">
        <p class="page-date">{{ today.date }}</p>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px">
          <h1 class="page-title">{{ today.dayName }}</h1>
          <span class="badge" :class="dayBadgeClass">
            {{ today.dayType === 'gym' ? '💪 Gym Day' : today.dayType === 'rest' ? '😌 Rest Day' : '🏖️ Weekend' }}
          </span>
        </div>
      </div>

      <!-- Streak -->
      <div class="streak-bar">
        <div class="streak-num">{{ checklist.checklist?.streak ?? 0 }}</div>
        <div>
          <div class="streak-title">Day Streak 🔥</div>
          <div class="streak-label">Keep it up!</div>
        </div>
      </div>

      <!-- Checklist -->
      <div class="card">
        <div class="section-header">
          <span class="section-title">Today's Habits</span>
        </div>
        <div
          v-for="(label, task) in taskLabels"
          :key="task"
          v-show="checklist.checklist?.tasks && task in checklist.checklist.tasks"
        >
          <div class="checklist-item" @click="toggle(task)">
            <div class="check-box" :class="{ checked: checklist.checklist?.tasks?.[task] }">
              {{ checklist.checklist?.tasks?.[task] ? '✓' : '' }}
            </div>
            <span class="check-label" :class="{ done: checklist.checklist?.tasks?.[task] }">{{ label }}</span>
          </div>
        </div>
      </div>

      <!-- Today's Meals -->
      <div class="card">
        <div class="section-header" style="margin-bottom: 12px">
          <span class="section-title">Today's Meals</span>
        </div>
        <div v-for="item in today.meals" :key="item.mealType">
          <div v-if="item.meal" style="margin-bottom: 14px">
            <div class="meal-type-label">{{ mealTypeLabel[item.mealType] }}</div>
            <div style="font-weight: 600; font-size: 0.95rem">{{ item.meal.name }}</div>
            <div style="font-size: 0.82rem; color: var(--text2); margin-top: 2px">{{ item.meal.description }}</div>
            <div class="macros">
              <div class="macro-chip">🔥 <span>{{ item.meal.macros.kcal }}</span> kcal</div>
              <div class="macro-chip">💪 <span>{{ item.meal.macros.protein }}g</span> protein</div>
              <div class="macro-chip">🌾 <span>{{ item.meal.macros.carbs }}g</span> carbs</div>
              <div class="macro-chip">🧈 <span>{{ item.meal.macros.fat }}g</span> fat</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card">
        <div class="section-header" style="margin-bottom: 12px">
          <span class="section-title">Today's Schedule</span>
        </div>
        <div class="timeline">
          <div v-for="item in today.timeline" :key="item.time" class="timeline-item">
            <div class="timeline-time">{{ item.time }}</div>
            <div class="timeline-dot"></div>
            <div class="timeline-task">{{ item.task }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
