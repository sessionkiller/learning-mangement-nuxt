<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="header">
    <div>
      <h1 class="header__title">{{ title }}</h1>
      <p class="header__subtitle">{{ subtitle }}</p>
    </div>
    <slot name="rightElement" />
  </div>
</template>
