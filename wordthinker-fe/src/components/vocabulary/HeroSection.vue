<script setup>
defineProps({ canStudy: Boolean })
defineEmits(['add', 'study'])
</script>
<template>
  <section class="hero">
    <div class="eyebrow"><i></i> MY WORD COLLECTION</div>
    <h1>나만의 단어를<br><em>차곡차곡.</em></h1>
    <p>오늘 발견한 단어를 기록하고, 매일 조금씩 내 것으로 만들어보세요.</p>
    <div class="hero-buttons">
      <button class="primary" @click="$emit('add')">＋ 새 단어 추가</button>
      <button class="secondary" :disabled="!canStudy" @click="$emit('study')">플래시카드 학습 →</button>
    </div>
  </section>
</template>
