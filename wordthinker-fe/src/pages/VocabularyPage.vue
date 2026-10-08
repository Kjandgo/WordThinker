<script setup>
import { ref } from 'vue'
import HeroSection from '@/components/vocabulary/HeroSection.vue'
import VocabularyStats from '@/components/vocabulary/VocabularyStats.vue'
import WordCollection from '@/components/vocabulary/WordCollection.vue'
import WordFormModal from '@/components/vocabulary/WordFormModal.vue'
import StudyModal from '@/components/vocabulary/StudyModal.vue'
import { useVocabulary } from '@/composables/useVocabulary'

const vocabulary = useVocabulary()
const formOpen = ref(false)
const studyOpen = ref(false)
const editingWord = ref(null)

function openForm(word = null) {
  editingWord.value = word
  formOpen.value = true
}
</script>

<template>
  <HeroSection
    :can-study="vocabulary.visibleWords.value.length > 0"
    @add="openForm()"
    @study="studyOpen = true"
  />
  <VocabularyStats
    :total="vocabulary.words.value.length"
    :learned="vocabulary.learnedCount.value"
    :progress="vocabulary.progress.value"
  />
  <WordCollection
    v-model:search="vocabulary.search.value"
    v-model:filter="vocabulary.filter.value"
    :words="vocabulary.visibleWords.value"
    :total="vocabulary.words.value.length"
    @add="openForm()"
    @edit="openForm"
    @remove="vocabulary.removeWord"
    @toggle="vocabulary.toggleLearned"
  />
  <WordFormModal
    v-if="formOpen"
    :word="editingWord"
    :words="vocabulary.words.value"
    @close="formOpen = false"
    @save="vocabulary.saveWord($event, editingWord?.id); formOpen = false"
  />
  <StudyModal
    v-if="studyOpen && vocabulary.visibleWords.value.length"
    :words="vocabulary.visibleWords.value"
    @close="studyOpen = false"
    @toggle="vocabulary.toggleLearned"
  />
</template>
