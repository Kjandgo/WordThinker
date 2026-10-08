<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="empty">
    <div>404</div>
    <h1>페이지를 찾을 수 없습니다.</h1>
    <p>주소를 확인하거나 단어장으로 돌아가 주세요.</p>
    <RouterLink class="return-link" :to="{ name: 'vocabulary' }">
      단어장으로 돌아가기
    </RouterLink>
  </section>
</template>

<style scoped>
.return-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 24px;
  padding: 12px 22px;
  border: 1px solid var(--green);
  border-radius: 3px;
  color: #fff;
  background: var(--green);
  box-shadow: 0 8px 20px #1e5b422e;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.return-link:hover {
  background: var(--ink);
  border-color: var(--ink);
}

.return-link:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 4px;
}
</style>
