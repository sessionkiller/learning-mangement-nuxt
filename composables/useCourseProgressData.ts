export const useCourseProgressData = () => {
  const { params } = useRoute();
  const { user, isLoaded } = useUser();

  const userId = computed(() => user.value?.id)
  const courseId = computed(() => (params.courseId ?? "") as string);
  const chapterId = (params.chapterId ?? "") as string;

  const hasMarkedComplete = ref(false);

  const setHasMarkedComplete = (isMarked: boolean) => {
    hasMarkedComplete.value = isMarked;
  };

  const { updateUserCourseProgress, getCourse, getUserCourseProgress } =
    useApi();

  const { data: course, isLoading: courseLoading } = getCourse(
    courseId
  );

  const { data: userProgress, isLoading: progressLoading } =
    getUserCourseProgress(
      userId,
      courseId
    );

  const isLoading = computed(
    () => !isLoaded.value || courseLoading.value || progressLoading.value
  );

  const currentSection = computed(() => course.value?.sections.find((s) =>
    s.chapters.some((c) => c.chapterId === chapterId)
  ));

  const currentChapter = computed(() => currentSection.value?.chapters.find(
    (c) => c.chapterId === chapterId
  ));

  const isChapterCompleted = () => {
    if (!currentSection.value || !currentChapter.value || !userProgress.value?.sections){
      return false;
    }

    const section = userProgress.value.sections.find(
      (s) => s.sectionId === currentSection.value?.sectionId
    );
    return (
      section?.chapters.some(
        (c) => c.chapterId === currentChapter.value?.chapterId && c.completed
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
      courseId: courseId.value,
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
