import { createRouter, createWebHistory } from 'vue-router'
import LetterTable from '@/components/letter-table/LetterTable.vue'
import RecipientTable from '@/components/recipient-table/RecipientTable.vue'

const routes = [
  {
    path: '/',
    redirect: '/letters'  // Add this redirect
  },
  {
    path: '/letters',
    name: 'Letters',
    component: LetterTable
  },
  {
    path: '/recipients',
    name: 'Recipients',
    component: RecipientTable
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router