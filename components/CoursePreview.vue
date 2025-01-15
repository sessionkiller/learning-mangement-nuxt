<script setup>
import { formatPrice } from "~/lib/utils";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const price = formatPrice(props.course.price);
</script>

<template>
  <div class="course-preview">
    <div class="course-preview__container">
      <div class="course-preview__image-wrapper">
        <NuxtImg
          :src="course.image || '/placeholder.png'"
          alt="Course Preview"
          width="640"
          height="360"
          class="w-full"
        />
      </div>
      <div>
        <h2 class="course-preview__title">{{ course.title }}</h2>
        <p class="text-gray-400 text-md mb-4">by {{ course.teacherName }}</p>
        <p class="text-sm text-customgreys-dirtyGrey">
          {{ course.description }}
        </p>
      </div>
      <div>
        <h4 class="text-white-50/90 font-semibold mb-2">Course Content</h4>
        <AccordionSections :sections="course.sections" />
      </div>
    </div>

    <div class="course-preview__container">
      <h3 class="text-xl mb-4">Price Details (1 item)</h3>
      <div
        class="flex justify-between mb-4 text-customgreys-dirtyGrey text-base"
      >
        <span class="font-bold">1x {{ course.title }}</span>
        <span class="font-bold">{{ price }}</span>
      </div>
      <div
        class="flex justify-between border-t border-customgreys-dirtyGrey pt-4"
      >
        <span class="font-bold text-lg">Total Amount</span>
        <span class="font-bold text-lg">{{ price }}</span>
      </div>
    </div>
  </div>
</template>
