<script setup>
import { formatPrice } from "~/lib/utils";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["go-to-course"]);

const onGoToCourse = () => emit("go-to-course", props.course);
</script>

<template>
  <PCard
    class="course-card group"
    @click="onGoToCourse"
    :pt="{
      header: { class: 'course-card__header' },
      title: { class: 'course-card__title' },
      footer: { class: 'course-card__footer' },
    }"
  >
    <template #header>
      <NuxtImg
        :src="course.image || '/placeholder.png'"
        :alt="course.title"
        width="400"
        height="350"
        class="course-card__image"
      />
    </template>

    <template #title>{{ course.title }}: {{ course.description }}</template>

    <template #content>
      <div class="flex items-center gap-2">
        <PAvatar
          :label="course.teacherName[0]"
          class="w-6 h-6"
          shape="circle"
        />

        <p class="text-sm text-customgreys-dirtyGrey">
          {{ course.teacherName }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="course-card__category">{{ course.category }}</div>
      <span class="course-card__price">
        {{ formatPrice(course.price) }}
      </span>
    </template>
  </PCard>
</template>
