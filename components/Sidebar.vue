<script setup>
const { isSidebarExpanded, setOpen } = inject("isSidebarExpanded");

const isMobile = useMobile();

watch(
  isMobile,
  (newVal) => {
    setOpen(!newVal);
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="!isMobile"
    :class="[
      'overflow-hidden hidden md:block transition-all duration-300 ease-out h-full',
      isSidebarExpanded ? 'w-64' : 'w-12',
    ]"
  >
    <slot />
  </div>
  <PDrawer
    v-else
    v-model:visible="isSidebarExpanded"
    :showCloseIcon="false"
    @update:visible="setOpen"
    :pt="{
      root: {
        class: '!w-auto !bg-customgreys-primarybg'
      },
      header: {
        class: '!p-0',
      },
      content: {
        class: '!p-0 !overflow-y-hidden',
      },
    }"
  >
    <slot />
  </PDrawer>
</template>
