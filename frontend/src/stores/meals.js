import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useMealsStore = defineStore('meals', () => {
  const templates = ref([])
  const myPlan = ref([])
  const selectedDay = ref(new Date().getDay()) // 0=Sun, 1=Mon...

  async function fetchTemplates() {
    const { data } = await api.get('/meals/templates')
    templates.value = data
  }

  async function fetchMyPlan() {
    const { data } = await api.get('/meals/my-plan')
    myPlan.value = data
  }

  async function setMeal(dayOfWeek, mealType, mealTemplateId) {
    await api.post('/meals/my-plan', { dayOfWeek, mealType, mealTemplateId })
    await fetchMyPlan()
  }

  function getMealsForDay(day) {
    const dayEntry = myPlan.value.find((d) => d.dayOfWeek === day)
    return dayEntry ? dayEntry.meals : []
  }

  return { templates, myPlan, selectedDay, fetchTemplates, fetchMyPlan, setMeal, getMealsForDay }
})
