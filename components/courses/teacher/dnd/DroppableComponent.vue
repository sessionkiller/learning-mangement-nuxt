<script setup lang="ts">
import { DndProvider } from "vue3-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const coursesStore = useCoursesStore();
const { sections } = storeToRefs(coursesStore);

const handleSectionDragEnd = (sourceIndex: number, destinationIndex: number) => {

  const startIndex = sourceIndex;
  const endIndex = destinationIndex;

  const updatedSections = [...sections.value];
  const [reorderedSection] = updatedSections.splice(startIndex, 1);
  updatedSections.splice(endIndex, 0, reorderedSection);
  coursesStore.setSections(updatedSections);
};

const handleChapterDragEnd = (sourceIndex: number, destinationIndex: number, sectionIndex: number) => {

  const startIndex = sourceIndex;
  const endIndex = destinationIndex;

  const updatedSections = [
    ...sections.value.map((section) => ({
      ...section,
      chapters: [...section.chapters],
    })),
  ];
  const [reorderedChapter] = updatedSections[sectionIndex].chapters.splice(
    startIndex,
    1
  );
  updatedSections[sectionIndex].chapters.splice(endIndex, 0, reorderedChapter);
  coursesStore.setSections(updatedSections);
};
</script>

<template>
  <DndProvider :backend="HTML5Backend">
    <SectionHeader
      v-for="(section, sectionIndex) in sections"
      :key="section.sectionId"
      :section="section"
      :section-index="sectionIndex"
      :drag-end="handleSectionDragEnd"
    >
      <div>
        <ChapterItem
          v-for="(chapter, chapterIndex) in section.chapters"
          :chapter="chapter"
          :chapter-index="chapterIndex"
          :sectionIndex="sectionIndex"
          :drag-end="handleChapterDragEnd"
        />
      </div>
    </SectionHeader>
  </DndProvider>
</template>
