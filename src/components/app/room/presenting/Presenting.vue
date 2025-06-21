<script setup lang="ts">
import type { Slide } from '@/types'
import { cn } from '@/lib/utils'
import { useConfirmStore } from '@/stores/confirm'

interface EmitEvents {
  (event: 'next'): void
  (event: 'previous'): void
  (event: 'exit'): void
}
defineProps<{
  slide: Slide
  current: number
  length: number
}>()
const emit = defineEmits<EmitEvents>()
const confirmStore = useConfirmStore()

const showNavigation = ref(true)
const isFullscreen = ref(false)
const isMouseOverNavigation = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null
= setTimeout(() => {
  showNavigation.value = false
}, 3000)

function requestFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
  else {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  }
}
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      emit('previous')
      resetNavigationTimeout()
      break
    case 'ArrowRight':
      emit('next')
      resetNavigationTimeout()
      break
    case ' ':
      toggleNavigationVisibility()
      break
    case 'f':
      requestFullscreen()
      break
  }
}
function handleMouseOverNavigation() {
  isMouseOverNavigation.value = true
  showNavigation.value = true
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}
function toggleNavigationVisibility() {
  showNavigation.value = !showNavigation.value
  resetNavigationTimeout()
}
function resetNavigationTimeout() {
  if (timeoutId)
    clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    showNavigation.value = false
  }, 3000)
}
function handleMouseMove() {
  if (!showNavigation.value || isMouseOverNavigation.value)
    return
  resetNavigationTimeout()
}

async function handleExit() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Kết thúc trình chiếu',
    message: 'Bạn có chắc chắn muốn kết thúc trình chiếu không?',
    confirmText: 'Kết thúc',
    cancelText: 'Hủy',
  })
  if (result) {
    emit('exit')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="bg-slate-200 group z-20 h-full"
    @click="toggleNavigationVisibility"
    @mousemove="handleMouseMove"
  >
    <SlideEditor
      :slide="slide"
    />
    <div
      :class="
        cn('absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2  p-2 rounded-md bg-white/70 backdrop-blur-md items-center',
           'transition-opacity duration-300 opacity-0',
           { 'opacity-100': showNavigation },
        )"
      @click.stop
      @mouseenter="handleMouseOverNavigation"
      @mouseleave="() => { isMouseOverNavigation = false }"
    >
      <Button
        variant="destructive"
        @click="handleExit"
      >
        Kết thúc
      </Button>
      <Separator orientation="vertical" class="bg-slate-400 h-8 rounded-md" />
      <div class="flex gap-1 items-center text-xl font-semibold text-slate-700">
        <Button
          variant="outline"
          class="rounded-sm"
          @click="emit('previous')"
        >
          <Icon name="IconChevronLeft" class="w-5 h-5" />
        </Button>
        {{ current + 1 }} / {{ length }}
        <Button
          variant="outline"
          class="rounded-sm"
          @click="emit('next')"
        >
          <Icon name="IconChevronRight" class="w-5 h-5" />
        </Button>
      </div>
      <Separator orientation="vertical" class="bg-slate-400 h-8 rounded-md" />
      <Button
        variant="outline"
        class="rounded-sm"
        :title="isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'"
        @click="requestFullscreen"
      >
        <Icon
          v-if="isFullscreen"
          name="IconZoomIn" class="w-6 h-6"
        />

        <Icon
          v-else
          name="IconZoomOut" class="w-6 h-6"
        />
      </Button>
    </div>
  </div>
</template>
