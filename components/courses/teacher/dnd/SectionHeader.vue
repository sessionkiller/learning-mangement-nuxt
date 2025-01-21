<script setup lang="ts">
import { useDrag, useDrop } from "vue3-dnd";
import type { XYCoord, Identifier } from "dnd-core";

const props = defineProps<{
  section: Section;
  sectionIndex: number;
  dragEnd: (dragIndex: number, hoverIndex: number) => void;
}>();

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const coursesStore = useCoursesStore();
const sectionDiv = ref<HTMLDivElement>();
const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null }
>({
  accept: "section",
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
    };
  },
  hover(item: DragItem, monitor) {
    if (!sectionDiv.value) {
      return;
    }
    const dragIndex = item.index;
    const hoverIndex = props.sectionIndex;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = sectionDiv.value?.getBoundingClientRect();

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
    props.dragEnd(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    item.index = hoverIndex;
  },
});

const [collect, drag] = useDrag({
  type: "section",
  item: () => {
    return { id: props.section.sectionId, index: props.sectionIndex };
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
});

const { handlerId } = toRefs(dropCollect.value);
const { isDragging } = toRefs(collect.value);
const opacity = computed(() => (unref(isDragging) ? 0 : 1));

const setRef = (el: any) => {
  sectionDiv.value = drag(drop(el)) as HTMLDivElement;
};
</script>

<template>
  <div
    :ref="setRef"
    :style="{ opacity }"
    :data-handler-id="handlerId"
    :class="`droppable-section ${
      sectionIndex % 2 === 0 ? 'droppable-section--even' : 'droppable-section--odd'
    }`"
  >
    <div class="droppable-section__header">
      <div class="droppable-section__title-wrapper">
        <div class="droppable-section__title-container">
          <div class="droppable-section__title">
            <IconGripVertical class="h-6 w-6 mb-1" />
            <h3 class="text-lg font-medium">{{ section.sectionTitle }}</h3>
          </div>
          <div class="droppable-chapter__actions">
            <PButton
              type="button"
              variant="text"
              size="small"
              class="p-0"
              @click="() => coursesStore.openSectionModal(sectionIndex)"
            >
              <IconEdit class="h-5 w-5" />
            </PButton>
            <PButton
              type="button"
              variant="text"
              size="small"
              class="p-0"
              @click="() => coursesStore.deleteSection(sectionIndex)"
            >
              <IconTrash2 class="h-5 w-5" />
            </PButton>
          </div>
        </div>

        <p
          v-if="section.sectionDescription"
          class="droppable-section__description"
        >
          {{ section.sectionDescription }}
        </p>
      </div>
    </div>
    <slot />

    <PButton
      type="button"
      variant="outlined"
      size="small"
      @click="() => coursesStore.openChapterModal(sectionIndex, null)"
      class="add-chapter-button group"
    >
      <IconPlus class="add-chapter-button__icon" />
      <span class="add-chapter-button__text"> Add Chapter </span>
    </PButton>
  </div>
</template>
