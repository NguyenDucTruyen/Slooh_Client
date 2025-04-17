<script setup lang="ts">
import { LoaiSlide, type Slide } from '@/types'

const slides = defineModel('slides', {
  default: () => [],
  type: Array as () => Slide[],
})
const selectedSlideId = defineModel('selected-slide-id')
</script>

<template>
  <div class="h-full space-y-2">
    <div class="w-full border-r py-2 space-y-2  overflow-y-auto">
      <div
        v-for="(slide, index) in slides" :key="slide.maSlide"
        class="card"
        :class="{ 'card-active': selectedSlideId === slide.maSlide }"
        @click="selectedSlideId = slide.maSlide"
      >
        <div class="action">
          <Button
            variant="secondary"
            class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
            title="Nhân đôi"
          >
            <Icon name="IconCopy" class="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
            title="Xóa"
          >
            <Icon name="IconTrash" class="w-4 h-4" />
          </Button>
        </div>
        <div class="text-sm font-semibold text-gray-600">
          {{ index + 1 }}.
          {{ slide.loaiSlide === LoaiSlide.NOI_DUNG ? 'Slide' : 'Câu hỏi' }}
        </div>
        <div
          class="card-content"
          :class="[
            selectedSlideId === slide.maSlide ? 'border-accent' : 'border-transparent',
          ]"
          :style="{ backgroundImage: slide.hinhNen ? `url(${slide.hinhNen})` : 'hsl(var(--card))' }"
        >
          <div class="mt-1 box-border">
            <p class="text-[13px] font-medium text-black truncate">
              {{ slide.tieuDe }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Thêm nút -->
    <div class="space-y-2 pt-4 h-28 left-0 flex flex-col items-center justify-center w-full pl-4 pr-2 sticky bottom-0 bg-card">
      <Button
        class="w-full"
      >
        Thêm slide
      </Button>
      <Button
        class="w-full"
        variant="secondary"
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
