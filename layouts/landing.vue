<template>
  <LandingNavbar></LandingNavbar>
  <slot></slot>
  <LandingFooter></LandingFooter>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore, initializeUserStore } from '@/stores/userStore';

const user = useUserStore();

const resetSessionTimeout = () => {
  user.startSessionTimeout(); 
};

onMounted(() => {
  initializeUserStore();
  document.addEventListener('mousemove', resetSessionTimeout);
  document.addEventListener('keypress', resetSessionTimeout);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', resetSessionTimeout);
  document.removeEventListener('keypress', resetSessionTimeout);
});
</script>
