<script setup lang="ts">
import { type Kenh, TrangThai } from '@/types'

interface Props {
  item: Kenh
}
const { item } = defineProps<Props>()
const id_selected = defineModel({
  type: Boolean,
})
// Class badge theo trạng thái
const badgeClass = computed(() => {
  switch (item.trangThai) {
    case TrangThai.HOAT_DONG:
      return 'bg-success text-white'
    case TrangThai.KHOA:
      return 'bg-destructive text-white'
    default:
      return 'bg-border text-foreground'
  }
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
    <input id="" v-model="id_selected" type="checkbox" name="" class="absolute top-2 right-2 w-4 h-4 cursor-pointer">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 pt-6 px-6">
      <h2 class="title">
        {{ item.tenKenh }}
      </h2>
      <span
        class="text-xs font-medium px-2 py-0.5 rounded-full absolute top-16 left-2"
        :class="badgeClass"
      >
        {{ item.trangThai === TrangThai.HOAT_DONG ? 'Hoạt động' : 'Bị Khóa' }}
      </span>
    </div>

    <!-- Body -->
    <img v-lazy="`https://ui-avatars.com/api/?name=${item.tenKenh}&background=random&size=300&bold=true`" alt="" class="w-full h-40 mb-2 object-cover">
    <!-- Footer -->
    <div class="text-muted-foreground text-sm space-y-2  pb-6 px-6">
      <p>
        Ngày tạo: {{ formatDate(item.ngayTao) }}
      </p>
      <Button
        type="button"
        variant="secondary"
        class="w-full"
        @click="$router.push({ name: 'channels-id', params: { id: item.maKenh } })"
      >
        Truy cập kênh
        <Icon name="IconArrowRight" class="w-6 h-6" />
      </Button>
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
