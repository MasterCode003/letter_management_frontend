import { createRouter, createWebHistory } from 'vue-router'
import LetterTable from '../components/letter-table/LetterTable.vue'
import RecipientTable from '../components/recipient-table/RecipientTable.vue'
import LetterModal from '../components/letter-table/LetterModal.vue'

const routes = [
  {
    path: '/letters',
    name: 'LetterTable',
    component: LetterTable,
    children: [
      {
        path: 'new',
        name: 'NewLetter',
        component: LetterModal
      },
      {
        path: 'edit/:id',
        name: 'EditLetter',
        component: LetterModal,
        props: true
      }
    ]
  },
  {
    path: '/recipients',
    name: 'RecipientTable',
    component: RecipientTable
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router