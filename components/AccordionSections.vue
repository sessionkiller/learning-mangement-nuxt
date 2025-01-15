<script setup>
defineProps({
  sections: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <PAccordion multiple class="w-full">
    <PAccordionPanel
      v-for="section in sections"
      :key="section.sectionId"
      :value="section.sectionTitle"
      class="accordion-section"
    >
      <PAccordionHeader class="accordion-section__trigger">
        <h5 class="accordion-section__title">{{ section.sectionTitle }}</h5>
      </PAccordionHeader>
      <PAccordionContent class="accordion-section__content">
        <ul>
          <li
            v-for="chapter in section.chapters"
            :key="chapter.chapterId"
            class="accordion-section__chapter"
          >
            <IconFileText class="mr-2 w-4 h-4" />
            <span class="text-sm">{{ chapter.title }}</span>
          </li>
        </ul>
      </PAccordionContent>
    </PAccordionPanel>
  </PAccordion>
</template>
