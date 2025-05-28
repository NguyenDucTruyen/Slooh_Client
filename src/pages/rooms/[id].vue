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
import { useRoomStore } from '@/stores/room'
import { CachTrinhBay, LoaiSlide, type Phong, type Slide } from '@/types'
import { useAsyncState } from '@vueuse/core'

const router = useRouter()
const roomStore = useRoomStore()
const route = useRoute()
const isPanelVisible = ref(true)
const slides = ref<Slide[]>()

const { state: roomDetail, isLoading, error } = useAsyncState<Phong>(() => {
  return (async () => {
    const response = await roomStore.getRoomDetail(route.params.id as string)
    slides.value = response.trangs
    return response
  })()
}, null as unknown as Phong, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

const selectedSlideId = ref<string>(slides.value?.[0]?.maTrang || '')
const indexSelectedSlide = computed(() => {
  return slides.value?.findIndex(slide => slide.maTrang === selectedSlideId.value) ?? -1
})

const currentBackground = computed(() => {
  return slides.value?.[indexSelectedSlide.value]?.hinhNen
    ? `url(${slides.value?.[indexSelectedSlide.value]?.hinhNen?.replace('/w_300', '')})`
    : 'hsl(var(--card))'
})
function handleSave() {
  roomDetail.value.trangs = slides.value || []
  console.log(roomDetail.value)
}
function handleBack() {
  if (roomDetail.value?.maKenh) {
    router.push({
      name: 'channels-id',
      params: { id: roomDetail.value.maKenh },
    })
  }
  else {
    router.push({ name: 'PublicRoom' })
  }
}
</script>

<template>
  <div class="room-layout">
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div
      v-if="isLoading"
      class="text-gray-500 text-center flex items-center justify-center h-full"
    >
      Đang tải dữ liệu phòng...
    </div>
    <template v-if="!isLoading && roomDetail">
      <EditNavBar
        v-model:title="roomDetail.tenPhong"
        class="navbar"
        @save="handleSave"
        @back="handleBack"
      />
      <div class="body">
        <div class="slide-navigator">
          <SlideNavigator
            v-model:selected-slide-id="selectedSlideId"
            v-model:slides="slides"
            :index-selected-slide="indexSelectedSlide"
          />
        </div>
        <div class="main-content">
          <div
            class="content-area"
            :class="[isPanelVisible ? 'w-[calc(100%-260px)]' : 'w-full']"
            :style="{ backgroundImage: currentBackground }"
          />          <PanelArea
            v-if="slides?.length"
            v-model:visible="isPanelVisible"
            v-model:slide="slides[indexSelectedSlide]"
          />
        </div>
      </div>
    </template>
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
