<script setup lang="ts">
import LayoutComponent from '@neo-frontend/shared/vue-components';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const currentTitle = computed(() => {
  if (route.name === 'Introduction') return '介紹';
  if (route.name === 'Privacy') return '隱私政策';
  return '首頁';
});
</script>

<template>
  <LayoutComponent :title="currentTitle">
    <router-view />
  </LayoutComponent>
</template>

