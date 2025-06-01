<!-- components/Alert.vue -->
<template>
    <transition name="slide-up">
      <div
        v-if="visible"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div class="alert alert-info shadow-lg">
          <span>{{ message }}</span>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    message: String,
    show: Boolean,
  });
  
  const emit = defineEmits(['update:show']);
  
  const visible = ref(props.show);
  
  watch(
    () => props.show,
    (newVal) => {
      visible.value = newVal;
      if (newVal) {
        setTimeout(() => {
          emit('update:show', false);
        }, 3000); // 3秒後に非表示
      }
    }
  );
  </script>
  
  <style scoped>
  .slide-up-enter-active {
    transition: all 0.5s ease-out;
  }
  .slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-up-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-up-leave-active {
    transition: all 0.5s ease-in;
  }
  .slide-up-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  </style>
  