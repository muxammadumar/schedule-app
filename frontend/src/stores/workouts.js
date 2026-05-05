import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useWorkoutsStore = defineStore('workouts', () => {
  const templates = ref([])
  const mySchedule = ref([])

  async function fetchTemplates() {
    const { data } = await api.get('/workouts/templates')
    templates.value = data
  }

  async function fetchMySchedule() {
    const { data } = await api.get('/workouts/my-schedule')
    mySchedule.value = data
  }

  async function setWorkout(dayOfWeek, workoutTemplateId) {
    await api.post('/workouts/my-schedule', { dayOfWeek, workoutTemplateId })
    await fetchMySchedule()
  }

  return { templates, mySchedule, fetchTemplates, fetchMySchedule, setWorkout }
})
