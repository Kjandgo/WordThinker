<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { lookupWordMeaning } from '@/services/wordMeaning'

const props = defineProps({ word: Object, words: Array })
const emit = defineEmits(['close', 'save'])
const form = ref(props.word ? { word: props.word.word, meaning: props.word.meaning, example: props.word.example } : { word: '', meaning: '', example: '' })
const error = ref('')
const lookingUp = ref(false)
const aiMessage = ref('')
const suggestion = ref(null)
let controller

watch(() => form.value.word, () => {
  controller?.abort()
  suggestion.value = null
  aiMessage.value = ''
})
onBeforeUnmount(() => controller?.abort())

async function findMeaning() {
  if (lookingUp.value) return
  const word = form.value.word.trim()
  if (!word || word.length > 100 || !/^[a-zA-Z]+(?:[ '\u2019-][a-zA-Z]+)*$/.test(word)) {
    error.value = '100자 이내의 영단어나 영어 표현을 입력해주세요.'
    return
  }
  error.value = ''
  aiMessage.value = ''
  suggestion.value = null
  lookingUp.value = true
  controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => { timedOut = true; controller.abort() }, 45000)
  try {
    const result = await lookupWordMeaning(word, controller.signal)
    if (controller.signal.aborted || form.value.word.trim() !== word) return
    if (form.value.meaning.trim() || form.value.example.trim()) {
      suggestion.value = result
    } else {
      Object.assign(form.value, result)
      aiMessage.value = 'AI가 뜻과 예문을 채웠어요. 내용을 확인한 뒤 저장해주세요.'
    }
  } catch (cause) {
    if (timedOut) error.value = '응답 시간이 초과되었습니다. 다시 시도해주세요.'
    else if (cause.name !== 'AbortError') error.value = cause instanceof TypeError
      ? 'n8n에 연결할 수 없습니다. 서버 실행 상태를 확인해주세요.'
      : cause.message
  } finally {
    clearTimeout(timeout)
    lookingUp.value = false
  }
}

function applySuggestion() {
  Object.assign(form.value, suggestion.value)
  suggestion.value = null
  aiMessage.value = 'AI 제안을 적용했어요. 내용을 확인한 뒤 저장해주세요.'
}

function submit() {
  const value = Object.fromEntries(Object.entries(form.value).map(([key, text]) => [key, text.trim()]))
  if (!value.word || !value.meaning) return error.value = '영단어와 뜻을 모두 입력해주세요.'
  if (props.words.some(item => item.id !== props.word?.id && item.word.toLowerCase() === value.word.toLowerCase())) return error.value = '이미 저장된 단어입니다.'
  emit('save', value)
}
</script>

<template>
  <div class="backdrop" @mousedown.self="$emit('close')">
    <form class="modal" @submit.prevent="submit">
      <button type="button" class="close" @click="$emit('close')">×</button>
      <small>{{ word ? 'EDIT WORD' : 'NEW WORD' }}</small>
      <h2>{{ word ? '단어를 수정할까요?' : '새로운 단어를 만났나요?' }}</h2>
      <p>기억하고 싶은 단어와 의미를 적어주세요.</p>
      <label>영단어 <b>*</b><input v-model="form.word" autofocus placeholder="예: serendipity"></label>
      <div class="ai-actions">
        <button type="button" class="ai-lookup" :disabled="lookingUp || !form.word.trim()" :aria-busy="lookingUp" @click="findMeaning">{{ lookingUp ? 'AI가 뜻을 찾는 중…' : '✦ AI로 뜻 찾기' }}</button>
        <span>한국어 뜻과 예문을 찾아드려요. 하루 최대 200개</span>
      </div>
      <div v-if="suggestion" class="ai-suggestion" aria-live="polite">
        <strong>AI 제안</strong>
        <p>{{ suggestion.meaning }}</p>
        <p>{{ suggestion.example }}</p>
        <button type="button" @click="applySuggestion">뜻과 예문에 적용</button>
      </div>
      <p v-if="aiMessage" class="ai-message" role="status">{{ aiMessage }}</p>
      <label>뜻 <b>*</b><input v-model="form.meaning" placeholder="예: 뜻밖의 행운"></label>
      <label>예문 <span>(선택)</span><textarea v-model="form.example" rows="3" placeholder="예: It was pure serendipity that we met."></textarea></label>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="modal-actions"><button type="button" @click="$emit('close')">취소</button><button>저장하기</button></div>
    </form>
  </div>
</template>

<style scoped>
.modal { max-height: calc(100dvh - 40px); overflow-y: auto; }
.ai-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.ai-lookup, .ai-suggestion button { padding: 9px 12px; border: 1px solid var(--green); border-radius: 3px; background: var(--mint); color: var(--green); font-size: 12px; font-weight: 700; }
.ai-lookup:disabled { opacity: .5; cursor: not-allowed; }
.ai-actions span { color: var(--muted); font-size: 11px; }
.ai-suggestion { margin-top: 14px; padding: 14px; border: 1px solid var(--line); background: var(--cream); font-size: 12px; overflow-wrap: anywhere; }
.modal .ai-message { margin: 12px 0 0; color: var(--green); font-size: 11px; }
</style>
