<script setup>
const gymTimeline = [
  { time: '6:00', task: 'Wake up' },
  { time: '6:15', task: 'Morning run — 5km easy pace' },
  { time: '7:00', task: 'Shower + breakfast (eggs + kefir)' },
  { time: '10:00', task: 'Work starts' },
  { time: '13:00', task: 'Lunch (Chef Catering)' },
  { time: '13:30', task: '10-min walk after lunch' },
  { time: '14:00', task: 'Back to work' },
  { time: '17:30', task: 'Pre-gym snack (banana + kefir) + leave for gym' },
  { time: '18:00', task: 'Gym session (~90 min)' },
  { time: '19:30', task: 'Work ends / return home' },
  { time: '20:00', task: 'Dinner (home-cooked)' },
  { time: '22:00', task: 'Wind down — no screens' },
  { time: '23:00', task: 'In bed' },
]

const restTimeline = [
  { time: '7:00', task: 'Wake up' },
  { time: '7:30', task: 'Breakfast (eggs + kefir)' },
  { time: '10:00', task: 'Work starts' },
  { time: '13:00', task: 'Lunch (Chef Catering)' },
  { time: '13:30', task: '10-min walk after lunch' },
  { time: '14:00', task: 'Back to work' },
  { time: '19:00', task: 'Work ends' },
  { time: '19:30', task: 'Dinner (home-cooked)' },
  { time: '20:00', task: '20-min evening walk' },
  { time: '22:00', task: 'Wind down — no screens' },
  { time: '23:00', task: 'In bed' },
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Schedule</h1>
      <p class="page-date" style="margin-top: 4px">Your daily templates</p>
    </div>

    <!-- Gym Day -->
    <div class="card">
      <div class="section-header" style="margin-bottom: 12px">
        <span class="section-title">💪 Gym Day</span>
        <span class="badge badge-gym">Mon · Wed · Fri</span>
      </div>
      <div class="timeline">
        <div v-for="item in gymTimeline" :key="item.time" class="timeline-item">
          <div class="timeline-time">{{ item.time }}</div>
          <div class="timeline-dot"></div>
          <div class="timeline-task">{{ item.task }}</div>
        </div>
      </div>
    </div>

    <!-- Rest Day -->
    <div class="card">
      <div class="section-header" style="margin-bottom: 12px">
        <span class="section-title">😌 Rest Day</span>
        <span class="badge badge-rest">Tue · Thu</span>
      </div>
      <div class="timeline">
        <div v-for="item in restTimeline" :key="item.time" class="timeline-item">
          <div class="timeline-time">{{ item.time }}</div>
          <div class="timeline-dot"></div>
          <div class="timeline-task">{{ item.task }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
