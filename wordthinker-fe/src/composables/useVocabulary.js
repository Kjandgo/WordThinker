import { computed, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'wordy-vocabulary-v1'

export function useVocabulary() {
  const words = ref([])
  const search = ref('')
  const filter = ref('all')

  onMounted(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      words.value = Array.isArray(saved) ? saved : []
    } catch {
      words.value = []
    }
  })

  watch(words, value => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

  const visibleWords = computed(() => {
    const query = search.value.trim().toLowerCase()
    return words.value.filter(word => {
      const matchesState = filter.value === 'all' || (filter.value === 'learned' ? word.learned : !word.learned)
      const matchesQuery = !query || `${word.word} ${word.meaning} ${word.example}`.toLowerCase().includes(query)
      return matchesState && matchesQuery
    })
  })
  const learnedCount = computed(() => words.value.filter(word => word.learned).length)
  const progress = computed(() => words.value.length ? Math.round(learnedCount.value / words.value.length * 100) : 0)

  function saveWord(value, editingId) {
    if (editingId) Object.assign(words.value.find(word => word.id === editingId), value)
    else words.value.unshift({ id: crypto.randomUUID?.() || String(Date.now()), ...value, learned: false, createdAt: new Date().toISOString() })
  }
  function removeWord(word) {
    if (confirm(`“${word.word}” 단어를 삭제할까요?`)) words.value = words.value.filter(item => item.id !== word.id)
  }
  function toggleLearned(word) { word.learned = !word.learned }

  return { words, search, filter, visibleWords, learnedCount, progress, saveWord, removeWord, toggleLearned }
}
