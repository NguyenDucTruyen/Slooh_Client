<script setup lang="ts">
import type { Slide } from '@/types'
import RichTextEditor from './RichTextEditor.vue'

defineProps<{
  visible?: boolean
}>()

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
</script>

<template>
  <div
    class="content-area"
    :class="[visible ? 'w-[calc(100%-260px)]' : 'w-full']"
    :style="slide?.hinhNen
      ? {
        backgroundImage: `url(${slide.hinhNen})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      : {
        backgroundColor: '#e5e7eb',
      }"
  >
    <div class="flex flex-col items-center justify-start h-full pt-20">
      <div class="w-4/5">
        <RichTextEditor
          v-model="slide.tieuDe"
          placeholder="Click để nhập tiêu đề..."
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-area {
  @apply bg-card h-full transition-[width] duration-300;
  background-size: cover;
  overflow-y: auto;
}
</style>
