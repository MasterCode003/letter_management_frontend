import { createRouter, createWebHistory } from 'vue-router'
import LettersTable from '../components/LettersTable.vue'
import RecipientsTable from '../components/RecipientsTable.vue'
import LetterForm from '../components/LetterForm.vue'

const routes = [
  {
    path: '/letters',
    name: 'Letters',
    component: LettersTable
  },
  {
    path: '/recipients',
    name: 'Recipients',
    component: RecipientsTable
  },
  {
    path: '/letters/new',
    name: 'NewLetter',
    component: LetterForm
  },
  {
    path: '/letters/:id/edit',
    name: 'EditLetter',
    component: LetterForm,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router