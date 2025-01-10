<script setup>
const router = useRouter();
const currentImage = useCarousel({ totalImages: 3 });
const { getCourses } = useApi();
const { data: courses, isLoading, isError } = getCourses();

const handleCourseClick = (courseId) => {
  router.push(`/search?id=${courseId}`, {
    scroll: false,
  });
};

const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
const tags = [
  "web development",
  "entrprise IT",
  "react nextjs",
  "backend development",
  "javascript",
];
</script>

<template>
  <LoadingSkeleton v-if="isLoading" />
  <div
    v-else
    class="landing"
    v-motion
    :initial="{
      opacity: 0,
    }"
    :enter="{
      opacity: 1,
    }"
    :durationn="500"
  >
    <div
      class="landing__hero"
      v-motion
      :initial="{ y: 20, opacity: 0 }"
      :enter="{ y: 0, opacity: 1 }"
      :durationn="500"
    >
      <div class="landing__hero-content">
        <h1 class="landing__title">Courses</h1>
        <p class="landing__description">
          This is the list of the courses you can enroll in.
          <br />
          Courses when you need them and want them.
        </p>
        <div class="landing__cta">
          <NuxtLink to="/search">
            <div class="landing__cta-button">Search for Courses</div>
          </NuxtLink>
        </div>
      </div>
      <div class="landing__hero-images">
        <NuxtImg
          v-for="(img, index) in images"
          :key="img"
          :src="img"
          :alt="`Hero Banner ${index + 1}`"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          :class="`landing__hero-image fill ${
            index === currentImage ? 'landing__hero-image--active' : ''
          }`"
        />
      </div>
    </div>
    <div
      class="landing__featured"
      v-motion
      :initial="{ opacity: 0 }"
      :visible-once="{ opacity: 1 }"
      :duration="500"
    >
      <h2 class="landing__featured-title">Featured Courses</h2>
      <p class="landing__featured-description">
        From beginner to advanced, in all industries, we have the right courses
        just for you and preparing your entire journey for learning and making
        the most.
      </p>

      <div class="landing__tags">
        <span v-for="(tag, index) in tags" :key="index" class="landing__tag">
          {{ tag }}
        </span>
      </div>

      <div v-if="isError">Error loading courses...</div>
      <div v-else class="landing__courses">
        <div
          v-for="(course, index) in courses.slice(0, 4)"
          :key="course.courseId"
          v-motion
          :initial="{ y: 50, opacity: 0 }"
          :visible="{ y: 0, opacity: 1 }"
          :duration="500"
          :delay="index * 200"
        >
          <CourseCardSearch
            :course="course"
            @handle-click="handleCourseClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>
