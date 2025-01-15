<script setup>
import { dark } from "@clerk/themes";
import { cn } from "~/lib/utils";

defineProps({
  isCoursePage: {
    type: Boolean,
    default: false,
  },
});

const { toggleSidebar } = inject("isSidebarExpanded");

const { user } = useUser();
const userRole = user.value?.publicMetadata?.userType;
</script>

<template>
  <nav class="dashboard-navbar">
    <div class="dashboard-navbar__container">
      <div class="dashboard-navbar__search">
        <div class="md:hidden">
          <PButton
            variant="text"
            class="h-7 w-7 !p-1 dashboard-navbar__sidebar-trigger !bg-transparent  !text-customgreys-dirtyGrey hover:!text-white-50"
            @click="toggleSidebar"
          >
            <IconPanelLeft />
            <span class="sr-only">Toggle Sidebar</span>
          </PButton>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group">
            <NuxtLink
              to="/search"
              :class="
                cn(
                  'dashboard-navbar__search-input',
                  isCoursePage && '!bg-customgreys-secondarybg'
                )
              "
            >
              <span class="hidden sm:inline">Search Courses</span>
              <span class="sm:hidden">Search</span>
            </NuxtLink>
            <IconBookOpen class="dashboard-navbar__search-icon" size="18" />
          </div>
        </div>
      </div>
      <div class="dashboard-navbar__actions">
        <button class="nondashboard-navbar__notification-button">
          <span class="nondashboard-navbar__notification-indicator"></span>
          <IconBell class="nondashboard-navbar__notification-icon" />
        </button>

        <UserButton
          :appearance="{
            baseTheme: dark,
            elements: {
              userButtonOuterIdentifier: 'text-customgreys-dirtyGrey',
              userButtonBox: 'scale-90 sm:scale-100',
            },
          }"
          :showName="true"
          userProfileMode="navigation"
          :userProfileUrl="
            userRole === 'teacher' ? '/teacher/profile' : '/user/profile'
          "
        />
      </div>
    </div>
  </nav>
</template>
