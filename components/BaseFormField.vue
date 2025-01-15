<script setup lang="ts">
defineProps<{
  prop: string;
  label?: string;
  helpText?: string;
  row?: boolean;
  isRequired?: boolean;
}>();
</script>

<template>
  <div
    class="flex"
    :class="[
      row ? 'flex-row flex-wrap items-center justify-between' : 'flex-col',
      // label ? 'h-18' : 'h-14',
    ]"
  >
    <label
      v-if="label"
      :for="prop"
      class="flex items-center gap-1 text-color font-semibold mb-1 h-4"
      :class="row ? 'w-2/5' : 'w-full'"
    >
      {{ label }}
      <div v-if="isRequired">*</div>
      <div
        v-if="helpText"
        v-tooltip="{
          value: helpText,
          pt: {
            arrow: {
              style: {
                display: 'none',
              },
            },
            text: 'text-sm bg-gray-100 text-gray-900',
          },
        }"
        class="cursor-pointer inline-block relative"
      >
        <IconCircleHelp :size="20" />
      </div>
    </label>

    <slot />

    <Transition>
      <VeeErrorMessage
        :id="`${prop}-error`"
        class="text-red-500 mt-1 ml-auto inline-block text-right w-full mr-4"
        :name="prop"
      />
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
