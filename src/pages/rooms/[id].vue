<route>
    {
        meta: {
            layout: "empty",
            title: "Chỉnh sửa",
        }
    }
</route>

<script setup lang="ts">
import type { BodyUpdateRoom, Phong, Slide, UpdateSlide } from '@/types'
import SlideEditor from '@/components/common/SlideEditor.vue'
import { toast } from '@/components/ui/toast'
import { useRoomStore } from '@/stores/room'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

const router = useRouter()
const roomStore = useRoomStore()
const route = useRoute()
const isPanelVisible = ref(true)
const slides = ref<Slide[]>()
const selectedSlideId = ref<string>()

const { state: roomDetail, isLoading, error, execute: fetchDetail } = useAsyncState<Phong>(() => {
  return (async () => {
    const response = await roomStore.getRoomDetail(route.params.id as string)
    slides.value = response.trangs
    selectedSlideId.value = response.trangs?.[0]?.maTrang || ''
    return response
  })()
}, null as unknown as Phong, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

const indexSelectedSlide = computed(() => {
  return slides.value?.findIndex(slide => slide.maTrang === selectedSlideId.value) ?? -1
})

async function handleSave() {
  const formatData: BodyUpdateRoom = {
    tenPhong: roomDetail.value.tenPhong,
    hoatDong: roomDetail.value.hoatDong,
    trangThai: roomDetail.value.trangThai,
    danhSachTrang: (slides.value ?? []).map((slide: Slide): UpdateSlide => ({
      loaiTrang: slide.loaiTrang,
      tieuDe: slide.tieuDe,
      hinhAnh: slide.hinhAnh,
      hinhNen: slide.hinhNen,
      cachTrinhBay: slide.cachTrinhBay,
      noiDung: slide.noiDung,
      thoiGianGioiHan: slide.thoiGianGioiHan,
      diem: slide.diem,
      loaiCauTraLoi: slide.loaiCauTraLoi,
      danhSachLuaChon: slide.luaChon,
    })),
  }

  await roomStore.updateRoom(roomDetail.value.maPhong, formatData)
  await fetchDetail()
  toast({
    title: 'Cập nhật thành công',
    description: 'Phòng đã được cập nhật thành công.',
  })
  isPanelVisible.value = false
  setTimeout(() => {
    isPanelVisible.value = true
  }, 100)
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
          <SlideEditor
            v-if="slides?.length && indexSelectedSlide !== -1"
            v-model:slide="slides[indexSelectedSlide]"
            :visible="isPanelVisible"
          />
          <PanelArea
            v-if="slides?.length && indexSelectedSlide !== -1"
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
  }  /* content-area styles moved to SlideEditor.vue */
</style>
