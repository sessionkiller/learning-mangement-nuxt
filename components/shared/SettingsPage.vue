<script setup>
const { path: pathname } = useRoute();

const isUserRoute = pathname.startsWith("/user/");
</script>

<template>
  <div className="w-3/5">
    <SharedNotificationSettings
      :title="`${isUserRoute ? 'User' : 'Teacher'} Settings`"
      :subtitle="`Manage your ${
        isUserRoute ? 'user' : 'teacher'
      } notification settings`"
    />
  </div>
</template>
