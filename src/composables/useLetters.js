import { ref } from 'vue'
import { apiClient } from '@/utils/api'

export function useLetters() {
  const letters = ref([])
  const isFetching = ref(false)

  // ... implement all letter-related methods here
  
  return {
    letters,
    isFetching,
    fetchLetters,
    addLetter,
    updateLetter,
    deleteLetter,
    previewLetter,
    downloadLetter,
    exportToWord
  }
}