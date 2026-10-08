<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ words: Array })
defineEmits(['close', 'toggle'])
const index = ref(0)
const flipped = ref(false)
const card = computed(() => props.words[index.value])
function next() { index.value = (index.value + 1) % props.words.length; flipped.value = false }
</script>

<template>
  <div class="backdrop" @mousedown.self="$emit('close')">
    <section class="study-modal">
      <button class="close" @click="$emit('close')">×</button>
      <header><b>FLASH CARD</b><small>{{ index + 1 }} / {{ words.length }}</small></header>
      <button class="flashcard" @click="flipped = !flipped">
        <small>{{ flipped ? 'MEANING' : 'WORD' }}</small><strong>{{ flipped ? card.meaning : card.word }}</strong>
        <p v-if="flipped && card.example">“{{ card.example }}”</p><span>{{ flipped ? '카드를 눌러 단어 보기' : '카드를 눌러 뜻 보기'
          }}</span>
      </button>
      <footer><button @click="$emit('toggle', card)">{{ card.learned ? '다시 학습하기' : '외웠어요 ✓' }}</button><button
          @click="next">다음 단어 →</button></footer>
    </section>
  </div>
</template>
