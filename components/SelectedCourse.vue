<script setup>
import { formatPrice } from "~/lib/utils";

defineProps({
    course: {
    type: Object,
    required: true,
  }
})

defineEmits(['handle-enroll-now'])
</script>


<template>

<div class="selected-course">
      <div>
        <h3 class="selected-course__title">{{course.title}}</h3>
        <p class="selected-course__author">
          By {{course.teacherName}} | {{' '}}
          <span class="selected-course__enrollment-count">
            {{course.enrollments?.length}}
          </span>
        </p>
      </div>

      <div class="selected-course__content">
        <p class="selected-course__description">{{course.description}}</p>

        <div class="selected-course__sections">
          <h4 class="selected-course__sections-title">Course Content</h4>
          <AccordionSections :sections="course.sections" />
        </div>

        <div class="selected-course__footer">
          <span class="selected-course__price">
            {{formatPrice(course.price)}}
            </span>
          <PButton @click="() => handleEnrollNow(course.courseId)"
            class='bg-primary-700 hover:bg-primary-600'>
              Enroll Now
          </PButton>
        </div>
      </div>
    </div>
</template>