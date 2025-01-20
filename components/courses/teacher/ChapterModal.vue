<script setup lang="ts">
import { mixed, object, string } from "yup";
import { v4 as uuidv4 } from "uuid";

const toast = useToast();
const coursesStore = useCoursesStore();
const {
  isChapterModalOpen,
  selectedSectionIndex,
  selectedChapterIndex,
  sections,
} = storeToRefs(coursesStore);

const chapter = computed(() => {
  return selectedSectionIndex.value !== null &&
    selectedChapterIndex.value !== null
    ? sections.value[selectedSectionIndex.value].chapters[
        selectedChapterIndex.value
      ]
    : undefined;
});

const schema = object({
  title: string().min(2, "Title must be at least 2 characters"),
  content: string().min(10, "Content must be at least 10 characters"),
  video: mixed()
    .oneOf([string(), mixed((input): input is File => input instanceof File)])
    .optional(),
});

const { meta, handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    title: "",
    content: "",
    video: "",
  },
});

const [title] = defineField("title");
const [content] = defineField("content");
const [video] = defineField("video");

const onClose = () => {
  coursesStore.closeChapterModal();
};

const submitForm = handleSubmit(async (values) => {
  if (selectedSectionIndex.value === null) return;
  if (meta.value.valid) {
    const newChapter: Chapter = {
      chapterId: chapter.value?.chapterId || uuidv4(),
      title: values.title,
      content: values.content,
      type: values.video ? "Video" : "Text",
      video: values.video,
    };

    if (selectedChapterIndex.value === null) {
      coursesStore.addChapter(selectedSectionIndex.value, newChapter);
    } else {
      coursesStore.editChapter(
        selectedSectionIndex.value,
        selectedChapterIndex.value,
        newChapter
      );
    }

    toast.add({
      severity: "success",
      detail: `Chapter added/updated successfully but you need to save the course to apply the changes`,
      life: 3000,
    });
    onClose();
  }
});

const onChange = (e: any) => {
  const file = e?.target?.files?.[0];
  if (file) {
    video.value = file
  }
};

watch(
  chapter,
  (newChapter) => {
    if (newChapter) {
      resetForm({
        values: {
          title: newChapter.title,
          content: newChapter.content,
          video: (newChapter.video || "") as string,
        },
      });
    } else {
      resetForm({
        values: {
          title: "",
          content: "",
          video: "",
        },
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <CustomModal :is-open="isChapterModalOpen" @on-close="onClose">
    <div class="chapter-modal">
      <div class="chapter-modal__header">
        <h2 class="chapter-modal__title">Add/Edit Chapter</h2>
        <button @click="onClose" class="chapter-modal__close">
          <IconX class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="chapter-modal__form">
        <BaseFormField prop="title" label="Chapter Title">
          <PInputText
            name="title"
            type="text"
            v-model="title"
            placeholder="Write chapter title here"
          />
        </BaseFormField>

        <BaseFormField prop="content" label="Chapter Content">
          <PTextarea
            name="content"
            rows="5"
            cols="30"
            v-model="content"
            placeholder="Write chapter content here"
          />
        </BaseFormField>

        <BaseFormField prop="video" label="Chapter Video">
          <div>
            <PInputText
              type="file"
              accept="video/*"
              @change="onChange"
              class="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
            />
            <div
              v-if="typeof video === 'string' && video"
              class="my-2 text-sm text-gray-600"
            >
              Current video: {{ video.split("/").pop() }}
            </div>

            <div v-else-if="video" class="my-2 text-sm text-gray-600">
              Selected file: {{ (video as unknown as File)?.name }}
            </div>
          </div>
        </BaseFormField>

        <div class="chapter-modal__actions">
          <PButton type="button" variant="outlined" @click="onClose">
            Cancel
          </PButton>
          <PButton type="submit" class="bg-primary-700"> Save </PButton>
        </div>
      </form>
    </div>
  </CustomModal>
</template>
