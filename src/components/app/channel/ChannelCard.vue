<script setup lang="ts">
import { type Kenh, TrangThai } from '@/types'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface Props {
  item: Kenh
  isOwner: boolean
}
const { item } = defineProps<Props>()
defineEmits(['update:id_selected', 'edit'])

const id_selected = defineModel({
  type: Boolean,
})

// Format ngày
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div
    class="rounded-lg border border-border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 relative"
  >
    <CheckboxRoot
      v-if="isOwner"
      v-model="id_selected"
      class="absolute top-2 right-2 hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-background border border-border shadow-blackA7 shadow-[0_1px_4px_-2px] outline-none"
    >
      <CheckboxIndicator class="h-full bg-secondary/50 w-full rounded flex items-center justify-center">
        <Icon
          name="IconCheck"
          class="h-4 w-4 text-grass11"
        />
      </CheckboxIndicator>
    </CheckboxRoot>
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 pt-6 px-6">
      <h2 class="title">
        {{ item.tenKenh }}
      </h2>
    </div>

    <!-- Body -->
    <div class="pt-2">
      <Icon name="IconChannel" class="w-full h-40 mb-2 object-cover text-primary/90" />
    </div>
    <!-- Footer -->
    <div class="text-sm space-y-2 mt-2 pb-6 px-6">
      <p>
        Ngày tạo: {{ formatDate(item.ngayTao) }}
      </p>
      <div
        v-if="isOwner"
        class="grid grid-cols-2 gap-2"
      >
        <Button
          type="button"
          variant="outline"
          @click="$emit('edit', item)"
        >
          Chỉnh sửa
        </Button>
        <Button
          type="button"
          :disabled="item.trangThai === TrangThai.KHOA"
          @click="$router.push({ name: 'channels-id', params: { id: item.maKenh } })"
        >
          Truy cập
          <Icon name="IconArrowRight" class="w-4 h-4" />
        </Button>
      </div>
      <div
        v-else
        class="grid"
      >
        <Button
          type="button"
          class="w-full"
          :disabled="item.trangThai === TrangThai.KHOA"
          @click="$router.push({ name: 'JoinedChannels-id', params: { id: item.maKenh } })"
        >
          Truy cập
          <Icon name="IconArrowRight" class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.description {
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  min-block-size: 40px;
}
.title {
  @apply text-xl font-semibold;
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  min-block-size: 28px;
}
</style>
