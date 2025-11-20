import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MarketCharts from '../views/MarketCharts.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/market',
    name: 'Market',
    component: MarketCharts
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
