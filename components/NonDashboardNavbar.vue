<script setup>
import { dark } from "@clerk/themes";

const { user } = useUser();
const userRole = computed(() => user.value?.publicMetadata?.userType);
</script>

<template>
  <nav class="nondashboard-navbar">
    <div class="nondashboard-navbar__container">
      <div class="nondashboard-navbar__search">
        <NuxtLink to="/" class="nondashboard-navbar__brand">
          Learn.io
        </NuxtLink>
        <div class="flex items-center gap-4">
          <div class="relative group">
            <NuxtLink to="/search" class="nondashboard-navbar__search-input">
              <span class="hidden sm:inline">Search Courses</span>
              <span class="sm:hidden">Search</span>
            </NuxtLink>
            <IconBookOpen class="nondashboard-navbar__search-icon" size="18" />
          </div>
        </div>
      </div>
      <div class="nondashboard-navbar__actions">
        <button class="nondashboard-navbar__notification-button">
          <span class="nondashboard-navbar__notification-indicator"></span>
          <IconBell class="nondashboard-navbar__notification-icon" />
        </button>

        <SignedIn>
          <UserButton
            :appearance="{
              baseTheme: dark,
              elements: {
                userButtonOuterIdentifier: 'text-customgreys-dirtyGrey',
                userButtonBox: 'scale-90 sm:scale-100',
              },
            }"
            showName="true"
            userProfileMode="navigation"
            :userProfileUrl="
              userRole === 'teacher' ? '/teacher/profile' : '/user/profile'
            "
          />
        </SignedIn>
        <SignedOut>
          <NuxtLink
            to="/signin"
            class="nondashboard-navbar__auth-button--login"
            scroll="false"
          >
            Log in
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="nondashboard-navbar__auth-button--signup"
            scroll="false"
          >
            Sign up
          </NuxtLink>
        </SignedOut>
      </div>
    </div>
  </nav>
</template>
