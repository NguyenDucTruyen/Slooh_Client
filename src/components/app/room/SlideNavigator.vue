<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'
import { CachTrinhBay, LoaiSlide, type Slide } from '@/types'
import Draggable from 'vuedraggable'

const { indexSelectedSlide } = defineProps<{
  indexSelectedSlide: number
}>()
const confirmStore = useConfirmStore()
const slides = defineModel('slides', {
  default: () => [],
  type: Array as () => Slide[],
})
const selectedSlideId = defineModel('selected-slide-id')

function updateThuTu() {
  slides.value.forEach((slide, index) => {
    slide.thuTu = index + 1
  })
}
function addQuestion() {
  const newSlide: Slide = {
    maSlide: `new-slide-${Math.random()}`,
    maPhong: '',
    loaiSlide: LoaiSlide.CAU_HOI,
    tieuDe: 'Câu hỏi mới',
    hinhNen: '',
    thuTu: indexSelectedSlide + 1,
    cachTrinhBay: CachTrinhBay.CO_BAN,
  }
  slides.value.splice(indexSelectedSlide + 1, 0, newSlide)
  selectedSlideId.value = newSlide.maSlide
  updateThuTu()
}
function addSlide() {
  const newSlide: Slide = {
    maSlide: `new-slide-${Math.random()}`,
    maPhong: '',
    loaiSlide: LoaiSlide.NOI_DUNG,
    tieuDe: 'Slide mới',
    hinhNen: '',
    thuTu: indexSelectedSlide + 1,
    cachTrinhBay: CachTrinhBay.CO_BAN,
  }
  slides.value.splice(indexSelectedSlide + 1, 0, newSlide)
  selectedSlideId.value = newSlide.maSlide
  updateThuTu()
}
async function deleteSlide(slide: Slide) {
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Xóa slide',
    message: 'Bạn có chắc chắn muốn xóa slide này?',
    cancelText: 'Hủy',
    confirmText: 'Xóa',
  })
  if (!confirm)
    return
  const index = slides.value.findIndex(s => s.maSlide === slide.maSlide)
  if (index !== -1) {
    slides.value.splice(index, 1)
    updateThuTu()
  }
  if (selectedSlideId.value === slide.maSlide) {
    selectedSlideId.value = slides.value[index]?.maSlide || slides.value[index - 1]?.maSlide || ''
  }
}
function duplicateSlide(slide: Slide) {
  const newID = `new-slide-${Math.random()}`
  const newSlide: Slide = { ...slide, maSlide: newID }
  slides.value.splice(slide.thuTu, 0, newSlide)
  selectedSlideId.value = newID
  updateThuTu()
  selectedSlideId.value = newID
}
</script>

<template>
  <div class="h-full space-y-2">
    <div class="w-full border-r py-2 space-y-2  overflow-y-auto">
      <Draggable
        v-model="slides"
        group="slide"
        item-key="thuTu"
        @update="updateThuTu"
      >
        <template #item="{ element }">
          <div
            class="card"
            :class="{ 'card-active': selectedSlideId === element.maSlide }"
            @click="selectedSlideId = element.maSlide"
          >
            <div class="action">
              <Button
                variant="secondary"
                class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
                title="Nhân đôi"
                @click.stop="duplicateSlide(element)"
              >
                <Icon name="IconCopy" class="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
                title="Xóa"
                @click.stop="deleteSlide(element)"
              >
                <Icon name="IconTrash" class="w-4 h-4" />
              </Button>
            </div>
            <div class="text-sm font-semibold text-gray-600">
              {{ element.thuTu }}.
              {{ element.loaiSlide === LoaiSlide.NOI_DUNG ? 'Slide' : 'Câu hỏi' }}
            </div>
            <div
              class="card-content"
              :class="[
                selectedSlideId === element.maSlide ? 'border-accent' : '',
              ]"
              :style="{ backgroundImage: element.hinhNen ? `url(${element.hinhNen})` : 'hsl(var(--card))' }"
            >
              <div class="mt-1 box-border">
                <p class="text-[13px] font-medium text-black truncate">
                  {{ element.tieuDe }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Draggable>
    </div>

    <!-- Thêm nút -->
    <div class="space-y-2 pt-4 h-28 left-0 flex flex-col items-center justify-center w-full pl-4 pr-2 sticky bottom-0 bg-card">
      <Button
        class="w-full"
        @click="addSlide"
      >
        Thêm slide
      </Button>
      <Button
        class="w-full"
        variant="secondary"
        @click="addQuestion"
      >
        Thêm câu hỏi
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply p-2 pl-8 cursor-pointer bg-card relative;
  .card-content {
    @apply rounded-md p-2 border-2 bg-gray-200 dark:bg-gray-200/20 h-28;
  }
  .action {
    @apply absolute flex-col top-1/2 -translate-y-3 left-1 space-y-1 hidden;
  }
  &:hover {
    .card-content {
      @apply border-accent;
    }
    .action {
      @apply flex;
    }
  }
}
.card-active {
  @apply bg-accent/10
}
</style>
