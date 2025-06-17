<script setup>
import AppSideBarGroup from '@/components/layout/SideBar/AppSideBarGroup.vue'
import AppSideBarItem from '@/components/layout/SideBar/AppSideBarItem.vue'
import { BarChart3 } from 'lucide-vue-next'

const data = ref({
  groupA: [
    {
      id: 1,
      icon: 'IconListUser',
      title: 'Quản lý người dùng',
      url: '/admin',
    },
    {
      id: 2,
      icon: BarChart3,
      title: 'Thống kê hệ thống',
      url: '/admin/statistics',
    },
  ],

})
</script>

<template>
  <div class="flex flex-col duration-200 w-[15rem] bg-transparent ease-linear border-r border-gray-200">
    <div class="flex items-center gap-4 h-16">
      <div
        class="logo-container gap-2 pl-6 cursor-pointer hidden lg:flex items-center"
        @click="$router.push('/')"
      >
        <img
          src="@/assets/images/Logo_Slooh_Horizontal.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>
      <div
        class="logo-container gap-2 pl-1 cursor-pointer hidden max-lg:flex items-center"
        @click="$router.push('/')"
      >
        <img
          src="@/assets/images/Logo_Slooh.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>
    </div>
    <div class="w-full" style="height: calc(100% - 6rem)">
      <div
        class="flex flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden gap-0"
      >
        <AppSideBarGroup class="mb-8">
          <template v-for="item in data.groupA" :key="item.id">
            <AppSideBarItem v-bind="item" />
          </template>
        </AppSideBarGroup>
      </div>
    </div>
  </div>
</template>
