<route>
    {
        meta: {
            layout: "empty",
            title: "Chỉnh sửa",
        }
    }
</route>

<script setup lang="ts">
import { listSlides } from '@/assets/data/slide-data'
import { CachTrinhBay, LoaiSlide, type Slide } from '@/types'

const isPanelVisible = ref(true)
const slides = ref<Slide[]>(listSlides)
const selectedSlideId = ref<string>(slides.value[0].maSlide)
const indexSelectedSlide = computed(() => {
  return slides.value.findIndex(slide => slide.maSlide === selectedSlideId.value)
})
const currentBackground = computed(() => {
  return slides.value[indexSelectedSlide.value].hinhNen
    ? `url(${slides.value[indexSelectedSlide.value].hinhNen?.replace('/w_300', '')})`
    : 'hsl(var(--card))'
})
</script>

<template>
  <div class="room-layout">
    <EditNavBar class="navbar" />
    <div class="body">
      <div class="slide-navigator">
        <SlideNavigator
          v-model:selected-slide-id="selectedSlideId"
          v-model:slides="slides"
        />
      </div>
      <div class="main-content">
        <div
          class="content-area"
          :class="[isPanelVisible ? 'w-[calc(100%-260px)]' : 'w-full']"
          :style="{ backgroundImage: currentBackground }"
        />
        <PanelArea
          v-model:visible="isPanelVisible"
          v-model:slide="slides[indexSelectedSlide]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-layout {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
  "navbar"
  "body";
  }

  .navbar {
    grid-area: navbar;
  }
  .body {
    @apply flex;
    grid-area: body;
    height: calc(100vh - 80px);
  }
  .slide-navigator {
    @apply bg-card shadow-lg h-full overflow-y-auto w-[200px] relative;
  }
  .main-content {
    @apply bg-card shadow-lg h-full w-[calc(100%-200px)] relative;
  }
  .content-area{
    @apply bg-card h-full transition-[width] duration-300;
    background-size: cover;
    overflow-y: auto;
  }
</style>
