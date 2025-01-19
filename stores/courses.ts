export const useCoursesStore = defineStore("courses", () => {
  const sections = ref<Section[]>([]);
  const isChapterModalOpen = ref(false);
  const isSectionModalOpen = ref(false);
  const selectedSectionIndex = ref<number | null>(null);
  const selectedChapterIndex = ref<number | null>(null);

  function setSections(data: Section[]) {
    sections.value = data;
  }
  function openChapterModal(
    sectionIndex: number | null,
    chapterIndex: number | null
  ) {
    isChapterModalOpen.value = true;
    selectedSectionIndex.value = sectionIndex;
    selectedChapterIndex.value = chapterIndex;
  }

  function closeChapterModal() {
    isChapterModalOpen.value = false;
    selectedSectionIndex.value = null;
    selectedChapterIndex.value = null;
  }

  function openSectionModal(sectionIndex: number | null) {
    isSectionModalOpen.value = true;
    selectedSectionIndex.value = sectionIndex;
  }

  function closeSectionModal() {
    isSectionModalOpen.value = false;
    selectedSectionIndex.value = null;
  }

  function addSection(data: Section) {
    sections.value.push(data);
  }

  function editSection(index: number, section: Section) {
    sections.value[index] = section;
  }

  function deleteSection(index: number) {
    sections.value.splice(index, 1);
  }

  function addChapter(sectionIndex: number, chapter: Chapter) {
    sections.value[sectionIndex].chapters.push(chapter);
  }

  function editChapter(
    sectionIndex: number,
    chapterIndex: number,
    chapter: Chapter
  ) {
    sections.value[sectionIndex].chapters[chapterIndex] = chapter;
  }

  function deleteChapter(sectionIndex: number, chapterIndex: number) {
    sections.value[sectionIndex].chapters.splice(chapterIndex, 1);
  }

  return {
    setSections,
    openChapterModal,
    closeChapterModal,
    openSectionModal,
    closeSectionModal,
    addSection,
    editSection,
    deleteSection,
    addChapter,
    editChapter,
    deleteChapter,
  };
});
