export const useCourseProgressData = () => {
  const { params } = useRoute();
  const { user, isLoaded } = useUser();

  const courseId = (params.courseId ?? "") as string;
  const chapterId = (params.chapterId ?? "") as string;

  const hasMarkedComplete = ref(false);

  const setHasMarkedComplete = (isMarked: boolean) => {
    hasMarkedComplete.value = isMarked;
  };

  const { updateUserCourseProgress, getCourse, getUserCourseProgress } =
    useApi();

  const { data: course, isLoading: courseLoading } = getCourse(
    courseId,
    !!courseId
  );

  const { data: userProgress, isLoading: progressLoading } =
    getUserCourseProgress(
      user.value?.id ?? "",
      courseId,

      isLoaded.value && !!user.value && !!courseId
    );

  const isLoading = computed(
    () => !isLoaded.value || courseLoading.value || progressLoading.value
  );

  const currentSection = course.value?.sections.find((s) =>
    s.chapters.some((c) => c.chapterId === chapterId)
  );

  const currentChapter = currentSection?.chapters.find(
    (c) => c.chapterId === chapterId
  );

  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress.value?.sections)
      return false;

    const section = userProgress.value.sections.find(
      (s) => s.sectionId === currentSection.sectionId
    );
    return (
      section?.chapters.some(
        (c) => c.chapterId === currentChapter.chapterId && c.completed
      ) ?? false
    );
  };

  const updateChapterProgress = (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!user.value) return;

    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
          },
        ],
      },
    ];

    updateUserCourseProgress.mutate({
      userId: user.value.id,
      courseId,
      progressData: {
        sections: updatedSections,
      },
    });
  };

  return {
    user,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
