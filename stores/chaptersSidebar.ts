export const useChaptersSidebar = defineStore("chaptersSidebar", () => {
  const expandedSections = ref<string[]>([]);

  function toggleSection(sectionTitle : string) {
    if (expandedSections.value.includes(sectionTitle)) {
      expandedSections.value = expandedSections.value.filter(
        (title) => title !== sectionTitle
      );
    } else {
      expandedSections.value.push(sectionTitle);
    }
  };

  return {
    expandedSections,
    toggleSection
  };
});
