<script setup>
const router = useRouter();
const { getCourses } = useApi();
const { query: searchParams } = useRoute();
const id = searchParams.id;

const { data: courses, isLoading, isError } = getCourses();
const selectedCourse = ref(null);

watch([courses, () => id], ([newCourses, newId]) => {
  if (newCourses) {
    if (newId) {
      const course = newCourses.find((c) => c.courseId === newId);
      selectedCourse.value = course || newCourses[0];
    } else {
      selectedCourse.value = newCourses[0];
    }
  }
}, {immediate: true});

const handleCourseSelect = (course) => {
  selectedCourse.value = course;
  router.push(`/search?id=${course.courseId}`, {
    scroll: false,
  });
};

const handleEnrollNow = (courseId) => {
  router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
    scroll: false,
  });
};
</script>
<template>
  <NuxtLayout name="nondashboard">
    <Loading v-if="isLoading" />
    <div v-else-if="isError || !courses">Failed to fetch courses</div>
    <div
      v-else
      v-motion
      :initial="{
        opacity: 0,
      }"
      :enter="{
        opacity: 1,
      }"
      :durationn="500"
      class="search"
    >
      <h1 class="search__title">List of available courses</h1>
      <h2 class="search__subtitle">{{ courses.length }} courses available</h2>
      <div class="search__content">
        <div
          v-motion
          :initial="{
            opacity: 0,
            y: 40,
          }"
          :enter="{
            opacity: 1,
            y: 0,
          }"
          :durationn="500"
          :delay="200"
          class="search__courses-grid"
        >
          <CourseCardSearch
            v-for="course in courses"
            :key="course.courseId"
            :course="course"
            :is-selected="selectedCourse?.courseId === course.courseId"
            @handle-click="() => handleCourseSelect(course)"
          />
        </div>

        <div
          v-if="selectedCourse"
          v-motion
          :initial="{
            opacity: 0,
            y: 40,
          }"
          :enter="{
            opacity: 1,
            y: 0,
          }"
          :durationn="500"
          :delay="500"
          class="search__selected-course"
        >
          <SelectedCourse
            :course="selectedCourse"
            @handle-enroll-now="handleEnrollNow"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
