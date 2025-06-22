<script setup lang="ts">
import type { Slide } from '@/types'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

import { useConfirmStore } from '@/stores/confirm'

interface EmitEvents {
  (event: 'next'): void
  (event: 'previous'): void
  (event: 'exit'): void
}
const props = defineProps<{
  slide: Slide
  current: number
  length: number
  tenPhong: string
  pin: string
  memberCount: number
  isConnected: boolean
  qrCode: string
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
      if (props.current === 0)
        return
      emit('previous')
      resetNavigationTimeout()
      break
    case 'ArrowRight':
      if (props.current >= props.length - 1)
        return
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
  requestFullscreen()
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 bg-slate-200 group z-20 h-full"
    @click="toggleNavigationVisibility"
    @mousemove="handleMouseMove"
  >
    <SlideEditor
      :slide="slide"
      :editable="false"
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
          :disabled="current === 0"
          @click="emit('previous')"
        >
          <Icon name="IconChevronLeft" class="w-5 h-5" />
        </Button>
        {{ current + 1 }} / {{ length }}
        <Button
          variant="outline"
          class="rounded-sm"
          @click="emit('next')"
          :disabled="current >= length - 1"
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
      <Drawer direction="right">
        <DrawerTrigger>
          <Button
            variant="outline"
          >
            Thông tin phiên
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader class="flex items-center justify-between border-b mb-4 border-slate-600">
            <DrawerTitle>Thông tin phiên</DrawerTitle>
            <DrawerClose
              class="bg-gray-400 border hover:bg-gray-600 rounded flex justify-center items-center p-1 transition-colors duration-200"
            >
              <Icon name="IconClose" class="w-5 h-5 text-background" />
            </DrawerClose>
          </DrawerHeader>
          <div class="px-6">
            <div class="space-y-2 text-md">
              <div class="flex justify-between">
                <span class="text-slate-900">Phòng:</span>
                <span class="font-semibold text-xl">{{ tenPhong }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">PIN:</span>
                <span class="font-mono text-xl">{{ pin }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Tổng slides:</span>
                <span class="text-xl">{{ length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Slide hiện tại:</span>
                <span class="text-xl">{{ current + 1 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Thành viên:</span>
                <span class="text-xl">{{ memberCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Trạng thái:</span>
                <span
                  :class="isConnected ? 'text-green-600' : 'text-red-600'"
                  class="text-md"
                >
                  {{ isConnected ? 'Đã kết nối' : 'Mất kết nối' }}
                </span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger as-child>
                <div class="flex flex-col items-center gap-2 bg-card rounded overflow-hidden relative mt-6">
                  <div class="flex absolute inset-0 w-full h-full items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Icon
                      name="IconZoomOut" class="w-12 h-12 text-background"
                    />
                  </div>
                  <img
                    :src="qrCode"

                    aspect-ratio="square"
                  >
                </div>
              </DialogTrigger>
              <DialogContent class="max-w-2xl max-h-fit">
                <DialogHeader>
                  <DialogTitle class="text-center text-3xl">
                    Mã QR
                  </DialogTitle>
                  <Separator class="my-2 h-[2px] bg-slate-600" />
                </DialogHeader>
                <div class="flex flex-col items-center gap-2 bg-card rounded relative">
                  <img
                    :src="qrCode"

                    class="h-[400px]"
                    aspect-ratio="square"
                  >
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
</template>
