<script setup>
    const tags = [1, 2, 3, 4, 5];
    const courses = [1, 2, 3, 4];
</script>

<template>
  <div class="landing-skeleton">
    <div class="landing-skeleton__hero">
      <div class="landing-skeleton__hero-content">
        <PSkeleton class="landing-skeleton__title" />
        <PSkeleton class="landing-skeleton__subtitle" />
        <PSkeleton class="landing-skeleton__subtitle-secondary" />
        <PSkeleton class="landing-skeleton__button" />
      </div>
      <PSkeleton class="landing-skeleton__hero-image" />
    </div>

    <div class="landing-skeleton__featured">
      <PSkeleton class="landing-skeleton__featured-title" />
      <PSkeleton class="landing-skeleton__featured-description" />

      <div class="landing-skeleton__tags">
        <PSkeleton
          v-for="(_, index) in tags"
          :key="index"
          class="landing-skeleton__tag"
        />
      </div>

      <div class="landing-skeleton__courses">
        <PSkeleton
          v-for="(_, index) in courses"
          :key="index"
          class="landing-skeleton__course-card"
        />
      </div>
    </div>
  </div>
</template>
