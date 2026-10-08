<script setup>
import { ref } from 'vue'

defineProps({ words: Array, total: Number, search: String, filter: String })
defineEmits(['update:search', 'update:filter', 'add', 'edit', 'remove', 'toggle'])
const hideWords = ref(false)
const hideMeanings = ref(false)
const filters = [{ value: 'all', text: '전체' }, { value: 'learning', text: '학습 중' }, { value: 'learned', text: '외운 단어' }]
</script>

<template>
  <section class="collection">
    <header><div><i>01</i><h2>나의 단어장</h2></div><small>{{ words.length }}개의 단어</small></header>
    <div class="toolbar">
      <label class="search"><span>⌕</span><input :value="search" type="search" placeholder="단어나 뜻을 검색해보세요" @input="$emit('update:search', $event.target.value)"></label>
      <nav><button v-for="item in filters" :key="item.value" :class="{ active: filter === item.value }" @click="$emit('update:filter', item.value)">{{ item.text }}</button></nav>
    </div>
    <div class="visibility-options" role="group" aria-label="단어 목록 가리기 설정">
      <label><input v-model="hideWords" type="checkbox"> 영단어 가리기</label>
      <label><input v-model="hideMeanings" type="checkbox"> 단어 뜻 가리기</label>
      <small v-if="hideWords || hideMeanings">가리기 중에는 예문도 숨겨집니다.</small>
    </div>
    <div v-if="words.length" class="list">
      <article v-for="word in words" :key="word.id" :class="{ learned: word.learned }">
        <button class="check" @click="$emit('toggle', word)">✓</button>
        <div class="word-body">
          <div><h3 :class="{ concealed: hideWords }">{{ hideWords ? '영단어 숨김' : word.word }}</h3><span>{{ word.learned ? '외운 단어' : '학습 중' }}</span></div>
          <p :class="{ concealed: hideMeanings }">{{ hideMeanings ? '단어 뜻 숨김' : word.meaning }}</p><blockquote v-if="word.example && !hideWords && !hideMeanings">“{{ word.example }}”</blockquote>
        </div>
        <div class="actions"><button @click="$emit('edit', word)">수정</button><button @click="$emit('remove', word)">삭제</button></div>
      </article>
    </div>
    <div v-else class="empty">
      <div>Aa</div><h3>{{ total ? '검색 결과가 없어요' : '첫 단어를 기록해보세요' }}</h3>
      <p>{{ total ? '다른 검색어나 필터를 사용해보세요.' : '내가 직접 만든 단어장이 가장 오래 기억에 남아요.' }}</p>
      <button v-if="!total" @click="$emit('add')">단어 추가하기 →</button>
    </div>
  </section>
</template>

<style scoped>
.visibility-options{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin-bottom:18px}
.visibility-options label{display:flex;align-items:center;gap:6px;color:var(--green);font-size:12px;cursor:pointer}
.visibility-options input{width:16px;height:16px;margin:0;accent-color:var(--green)}
.visibility-options input:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.visibility-options small{color:var(--muted);font-size:11px}
.word-body .concealed{color:var(--muted);font:500 13px/1.8 'Noto Sans KR',sans-serif}
</style>
