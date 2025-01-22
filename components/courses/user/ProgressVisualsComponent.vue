<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
  section: any;
  sectionProgress: any;
  completedChapters: number;
  totalChapters: number;
}>();

const isCompleted = (chapter: any) =>
  props.sectionProgress?.chapters.find(
    (c: any) => c.chapterId === chapter.chapterId
  )?.completed;
</script>

<template>
  <div class="chapters-sidebar__progress">
    <div class="chapters-sidebar__progress-bars">
      <div
        v-for="chapter in section.chapters"
        :key="chapter.chapterId"
        :class="
          cn(
            'chapters-sidebar__progress-bar',
            isCompleted(chapter)
              ? 'chapters-sidebar__progress-bar--completed'
              : ''
          )
        "
      ></div>
    </div>
    <div class="chapters-sidebar__trophy">
      <IconTrophy class="chapters-sidebar__trophy-icon" />
    </div>
  </div>
  <p class="chapters-sidebar__progress-text">
    {{ completedChapters }}/{{ totalChapters }} COMPLETED
  </p>
</template>
