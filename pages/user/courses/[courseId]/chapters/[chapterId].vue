<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

const {
  user,
  course,
  userProgress,
  currentSection,
  currentChapter,
  isLoading,
  isChapterCompleted,
  updateChapterProgress,
  hasMarkedComplete,
  setHasMarkedComplete,
} = useCourseProgressData();

console.log("currentChapter.video:", currentChapter);

const handleProgress = ({ played }: { played: number }) => {
  if (
    played >= 0.8 &&
    !hasMarkedComplete &&
    currentChapter &&
    currentSection &&
    userProgress.value?.sections &&
    !isChapterCompleted()
  ) {
    setHasMarkedComplete(true);
    updateChapterProgress(
      currentSection.sectionId,
      currentChapter.chapterId,
      true
    );
  }
};
</script>

<template>
  <DashboardLayout>
    <Loading v-if="isLoading" />
    <div v-else-if="!user">Please sign in to view this course.</div>
    <div v-else-if="!course || !userProgress">Error loading course</div>
    <div v-else class="course">
      <div class="course__container">
        <div class="course__breadcrumb">
          <div class="course__path">
            {{ course.title }} / {{ currentSection?.sectionTitle }} /{{ " " }}
            <span class="course__current-chapter">
              {{ currentChapter?.title }}
            </span>
          </div>
          <h2 class="course__title">{{ currentChapter?.title }}</h2>
          <div class="course__header">
            <div class="course__instructor">
              <PAvatar
                :label="course.teacherName[0]"
                class="course__avatar"
                shape="circle"
              />
              <span class="course__instructor-name">
                {{ course.teacherName }}
              </span>
            </div>
          </div>
        </div>

        <PCard
          class="course__video"
          :pt="{
            content: {
              class: 'course__video-container',
            },
          }"
        >
          <template #content>
            <video-player
              v-if="currentChapter?.video"
              :src="(currentChapter.video as string)"
              @progress="handleProgress"
              controls
              class="w-full h-full"
            />
            <div v-else class="course__no-video">
              No video available for this chapter.
            </div>
          </template>
        </PCard>

        <div class="course__content">
          <PTabs value="Notes" class="course__tabs">
            <PTabList class="course__tabs-list">
              <PTab class="course__tab" value="Notes">Notes</PTab>
              <PTab class="course__tab" value="Resources">Resources</PTab>
              <PTab class="course__tab" value="Quiz">Quiz</PTab>
            </PTabList>
            <PTabPanels>
              <PTabPanel class="course__tab-content" value="Notes">
                <PCard
                  class="course__tab-card"
                  :pt="{
                    header: {
                      class: 'course__tab-header',
                    },
                    content: {
                      class: 'course__tab-body',
                    },
                  }"
                >
                  <template #title>Notes Content</template>
                  <template #content>{{ currentChapter?.content }}</template>
                </PCard>
              </PTabPanel>
              <PTabPanel class="course__tab-content" value="Resources">
                <PCard
                  class="course__tab-card"
                  :pt="{
                    header: {
                      class: 'course__tab-header',
                    },
                    content: {
                      class: 'course__tab-body',
                    },
                  }"
                >
                  <template #title>Resources Content</template>
                  <template #content
                    >{/* Add resources content here */}</template
                  >
                </PCard>
              </PTabPanel>
              <PTabPanel class="course__tab-content" value="Quiz">
                <PCard
                  class="course__tab-card"
                  :pt="{
                    header: {
                      class: 'course__tab-header',
                    },
                    content: {
                      class: 'course__tab-body',
                    },
                  }"
                >
                  <template #title>Quiz Content</template>
                  <template #content>{/* Add quiz content here */}</template>
                </PCard>
              </PTabPanel>
            </PTabPanels>
          </PTabs>

          <PCard
            class="course__instructor-card"
            :pt="{
              content: {
                class: 'course__instructor-info',
              },
            }"
          >
            <template #content>
              <div class="course__instructor-header">
                <PAvatar
                  :label="course.teacherName[0]"
                  class="course__instructor-avatar"
                  shape="circle"
                />

                <div class="course__instructor-details">
                  <h4 class="course__instructor-name">
                    {{ course.teacherName }}
                  </h4>
                  <p class="course__instructor-title">Senior UX Designer</p>
                </div>
              </div>
              <div class="course__instructor-bio">
                <p>
                  A seasoned Senior UX Designer with over 15 years of experience
                  in creating intuitive and engaging digital experiences.
                  Expertise in leading UX design projects.
                </p>
              </div>
            </template>
          </PCard>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
