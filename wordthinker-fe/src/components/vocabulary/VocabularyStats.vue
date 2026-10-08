<script setup>
defineProps({ total: Number, learned: Number, progress: Number })
</script>
<template>
  <section class="stats">
    <div><small>저장한 단어</small><strong>{{ total }}</strong><span> words</span></div>
    <div><small>외운 단어</small><strong>{{ learned }}</strong><span> learned</span></div>
    <div class="progress"><section><small>학습 진행률</small><strong>{{ progress }}%</strong></section><i><b :style="{width: progress + '%'}"></b></i></div>
  </section>
</template>
