<script setup lang="ts">
import { boolean, object, string } from "yup";
import { centsToDollars, createCourseFormData } from "~/lib/utils";

const { params } = useRoute();
const id = params.id as string;

const courseId = computed(() => id)

const { getCourse, updateCourse } = useApi();
const { data: course, isLoading, refetch } = getCourse(courseId);
//   const [getUploadVideoUrl] = useGetUploadVideoUrlMutation();

const coursesStore = useCoursesStore();
const { sections } = storeToRefs(coursesStore);

const schema = object({
  courseTitle: string().min(1, "Title is required"),
  courseDescription: string().min(1, "Description is required"),
  courseCategory: string().min(1, "Category is required"),
  coursePrice: string(),
  courseStatus: boolean(),
});

const { meta, handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    courseTitle: "",
    courseDescription: "",
    courseCategory: "",
    coursePrice: "0",
    courseStatus: false,
  },
});

const [courseTitle] = defineField("courseTitle");
const [courseDescription] = defineField("courseDescription");
const [courseCategory] = defineField("courseCategory");
const [coursePrice] = defineField("coursePrice");
const [courseStatus] = defineField("courseStatus");

const submitForm = handleSubmit(async (values) => {
  if (meta.value.valid) {
    try {
      //   const updatedSections = await uploadAllVideos(
      //     sections,
      //     id,
      //     getUploadVideoUrl
      //   );

      const formData = createCourseFormData(values, sections.value);

      await updateCourse.mutateAsync({
        courseId: id,
        formData,
      });

      refetch();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  }
});

const courseCategories = ref([
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
]);

watch(
  course,
  (newCourse) => {
    if (newCourse) {
      resetForm({
        values: {
          courseTitle: newCourse.title,
          courseDescription: newCourse.description,
          courseCategory: newCourse.category,
          coursePrice: centsToDollars(newCourse.price),
          courseStatus: newCourse.status === "Published",
        },
      });
      coursesStore.setSections(newCourse.sections || []);
    }
  },
  { immediate: true }
);
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <div class="flex items-center gap-5 mb-5">
        <button
          class="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          @click="() => $router.push('/teacher/courses')"
        >
          <IconArrowLeft class="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <form @submit.prevent="submitForm">
        <Header
          title="Course Setup"
          subtitle="Complete all fields and save your course"
        >
          <template #rightElement>
            <div class="flex items-center space-x-4">
              <BaseFormField prop="courseStatus">
                <label
                  class="cursor-pointer flex items-center gap-2"
                  :class="`text-sm font-medium ${
                    courseStatus ? 'text-green-500' : 'text-yellow-500'
                  }`"
                >
                  <PToggleSwitch name="courseStatus" v-model="courseStatus" />
                  <span>{{ courseStatus ? "Published" : "Draft" }}</span>
                </label>
              </BaseFormField>

              <PButton
                type="submit"
                class="bg-primary-700 hover:bg-primary-600"
              >
                {{ courseStatus ? "Update Published Course" : "Save Draft" }}
              </PButton>
            </div>
          </template>
        </Header>

        <div
          class="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans"
        >
          <div class="basis-1/2">
            <div class="space-y-4">
              <BaseFormField prop="courseTitle" label="Course Title">
                <PInputText
                  name="courseTitle"
                  type="text"
                  v-model="courseTitle"
                  placeholder="Write course title here"
                  class="toolbar__search"
                />
              </BaseFormField>

              <BaseFormField
                prop="courseDescription"
                label="Course Description"
              >
                <PTextarea
                  name="courseDescription"
                  rows="5"
                  cols="30"
                  v-model="courseDescription"
                  placeholder="Write course description here"
                />
              </BaseFormField>

              <BaseFormField prop="courseCategory" label="Course Category">
                <PSelect
                  name="courseCategory"
                  :options="courseCategories"
                  v-model="courseCategory"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select category here"
                />
              </BaseFormField>

              <BaseFormField prop="coursePrice" label="Course Price">
                <PInputText
                  name="coursePrice"
                  type="number"
                  v-model="coursePrice"
                  placeholder="0"
                />
              </BaseFormField>
            </div>
          </div>

          <div
            class="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2"
          >
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-2xl font-semibold text-secondary-foreground">
                Sections
              </h2>

              <PButton
                type="button"
                variant="outlined"
                size="small"
                @click="() => coursesStore.openSectionModal(null)"
                class="border-none text-primary-700 group"
              >
                <IconPlus
                  class="mr-1 h-4 w-4 text-primary-700 group-hover:white-100"
                />
                <span class="text-primary-700 group-hover:white-100">
                  Add Section
                </span>
              </PButton>
            </div>

            <p v-if="isLoading">Loading course content...</p>
            <div v-else-if="sections.length > 0">
              <DroppableComponent /> 
            </div>
            <p v-else>No sections available</p>
          </div>
        </div>
      </form>

      <ChapterModal />
      <SectionModal />
    </div>
  </NuxtLayout>
</template>
