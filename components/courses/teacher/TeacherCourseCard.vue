<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["on-edit", "on-delete"]);

const onEdit = () => emit("on-edit", props.course);
const onDelete = () => emit("on-delete", props.course);
</script>

<template>
  <PCard class="course-card-teacher group">
    <template #header class="course-card-teacher__header">
      <NuxtImg
        :src="course.image || '/placeholder.png'"
        :alt="course.title"
        width="370"
        height="150"
        class="course-card-teacher__image"
      />
    </template>
    <template #title class="course-card-teacher__title">
      {{ course.title }}
    </template>
    <template #subtitle class="course-card-teacher__category">
      {{ course.category }}
    </template>
    <template #content>
      <div class="flex flex-col">
        <p class="text-sm mb-2">
          Status:{{ " " }}
          <span
            :class="
              cn(
                'font-semibold px-2 py-1 rounded',
                course.status === 'Published'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              )
            "
          >
            {{ course.status }}
          </span>
        </p>
        <p
          v-if="course.enrollments.length"
          class="ml-1 mt-1 inline-block text-secondary bg-secondary/10 text-sm font-normal"
        >
          <span class="font-bold text-white-100">
            {{ course.enrollments.length }} </span
          >{{ " " }} Student{{ course.enrollments.length > 1 ? "s" : "" }}
          Enrolled
        </p>
      </div>

      <div class="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
        <template v-if="isOwner">
          <div>
            <PButton class="course-card-teacher__edit-button" @click="onEdit">
              <IconPencil class="w-4 h-4 mr-2" />
              Edit
            </PButton>
          </div>
          <div>
            <PButton
              class="course-card-teacher__delete-button"
              @click="onDelete"
            >
              <IconTrash2 class="w-4 h-4 mr-2" />
              Delete
            </PButton>
          </div>
        </template>
        <p v-else class="text-sm text-gray-500 italic">View Only</p>
      </div>
    </template>
  </PCard>
</template>
