<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" :to="{ name: 'vocabulary' }"><span>W</span> WordThinker</RouterLink>
    <button class="info" title="이 단어장은 현재 브라우저에 저장됩니다">?</button>
  </header>
</template>
