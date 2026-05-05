import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useChecklistStore = defineStore('checklist', () => {
  const checklist = ref(null)

  async function fetchToday() {
    const { data } = await api.get('/checklist/today')
    checklist.value = data
  }

  async function toggleTask(task, completed) {
    const { data } = await api.patch('/checklist/today', { task, completed })
    checklist.value = data
  }

  return { checklist, fetchToday, toggleTask }
})
