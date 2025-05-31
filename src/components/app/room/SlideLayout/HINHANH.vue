<script setup lang="ts">
import type { Slide } from '@/types'

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function handleUploadImage() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (slide.value) {
        slide.value.hinhAnh = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (slide.value) {
        slide.value.hinhAnh = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="flex flex-col w-full h-full gap-6">
    <!-- Image area (chiếm hết phần còn lại) -->
    <div
      class="flex-1 relative rounded-lg overflow-hidden bg-slate-300 backdrop-blur-sm group min-h-0"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      >
      <img
        v-if="slide.hinhAnh"
        :src="slide.hinhAnh"
        alt="Slide image"
        class="absolute inset-0 w-full h-full object-contain rounded-lg"
      >
      <div
        class="absolute max-w-[400px] max-h-[400px] flex flex-col items-center justify-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200/50 p-6 rounded-md text-center cursor-pointer"
        @click="handleUploadImage"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon name="IconPlus" class="w-8 h-8 text-gray-900" />
        </div>
        <div class="text-center">
          <p class="text-gray-900 dark:text-gray-400 font-medium">
            Click to add media
          </p>
          <p class="text-sm text-gray-900 dark:text-gray-500 mt-1">
            or drag and drop
          </p>
        </div>
      </div>
    </div>

    <!-- Editor (chiều cao cố định) -->
    <RichTextEditor
      v-model="slide.tieuDe"
      placeholder="Click để nhập tiêu đề..."
      class="shrink-0 max-h-[110px] text-xl"
    />
  </div>
</template>
