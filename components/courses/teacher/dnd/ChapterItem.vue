<script setup lang="ts">
import { useDrag, useDrop } from "vue3-dnd";
import type { XYCoord, Identifier } from "dnd-core";

const props = defineProps<{
  chapter: Chapter;
  chapterIndex: number;
  sectionIndex: number;
  dragEnd: (
    dragIndex: number,
    hoverIndex: number,
    sectionIndex: number
  ) => void;
}>();

interface DragItem {
  index: number;
  id: string;
  type: string;
  sectionIndex: number;
}

const coursesStore = useCoursesStore();
const chapterDiv = ref<HTMLDivElement>();
const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null }
>({
  accept: "chapter",
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
    };
  },
  hover(item: DragItem, monitor) {
    if (!chapterDiv.value) {
      return;
    }
    const dragIndex = item.index;
    const hoverIndex = props.chapterIndex;

    if(item.sectionIndex !== props.sectionIndex){
      return
    }

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = chapterDiv.value?.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.dragEnd(dragIndex, hoverIndex, props.sectionIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    item.index = hoverIndex;
  },
});

const [collect, drag] = useDrag({
  type: "chapter",
  item: () => {
    return { id: props.chapter.chapterId, index: props.chapterIndex, sectionIndex: props.sectionIndex };
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
});

const { handlerId } = toRefs(dropCollect.value);
const { isDragging } = toRefs(collect.value);
const opacity = computed(() => (unref(isDragging) ? 0 : 1));

const setRef = (el: any) => {
  chapterDiv.value = drag(drop(el)) as HTMLDivElement;
};
</script>

<template>
  <div
    :ref="setRef"
    :style="{ opacity }"
    :data-handler-id="handlerId"
    :class="`droppable-chapter ${
      chapterIndex % 2 === 1
        ? 'droppable-chapter--odd'
        : 'droppable-chapter--even'
    }`"
  >
    <div class="droppable-chapter__title">
      <IconGripVertical class="h-4 w-4 mb-[2px]" />
      <p class="text-sm">{{ `${chapterIndex + 1}. ${chapter.title}` }}</p>
    </div>
    <div class="droppable-chapter__actions">
      <PButton
        type="button"
        variant="text"
        size="small"
        class="droppable-chapter__button"
        @click="() => coursesStore.openChapterModal(sectionIndex, chapterIndex)"
      >
        <IconEdit class="h-4 w-4" />
      </PButton>
      <PButton
        type="button"
        variant="text"
        size="small"
        class="droppable-chapter__button"
        @click="() => coursesStore.deleteChapter(sectionIndex, chapterIndex)"
      >
        <IconTrash2 class="h-4 w-4" />
      </PButton>
    </div>
  </div>
</template>
