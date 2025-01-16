<template>
  <div class="completion">
    <div class="completion__content">
      <div class="completion__icon">
        <IconCheck class="w-16 h-16" />
      </div>
      <h1 class="completion__title">COMPLETED</h1>
      <p class="completion__message">
        🎉 You have made a course purchase successfully! 🎉
      </p>
    </div>
    <div class="completion__support">
      <p>
        Need help? Contact our{{ " " }}
        <PButton variant="link" asChild >
          <a href="mailto:support@example.com" class="p-0 m-0 text-primary-700">customer support</a>
        </PButton>
        .
      </p>
    </div>
    <div class="completion__action">
      <NuxtLink to="user/courses"> Go to Courses </NuxtLink>
    </div>
  </div>
</template>
