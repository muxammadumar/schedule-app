<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMealsStore } from '../stores/meals'
import api from '../api'

const store = useMealsStore()
const templates = ref([])
const loading = ref(true)
const addingMeal = ref(null) // { dayOfWeek, mealType }
const saving = ref(false)

const days = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
]

const GYM_DAYS = [1, 3, 5]
const mealTypeLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Pre-Gym Snack' }
const mealTypeIcon = { breakfast: '🍳', lunch: '🥘', dinner: '🍽️', snack: '🍌' }

onMounted(async () => {
  await store.fetchMyPlan()
  const { data } = await api.get('/meals/templates')
  templates.value = data
  loading.value = false
})

const selectedDay = computed({
  get: () => store.selectedDay,
  set: (v) => { store.selectedDay = v },
})

const mealsForDay = computed(() => store.getMealsForDay(selectedDay.value))

const isGymDay = computed(() => GYM_DAYS.includes(selectedDay.value))

function getTemplatesForSlot(dayOfWeek, mealType) {
  return templates.value.filter((t) => {
    if (t.mealType !== mealType) return false
    if (mealType === 'snack') return t.dayOfWeek === dayOfWeek
    return t.dayOfWeek === dayOfWeek || t.dayOfWeek === null
  })
}

async function setMeal(mealType, templateId) {
  saving.value = true
  try {
    await store.setMeal(selectedDay.value, mealType, templateId)
  } finally {
    saving.value = false
    addingMeal.value = null
  }
}

function totalMacros(meals) {
  return meals.reduce((acc, m) => {
    if (!m.meal?.macros) return acc
    return {
      kcal: acc.kcal + m.meal.macros.kcal,
      protein: acc.protein + m.meal.macros.protein,
    }
  }, { kcal: 0, protein: 0 })
}

const totals = computed(() => totalMacros(mealsForDay.value))
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Meals</h1>
      <p class="page-date" style="margin-top: 4px">Your weekly meal plan</p>
    </div>

    <!-- Day selector -->
    <div class="day-selector">
      <button
        v-for="d in days"
        :key="d.value"
        class="day-pill"
        :class="{ active: selectedDay === d.value }"
        @click="selectedDay = d.value"
      >
        {{ d.label }}
        <span v-if="GYM_DAYS.includes(d.value)" style="font-size: 0.65rem; margin-left: 2px">💪</span>
      </button>
    </div>

    <div v-if="loading" class="loading">Loading meals...</div>

    <template v-else>
      <!-- Daily totals -->
      <div class="card" style="background: rgba(79,142,247,0.06); border-color: rgba(79,142,247,0.2)">
        <div style="display: flex; gap: 20px; align-items: center">
          <div>
            <div style="font-size: 0.72rem; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em">Total Calories</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent)">{{ totals.kcal }}</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em">Protein</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--green)">{{ totals.protein }}g</div>
          </div>
          <div style="margin-left: auto">
            <span class="badge" :class="isGymDay ? 'badge-gym' : 'badge-rest'">
              {{ isGymDay ? '💪 Gym Day' : '😌 Rest Day' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Meal cards -->
      <div v-for="item in mealsForDay" :key="item.mealType" class="card">
        <div class="meal-type-label">{{ mealTypeIcon[item.mealType] }} {{ mealTypeLabel[item.mealType] }}</div>

        <div v-if="item.meal">
          <div style="font-weight: 600; font-size: 0.98rem; margin-bottom: 3px">{{ item.meal.name }}</div>
          <div style="font-size: 0.82rem; color: var(--text2); margin-bottom: 8px">{{ item.meal.description }}</div>
          <div class="macros">
            <div class="macro-chip">🔥 <span>{{ item.meal.macros.kcal }}</span> kcal</div>
            <div class="macro-chip">💪 <span>{{ item.meal.macros.protein }}g</span> protein</div>
            <div class="macro-chip">🌾 <span>{{ item.meal.macros.carbs }}g</span> carbs</div>
            <div class="macro-chip">🧈 <span>{{ item.meal.macros.fat }}g</span> fat</div>
          </div>
          <div class="source-tag">
            {{ item.meal.source === 'chef_catering' ? '🍳 Chef Catering' : '🏠 Home-cooked' }}
          </div>

          <!-- Change meal -->
          <div v-if="addingMeal?.mealType === item.mealType" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border)">
            <div style="font-size: 0.82rem; color: var(--text2); margin-bottom: 8px">Choose a meal:</div>
            <div
              v-for="t in getTemplatesForSlot(selectedDay, item.mealType)"
              :key="t.id"
              style="padding: 8px; border: 1px solid var(--border); border-radius: 10px; margin-bottom: 6px; cursor: pointer"
              :style="t.id === item.meal?.id ? 'border-color: var(--accent); background: rgba(79,142,247,0.08)' : ''"
              @click="setMeal(item.mealType, t.id)"
            >
              <div style="font-weight: 600; font-size: 0.88rem">{{ t.name }}</div>
              <div style="font-size: 0.75rem; color: var(--text2)">{{ t.macros.kcal }} kcal · {{ t.macros.protein }}g protein</div>
            </div>
            <button class="btn btn-outline btn-sm" style="margin-top: 4px" @click="addingMeal = null">Cancel</button>
          </div>
          <button
            v-else
            class="btn btn-outline btn-sm"
            style="margin-top: 10px"
            @click="addingMeal = { dayOfWeek: selectedDay, mealType: item.mealType }"
          >
            Change
          </button>
        </div>

        <div v-else style="color: var(--text2); font-size: 0.88rem">No meal set</div>
      </div>
    </template>
  </div>
</template>
