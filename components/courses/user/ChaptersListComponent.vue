<script setup lang="ts">
defineProps<{
  section: any;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
}>();

const handleChapterClick = (...args: any) =>
  emit("handle-chapter-click", ...args);
const updateChapterProgress = (...args: any) =>
  emit("update-chapter-progress", ...args);

const emit = defineEmits(["handle-chapter-click", "update-chapter-progress"]);
</script>

<template>
  <ul class="chapters-sidebar__chapters">
    <ChapterComponent
      v-for="(chapter, index) in section.chapters"
      :key="chapter.chapterId"
      :chapter="chapter"
      :index="index"
      :sectionId="section.sectionId"
      :sectionProgress="sectionProgress"
      :chapterId="chapterId"
      :courseId="courseId"
      @handle-chapter-click="handleChapterClick"
      @update-chapter-progress="updateChapterProgress"
    />
  </ul>
</template>
