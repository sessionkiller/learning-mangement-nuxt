<script setup>
const routeStore = useRouteStore();
const { syncRoute } = storeToRefs(routeStore);

const theMenuStore = useTheMenuStore();
const { isExpandedTheMenu, itemsTheMenu } = storeToRefs(theMenuStore);
const { toggleTheMenu } = theMenuStore;

const fontSize = ref(14);

/* TODO: Investigar si hay una forma mejor de hacer esto */
const getBorderStyle = (item) => {
  return (item.color &&
    item.route.params?.projectType &&
    syncRoute.value?.params?.projectType === item.route.params?.projectType &&
    item.route.name === syncRoute.value?.name) ||
    (item.route.name === syncRoute.value?.name &&
      !item.route.params?.projectType) ||
    item.route.name === syncRoute.value?.meta?.props?.parent
    ? {
        background: item.color,
        color: item.textColor,
      }
    : { borderLeft: `5px solid transparent` };
};

watch(
  fontSize,
  (newValue) => {
    const cont = document.getElementsByTagName("html");
    if (cont.length) {
      cont[0].style.fontSize = newValue + "px";
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    :class="[
      'overflow-hidden transition-all duration-300 ease-out h-full',
      isExpandedTheMenu ? 'w-64' : 'w-12',
    ]"
  >
    <PMenu
      data-cy="the-menu"
      :model="itemsTheMenu"
      :pt="{
        root: {
          class: [
            'the-menu bg-transparent border-0 w-64 h-full flex flex-col p-0',
          ],
        },
        start: {
          class: ['flex'],
        },
        content: {
          class: ['border-0', 'hover:bg-gray-200'],
        },
        list: {
          class: ['flex-1 p-0 gap-0'],
        },
        end: {
          class: [
            'p-0 transition-all duration-300 ease-out',
            !isExpandedTheMenu ? ' w-12' : '',
          ],
        },
      }"
    >
      <template #item="{ item }">
        <NuxtLink
          v-if="item.route && item.userCanView"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            class="the-menu__link flex items-center cursor-pointer no-underline w-full"
            :class="{
              active:
                (item.route.params?.projectType &&
                  syncRoute.params?.projectType ===
                    item.route.params?.projectType) ||
                (item.route.name === syncRoute.name &&
                  !item.route.params?.projectType) ||
                item.route.name === syncRoute.meta?.props?.parent,
            }"
            :href="href"
            :style="getBorderStyle(item)"
            @click="navigate"
          >
            <div class="flex items-center">
              <span
                :class="item.icon"
                class="mr-2"
              />
              <!-- <span class="mdi mdi-account" /> -->
              <!-- <MdiIcon :icon="item.icon" /> -->
              <Transition
                enter-active-class="animate__animated animate__fadeIn animate__faster"
                leave-active-class="animate__animated animate__fadeOut animate__faster"
              >
                <span v-show="isExpandedTheMenu">
                  {{ item.label ? item.label : $t(item.translateLabel) }}
                </span>
              </Transition>
            </div>
          </a>
        </NuxtLink>
      </template>
      <template #end>
        <div class="p-2">
          <p class="m-0 opacity-40">BIM CDE</p>
        </div>
        <PDivider class="m-0" />
        <div
          class="flex"
          :class="{
            'items-center': isExpandedTheMenu,
            'flex-col flex-col-reverse': !isExpandedTheMenu,
          }"
        >
          <span
            class="block the-menu__link flex items-center cursor-pointer no-underline w-full hover:bg-gray-200"
            @click="toggleTheMenu"
          >
            <span
              :class="
                !isExpandedTheMenu
                  ? 'pi pi-angle-double-right'
                  : 'pi pi-angle-double-left'
              "
              class="mr-2"
            />
            <Transition
              enter-active-class="animate__animated animate__fadeIn animate__faster"
              leave-active-class="animate__animated animate__fadeOut animate__faster"
            >
              <span v-show="isExpandedTheMenu">Contraer</span>
            </Transition>
          </span>
          <PDivider v-if="isExpandedTheMenu === 'horizontal'" />
          <div class="flex pr-1 pl-1">
            <PButton
              icon="pi pi-plus"
              text
              @click="fontSize++"
            />
            <PButton
              icon="pi pi-minus"
              text
              @click="fontSize--"
            />
          </div>
        </div>
      </template>
    </PMenu>
  </div>
</template>

<style lang="scss" scoped>
.the-menu {
  &__link {
    color: var(--gray-800);
    padding: 0.75rem 1rem 0.75rem calc(1rem - 5px);
    height: 3rem;
    transition: all 0.275s ease-in-out;

    &.active {
      background-color: var(--gray-300);
    }
  }
}
</style>
