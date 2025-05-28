<script setup lang="ts">
import type { Slide } from '@/types'
import { listThemes } from '@/assets/data/slide-data'

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const visible = defineModel('visible')
const themes = ref(listThemes)
</script>

<template>
  <div
    class="panel-area transition-transform duration-300 shadow-xl"
    :class="{ 'translate-x-0': visible, 'translate-x-full': !visible }"
  >
    <div class="relative w-full h-full flex flex-col items-center">
      <Tabs default-value="edit" class="w-full">
        <TabsList class="w-full rounded-none">
          <TabsTrigger value="edit">
            <Icon name="IconEdit" class="w-6 h-6" />
            Điều chỉnh
          </TabsTrigger>
          <TabsTrigger value="thêm">
            <Icon name="IconTheme" class="w-6 h-6" />
            Hình nền
          </TabsTrigger>
        </TabsList>
        <!-- Edit Slide -->
        <TabsContent value="edit" class="h-[calc(100%-60px)] ">
          <div class="w-full h-full flex flex-col items-center justify-center">
            <div class="w-full h-full flex flex-col items-center justify-center">
              <Icon name="IconEdit" class="w-6 h-6" />
              <span class="text-lg">Chỉnh sửa</span>
            </div>
          </div>
        </TabsContent>
        <!-- Theme Slide -->
        <TabsContent value="thêm" class="h-[calc(100vh-130px)] overflow-y-auto p-2">
          <div
            v-for="(item, index) in themes"
            :key="item.session"
            class="grid"
            :class="{ ' mt-5': index > 0 }"
          >
            <span class="text-lg mb-1">
              {{ item.session }}
            </span>
            <div class="grid grid-cols-2 gap-2">
              <template
                v-for="theme in item.list"
                :key="theme.id"
              >
                <div
                  class="w-full h-20 rounded-md overflow-hidden relative cursor-pointer hover:scale-105 transition-transform duration-300 border-[3px]"
                  :class="[theme.image === slide?.hinhNen ? 'border-ring' : 'border-transparent']"
                  @click="slide.hinhNen = theme.image"
                >
                  <img :src="theme.image" alt="" class="w-full h-full object-cover rounded-sm">
                  <span class="absolute left-0 bottom-0 text-sm text-center w-full p-1 bg-gradient-to-tr from-transparent to-black/50 text-white">
                    {{ theme.name }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <!-- Icon Toggle Show Panel -->
      <Button
        variant="secondary"
        class="py-4 px-2 rounded-s-lg rounded-e-none absolute top-1/2 left-[1px] -translate-x-full -translate-y-1/2 bg-card hover:bg-card-hover shadow-lg"
        @click="() => visible = !visible"
      >
        <Icon
          name="IconChevronLeft"
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': visible }"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .panel-area {
    @apply bg-card h-full w-[260px] absolute right-0 top-0;
  }
</style>
