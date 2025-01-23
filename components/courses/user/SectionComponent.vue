<script setup lang="ts">
const props = defineProps<{
  section: any;
  index: number;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
}>();

const chaptersSidebarStore = useChaptersSidebar();
const {expandedSections} = storeToRefs(chaptersSidebarStore)

const completedChapters =
  props.sectionProgress?.chapters.filter((c: any) => c.completed).length || 0;
const totalChapters = props.section.chapters.length;
const isExpanded = computed(() => expandedSections.value.includes(props.section.sectionTitle));

const handleChapterClick = (...args: any) => emit("handle-chapter-click", ...args);
const updateChapterProgress = (...args: any) => emit("update-chapter-progress", ...args);

const emit = defineEmits([
  "handle-chapter-click",
  "update-chapter-progress",
]);
</script>

<template>
  <div class="chapters-sidebar__section">
    <div
      @click="() => chaptersSidebarStore.toggleSection(section.sectionTitle)"
      class="chapters-sidebar__section-header"
    >
      <div class="chapters-sidebar__section-title-wrapper">
        <p class="chapters-sidebar__section-number">Section 0{{ index + 1 }}</p>
        <IconChevronUp v-if="isExpanded" class="chapters-sidebar__chevron" />

        <IconChevronDown v-else class="chapters-sidebar__chevron" />
      </div>
      <h3 class="chapters-sidebar__section-title">
        {{ section.sectionTitle }}
      </h3>
    </div>
    <hr class="chapters-sidebar__divider" />

    <div v-if="isExpanded" class="chapters-sidebar__section-content">
      <ProgressVisualsComponent
        :section="section"
        :sectionProgress="sectionProgress"
        :completedChapters="completedChapters"
        :totalChapters="totalChapters"
      />
      <ChaptersListComponent
        :section="section"
        :sectionProgress="sectionProgress"
        :chapterId="chapterId"
        :courseId="courseId"
        @handle-chapter-click="handleChapterClick"
        @update-chapter-progress="updateChapterProgress"
      />
    </div>

    <hr class="chapters-sidebar__divider" />
  </div>
</template>
