<script setup>
import { cn } from "~/lib/utils";

const { user } = useUser();
const clerk = useClerk();
const { path: pathname } = useRoute();
const { isSidebarExpanded, toggleSidebar } = inject("isSidebarExpanded");

const navLinks = {
  student: [
    { icon: "BookOpen", label: "Courses", href: "/user/courses" },
    { icon: "Briefcase", label: "Billing", href: "/user/billing" },
    { icon: "User", label: "Profile", href: "/user/profile" },
    { icon: "Settings", label: "Settings", href: "/user/settings" },
  ],
  teacher: [
    { icon: "BookOpen", label: "Courses", href: "/teacher/courses" },
    { icon: "DollarSign", label: "Billing", href: "/teacher/billing" },
    { icon: "User", label: "Profile", href: "/teacher/profile" },
    { icon: "Settings", label: "Settings", href: "/teacher/settings" },
  ],
};

const userType = user.value?.publicMetadata?.userType || "student";
const currentNavLinks = ref(navLinks[userType]);
</script>

<template>
  <Sidebar>
    <PMenu
      data-cy="the-menu"
      :model="currentNavLinks"
      :pt="{
        root: {
          class: [
            '!bg-customgreys-primarybg !border-none shadow-lg w-64 flex flex-col p-0',
          ],
          style: {
            height: '100vh',
          },
        },
        start: {
          class: ['flex flex-col gap-2 p-2'],
        },
        content: {
          class: ['border-0', 'hover:bg-gray-200'],
        },
        list: {
          class: ['flex-1 !p-0 !gap-0 !mt-5'],
        },
        itemContent: {
          class: 'hover:!bg-customgreys-secondarybg',
        },
        end: {
          class: [
            'transition-all duration-300 ease-out flex flex-col gap-2 p-2',
            !isSidebarExpanded ? ' w-12' : '',
          ],
        },
      }"
    >
      <template #start>
        <div :class="cn('p-2', !isSidebarExpanded && 'px-0')">
          <div
            :class="
              cn(
                'app-sidebar__logo-container group cursor-pointer hover:bg-customgreys-secondarybg mt-5',
                !isSidebarExpanded && '!px-0'
              )
            "
            @click="toggleSidebar"
          >
            <div class="app-sidebar__logo-wrapper">
              <NuxtImg
                src="/logo.svg"
                alt="Logo"
                width="25"
                height="20"
                class="app-sidebar__logo"
              />
              <p class="app-sidebar__title text-white-50">Learn.io</p>
            </div>
            <IconPanelLeft class="app-sidebar__collapse-icon" />
          </div>
        </div>
      </template>
      <template #item="{ item }">
        <NuxtLink v-slot="{ href, navigate }" :to="item.href" custom>
          <a
            v-ripple
            :class="
              cn(
                'app-sidebar__nav-item flex items-center w-full h-12 relative p-8 gap-4',
                pathname.startsWith(href) && 'bg-gray-800',
                !pathname.startsWith(href) && 'text-customgreys-dirtyGrey',
                !isSidebarExpanded && 'px-0 w-12 justify-center'
              )
            "
            :href="href"
            @click="navigate"
          >
            <SidebarIcon
              :name="item.icon"
              :class-name="
                cn(
                  'w-4 h-4',
                  pathname.startsWith(href) ? 'text-white-50' : 'text-gray-500'
                )
              "
            />
            <Transition
              enter-active-class="animate__animated animate__fadeIn animate__faster"
              leave-active-class="animate__animated animate__fadeOut animate__faster"
            >
              <span
                v-show="isSidebarExpanded"
                :class="
                  cn(
                    'app-sidebar__nav-text',
                    pathname.startsWith(href)
                      ? 'text-white-50'
                      : 'text-gray-500'
                  )
                "
              >
                {{ item.label }}
              </span>
            </Transition>

            <div
              v-if="pathname.startsWith(href)"
              className="app-sidebar__active-indicator"
            />
          </a>
        </NuxtLink>
      </template>
      <template #end>
        <button
          @click="() => clerk.signOut()"
          :class="
            cn(
              'app-sidebar__signout flex items-center w-full hover:text-white-50 p-2 gap-2',
              !isSidebarExpanded && '!px-2 w-12 justify-center'
            )
          "
        >
          <IconLogOut class="mr-2 w-4 h-4" />
          <Transition
            enter-active-class="animate__animated animate__fadeIn animate__faster"
            leave-active-class="animate__animated animate__fadeOut animate__faster"
          >
            <span v-show="isSidebarExpanded">Sign out</span>
          </Transition>
        </button>
      </template>
    </PMenu>
  </Sidebar>
</template>
