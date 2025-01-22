<script setup>
import { cn } from "~/lib/utils";

const { path: pathname } = useRoute();
const { user, isLoaded } = useUser();
const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
  pathname
);

watch(user, (newUser) => {
  if (newUser) {
    const userRole = newUser.publicMetadata?.userType || "student";
    const routeType = pathname.startsWith("/teacher/") ? "teacher" : "student";

    if (userRole !== routeType) {
      const route = userRole === "teacher" ? "teacher" : "user";
      return navigateTo(`/${route}/courses`);
    }
  }
});

const courseId = computed(() => {
  if (isCoursePage) {
    const match = pathname.match(/\/user\/courses\/([^\/]+)/);
    return match ? match[1] : null;
  } else {
    return null;
  }
});
</script>

<template>
  <Loading v-if="!isLoaded" />
  <div v-else-if="!user">Please sign in to access this page.</div>
  <div v-else class="dashboard">
    <AppSidebar />
    <div class="dashboard__content">
      <ChaptersSidebar v-if="courseId" />
      <div
        :class="
          cn('dashboard__main', isCoursePage && 'dashboard__main--not-course')
        "
        :style="{ height: '100vh' }"
      >
        <Navbar :isCoursePage="isCoursePage" />
        <main class="dashboard__body">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
