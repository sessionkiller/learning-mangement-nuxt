<script setup lang="ts">
import { object, string } from "yup";
import { v4 as uuidv4 } from "uuid";

const toast = useToast();
const coursesStore = useCoursesStore();
const { isSectionModalOpen, selectedSectionIndex, sections } =
  storeToRefs(coursesStore);

const section = computed(() => {
  return selectedSectionIndex.value !== null
    ? sections.value[selectedSectionIndex.value]
    : null;
});

const schema = object({
  title: string().min(2, "Title must be at least 2 characters"),
  description: string().min(10, "Description must be at least 10 characters"),
});

const { meta, handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    title: "",
    description: "",
  },
});

const [title] = defineField("title");
const [description] = defineField("description");

const onClose = () => {
  coursesStore.closeSectionModal();
};

const submitForm = handleSubmit(async (values) => {
  if (meta.value.valid) {
    const newSection: Section = {
      sectionId: section.value?.sectionId || uuidv4(),
      sectionTitle: values.title,
      sectionDescription: values.description,
      chapters: section.value?.chapters || [],
    };

    if (selectedSectionIndex.value === null) {
      coursesStore.addSection(newSection);
    } else {
      coursesStore.editSection(selectedSectionIndex.value, newSection);
    }

    toast.add({
      severity: "success",
      detail: `Section added/updated successfully but you need to save the course to apply the changes`,
      life: 3000,
    });
    onClose();
  }
});

watch(
  section,
  (newSection) => {
    if (newSection) {
      resetForm({
        values: {
          title: newSection.sectionTitle,
          description: newSection.sectionDescription,
        },
      });
    } else {
      resetForm({
        values: {
          title: "",
          description: "",
        },
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <CustomModal :is-open="isSectionModalOpen" @on-close="onClose">
    <div class="section-modal">
      <div class="section-modal__header">
        <h2 class="section-modal__title">Add/Edit Section</h2>
        <button @click="onClose" class="section-modal__close">
          <IconX class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="section-modal__form">
        <BaseFormField prop="title" label="Section Title">
          <PInputText
            name="title"
            type="text"
            v-model="title"
            placeholder="Write section title here"
          />
        </BaseFormField>

        <BaseFormField prop="description" label="Section Description">
          <PTextarea
            name="description"
            rows="5"
            cols="30"
            v-model="description"
            placeholder="Write section description here"
          />
        </BaseFormField>

        <div class="section-modal__actions">
          <PButton type="button" variant="outlined" @click="onClose">
            Cancel
          </PButton>
          <PButton type="submit" class="bg-primary-700"> Save </PButton>
        </div>
      </form>
    </div>
  </CustomModal>
</template>
