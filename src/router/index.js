import { createRouter, createWebHistory } from 'vue-router'
import LetterTable from '../components/LetterTable.vue'
import RecipientTable from '../components/RecipientTable.vue'
import LetterForm from '../components/LetterForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/letters'
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
  },
  {
    path: '/letter/create',
    name: 'CreateLetter',
    component: LetterForm
  },
  {
    path: '/letter/edit/:id',
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