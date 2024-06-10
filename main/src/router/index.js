import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import MusicPage from '../views/MusicPage.vue'
import HousePage from '../views/HousePage.vue'
import BillPage from '../views/BillPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/music',
    name: 'music',
    component: MusicPage
  },
  {
    path: '/house',
    name: 'house',
    component: HousePage
  },
  {
    path: '/bill',
    name: 'bill',
    component: BillPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
