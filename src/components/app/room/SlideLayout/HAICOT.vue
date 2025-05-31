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
  <div class="grid grid-cols-5 w-full h-full gap-12">
    <div class="flex flex-col justify-center gap-6 col-span-3">
      <RichTextEditor
        v-model="slide.tieuDe"
        placeholder="Click để nhập tiêu đề..."
        class="shrink-0 max-h-[150px]"
      />
      <RichTextEditor
        v-model="slide.noiDung"
        placeholder="Click để nhập tiêu đề..."
        class="max-h-[370px] text-xl col-span-2"
      />
    </div>
    <div
      class="w-full flex-1 min-h-0 relative rounded-lg overflow-hidden bg-slate-300/30 backdrop-blur-md col-span-2"
    >
      <img
        v-if="slide.hinhAnh"
        :src="slide.hinhAnh"
        alt="Slide image"
        class="absolute inset-0 w-full h-full object-contain rounded-lg"
      >
      <div
        class="rounded-md w-full h-full flex-1 min-h-0 relative group"
        tabindex="0"
        :class="{ 'ring-2 ring-primary ring-offset-2': isDragging }"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        >
        <div
          class="absolute max-w-[400px] max-h-[400px]  flex flex-col items-center justify-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200/50 p-6 rounded-md text-center cursor-pointer"
          @click="handleUploadImage"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon
              name="IconPlus"
              class="w-8 h-8 text-gray-900"
            />
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
    </div>
  </div>
</template>
