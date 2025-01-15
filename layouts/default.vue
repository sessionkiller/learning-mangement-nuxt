
<script setup>
const isSidebarExpanded = ref(true);

function setOpen(state) {
  isSidebarExpanded.value = state;
}

function toggleSidebar() {
  isSidebarExpanded.value = !isSidebarExpanded.value;
}

provide("isSidebarExpanded", {
  isSidebarExpanded: readonly(isSidebarExpanded),
  setOpen,
  toggleSidebar,
});
</script>

<template>
  <div class="root-layout">
        <slot />
  </div>
</template>
