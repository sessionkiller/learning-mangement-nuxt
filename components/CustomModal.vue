<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(["on-close"]);

const onClose = () => emit("on-close");
</script>

<template>
  <template v-if="isOpen">
    <div className="custom-modal__overlay" @click="onClose" />
    <div className="custom-modal__content">
      <div className="custom-modal__inner">
        <slot />
      </div>
    </div>
  </template>
</template>
