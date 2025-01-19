<script setup lang="ts">
const router = useRouter();

const { getCourses, createCourse, deleteCourse } = useApi();

const { user } = useUser();
const { data: courses, isLoading, isError } = getCourses("all");

const searchTerm = ref("");
const selectedCategory = ref("all");

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

const handleEdit = (course: Course) => {
  router.push(`/teacher/courses/${course.courseId}`);
};

const handleDelete = async (course: Course) => {
  if (window.confirm("Are you sure you want to delete this course?")) {
    await deleteCourse.mutateAsync(course.courseId);
  }
};

const handleCreateCourse = async () => {
  if (!user.value) return;

  const result = await createCourse.mutateAsync({
    teacherId: user.value.id,
    teacherName: user.value.fullName || "Unknown Teacher",
  });
  router.push(`/teacher/courses/${result.courseId}`);
};

const handleSearchChange = (searchValue: string) => {
  searchTerm.value = searchValue;
};

const handleCategoryChange = (categoryValue: string) => {
  selectedCategory.value = categoryValue;
};
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else-if="isError || !courses">Error loading courses.</div>
  <div v-else class="teacher-courses">
    <Header title="Courses" subtitle="Browse your courses">
      <template #rightElement>
        <PButton @click="handleCreateCourse" class="teacher-courses__header">
          Create Course
        </PButton>
      </template>
    </Header>
    <Toolbar
      @search-change="handleSearchChange"
      @category-change="handleCategoryChange"
    />
    <div class="teacher-courses__grid">
      <TeacherCourseCard
        v-for="course in filteredCourses"
        :key="course.courseId"
        :course="course"
        :is-owner="course.teacherId === user?.id"
        @on-edit="handleEdit"
        @on-delete="handleDelete"
      />
    </div>
  </div>
</template>
