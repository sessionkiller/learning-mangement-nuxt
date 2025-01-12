<script setup>
import { dark } from "@clerk/themes";

const { path: pathname } = useRoute();

const url = pathname.startsWith("/user/")
  ? "/user/profile"
  : "/teacher/profile";
</script>

<template>
  <Header title="Profile" subtitle="View your profile" />
  <UserProfile
    :path="url"
    routing="path"
    :appearance="{
      baseTheme: dark,
      elements: {
        scrollBox: 'bg-customgreys-darkGrey',
        navbar: {
          '& > div:nth-child(1)': {
            background: 'none',
          },
        },
      },
    }"
  />
</template>
