<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
  chapter: any;
  index: number;
  sectionId: string;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
}>();

const handleChapterClick = (...args: any) =>
  emit("handle-chapter-click", ...args);
const updateChapterProgress = (...args: any) =>
  emit("update-chapter-progress", ...args);

const chapterProgress = props.sectionProgress?.chapters.find(
  (c: any) => c.chapterId === props.chapter.chapterId
);
const isCompleted = chapterProgress?.completed;
const isCurrentChapter = props.chapterId === props.chapter.chapterId;

const handleToggleComplete = (e: MouseEvent) => {
  e.stopPropagation();

  updateChapterProgress(props.sectionId, props.chapter.chapterId, !isCompleted);
};

const emit = defineEmits(["handle-chapter-click", "update-chapter-progress"]);
</script>

<template>
  <li
    :class="
      cn(
        'chapters-sidebar__chapter',
        isCurrentChapter ? 'chapters-sidebar__chapter--current' : ''
      )
    "
    @click="() => handleChapterClick(sectionId, chapter.chapterId)"
  >
    <div
      v-if="isCompleted"
      class="chapters-sidebar__chapter-check"
      @click="handleToggleComplete"
      title="Toggle completion status"
    >
      <IconCheckCircle class="chapters-sidebar__check-icon" />
    </div>

    <div
      v-else
      :class="
        cn(
          'chapters-sidebar__chapter-number',
          isCurrentChapter ? 'chapters-sidebar__chapter-number--current' : ''
        )
      "
    >
      {{ index + 1 }}
    </div>

    <span
      :class="
        cn(
          'chapters-sidebar__chapter-title',
          isCompleted ? 'chapters-sidebar__chapter-title--completed' : '',
          isCurrentChapter ? 'chapters-sidebar__chapter-title--current' : ''
        )
      "
    >
      {{ chapter.title }}
    </span>

    <IconFileText
      v-if="chapter.type === 'Text'"
      class="chapters-sidebar__text-icon"
    />
  </li>
</template>
