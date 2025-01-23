<script setup>
const router = useRouter();
const { setOpen } = inject("isSidebarExpanded");

const {
  user,
  course,
  userProgress,
  chapterId,
  courseId,
  isLoading,
  updateChapterProgress,
} = useCourseProgressData();

const sidebarRef = ref(null);

const handleChapterClick = (sectionId, chapterId) => {
  router.push(`/user/courses/${courseId.value}/chapters/${chapterId}`);
};

onMounted(() => {
  setOpen(false);
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else-if="!user">Please sign in to view course progress.</div>
  <div v-else-if="!course || !userProgress">Error loading course content</div>
  <div v-else ref="sidebarRef" class="chapters-sidebar">
    <div class="chapters-sidebar__header">
      <h2 class="chapters-sidebar__title">{{ course.title }}</h2>
      <hr class="chapters-sidebar__divider" />
    </div>

    <SectionComponent
      v-for="(section, index) in course.sections"
      :key="section.sectionId"
      :section="section"
      :index="index"
      :sectionProgress="
        userProgress.sections.find((s) => s.sectionId === section.sectionId)
      "
      :chapterId="chapterId"
      :courseId="courseId"
      @handle-chapter-click="handleChapterClick"
      @update-chapter-progress="updateChapterProgress"
    />
  </div>
</template>
