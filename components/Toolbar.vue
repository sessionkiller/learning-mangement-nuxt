<script setup>
const emit = defineEmits(["search-change", "category-change"]);

const handleSearchChange = (value) => {
  emit("search-change", value);
};

const handleCategoryChange = (value) => {
  emit("category-change", value);
};

const courseCategories = ref([
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
]);
</script>

<template>
  <div className="toolbar">
    <PInputText
      type="text"
      @value-change="handleSearchChange"
      placeholder="Search courses"
      class="toolbar__search"
    />

    <PSelect
      :options="courseCategories"
      optionLabel="label"
      optionValue="value"
      placeholder="Categories"
      @value-change="handleCategoryChange"
      class="toolbar__select"
    />
  </div>
</template>
