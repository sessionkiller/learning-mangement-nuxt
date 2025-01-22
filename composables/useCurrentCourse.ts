export const useCurrentCourse = () => {
  const { getCourse } = useApi();
  const { query: searchParamas } = useRoute();
  const courseId = computed(() => (searchParamas.id ?? "") as string);
  const { data: course, ...rest } = getCourse(courseId);

  return { course, courseId, ...rest };
};
