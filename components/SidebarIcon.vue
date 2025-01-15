<script setup>
import {
  BookOpen,
  Briefcase,
  User,
  Settings,
  DollarSign,
} from "lucide-vue-next";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: String,
});

const icons = {
  BookOpen,
  Briefcase,
  User,
  Settings,
  DollarSign,
};

const icon = computed(() => icons[props.name]);
</script>

<template>
  <component :is="icon" :class="className" />
</template>
