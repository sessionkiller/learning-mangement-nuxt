<script setup>
import { formatPrice } from "~/lib/utils";

defineProps({
  course: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["handle-click"]);
</script>

<template>
  <div
    @click="() => emit('handle-click')"
    :class="`course-card-search group ${
      isSelected
        ? 'course-card-search--selected'
        : 'course-card-search--unselected'
    }`"
  >
    <div class="course-card-search__image-container">
      <NuxtImg
        :src="course.image || '/placeholder.png'"
        :alt="course.title"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        class="course-card-search__image fill"
      />
    </div>
    <div class="course-card-search__content">
      <div>
        <h2 class="course-card-search__title">{{ course.title }}</h2>
        <p class="course-card-search__description">{{ course.description }}</p>
      </div>
      <div class="mt-2">
        <p class="course-card-search__teacher">By {{ course.teacherName }}</p>
        <div class="course-card-search__footer">
          <span class="course-card-search__price">
            {{ formatPrice(course.price) }}
          </span>
          <span class="course-card-search__enrollment">
            {{ course.enrollments?.length }} Enrolled
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
