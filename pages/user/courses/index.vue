<script setup lang="ts">

const router = useRouter();
const { user, isLoaded } = useUser();

const searchTerm = ref("");
const selectedCategory = ref("all");

const { getUserEnrolledCourses } = useApi();

const userId = computed(() =>
user.value?.id
)

const {
  data: courses,
  isLoading,
  isError
} = getUserEnrolledCourses(userId)

const filteredCourses = computed(() => {
  if (!courses.value) return [];

  return courses.value.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "all" ||
      course.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

const handleGoToCourse = (course: Course) => {
  if (
    course.sections &&
    course.sections.length > 0 &&
    course.sections[0].chapters.length > 0
  ) {
    const firstChapter = course.sections[0].chapters[0];
    router.push(
      `/user/courses/${course.courseId}/chapters/${firstChapter.chapterId}`
    );
  } else {
    router.push(`/user/courses/${course.courseId}`);
  }
};

const handleSearchChange = (searchValue: string) => {
  searchTerm.value = searchValue;
};

const handleCategoryChange = (categoryValue: string) => {
  selectedCategory.value = categoryValue;
};

</script>

<template>
  <DashboardLayout>
    <Loading v-if="!isLoaded || isLoading" />
    <div v-else-if="!user">Please sign in to view your courses.</div>
    <div v-else-if="isError || !courses || courses.length === 0">
      You are not enrolled in any courses yet.
    </div>
    <div v-else class="user-courses">
      <Header title="My Courses" subtitle="View your enrolled courses" />
      <Toolbar
        @search-change="handleSearchChange"
        @category-change="handleCategoryChange"
      />
      <div class="user-courses__grid">
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.courseId"
          :course="course"
          @go-to-course="handleGoToCourse"
        />
      </div>
    </div>
  </DashboardLayout>
</template>
