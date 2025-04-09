<script setup>
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const data = ref({
  groupA: [
    {
      id: 1,
      icon: 'IconPlus',
      title: 'Home',
      url: '/home',
    },
    {
      id: 2,
      icon: 'IconPlus',
      title: 'Your Playlist',
      url: '/playlist',
      content: 'Login to view your playlist',
      requiredAuthen: true,
    },
  ],
  groupB: [

    {
      id: 4,
      icon: 'IconPlus',
      title: 'Create Song',
      url: '/song/create',
      content: 'Login to create and share song',
      requiredAuthen: true,
    },
    {
      id: 5,
      icon: 'IconPlus',
      title: 'Favorite',
      url: '/favorite',
      content: 'Login to view your favorite songs',
      requiredAuthen: true,
    },
    {
      id: 3,
      icon: 'IconPlus',
      title: 'Create Playlist',
      url: '/playlist/create',
      content: 'Login to create and share playlists',
      requiredAuthen: true,
      type: 'button',

    },
  ],
})
</script>

<template>
  <div
    class="w-full max-lg:fixed h-[100vh] top-24 sm:w-64 lg:block bg-card z-10 transition-all duration-300 ease-in-out rounded-lg shadow-lg overflow-hidden pt-8 pr-8"
    :class="sidebarStore.isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'"
  >
    <button
      class="flex lg:hidden items-center justify-center w-10 h-10 rounded-lg transition duration-200 ease-in-out absolute right-2 top-2"
      :class="sidebarStore.isOpen ? 'bg-muted border border-border' : ''"
      @click="sidebarStore.close()"
    >
      <Icon
        name="IconClose" class="w-6 h-6 text-foreground"
      >
        <title>Close</title>
      </Icon>
    </button>
    <ScrollArea class="w-full" style="height: calc(100% - 6rem)">
      <div
        class="flex flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      >
        <AppSideBarGroup class="mb-8">
          <template v-for="item in data.groupA" :key="item.id">
            <AppSideBarItem v-bind="item" />
          </template>
        </AppSideBarGroup>

        <AppSideBarGroup>
          <template v-for="item in data.groupB" :key="item.id">
            <AppSideBarItem v-bind="item" />
          </template>
        </AppSideBarGroup>
      </div>
    </ScrollArea>
  </div>
</template>
