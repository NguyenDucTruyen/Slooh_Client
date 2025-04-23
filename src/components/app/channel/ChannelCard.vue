<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Kenh, TrangThai, VaiTroKenh } from '@/types'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface Props {
  item: Kenh
}
const { item } = defineProps<Props>()
defineEmits(['update:id_selected', 'edit'])
const userStore = useUserStore()
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
const author = computed(() => item.thanhVien.find(member => member.vaiTro === VaiTroKenh.CHU_KENH)?.nguoiDung)
</script>

<template>
  <div
    class="rounded-lg border border-border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 relative"
  >
    <CheckboxRoot
      v-if="author?.maNguoiDung === userStore.user?.maNguoiDung"
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
    <div class="text-muted-foreground text-sm space-y-2  pb-6 px-6 font-medium grid gap-1">
      <div class="grid gap-1 grid-cols-3">
        <div class="flex items-center">
          Chủ kênh
        </div>
        <div class="flex gap-1 col-span-2 items-center">
          {{ author?.hoTen }}
        </div>
      </div>
      <div class="grid gap-1 grid-cols-3">
        <div class="flex items-center">
          Ngày tạo
        </div>
        <div class="flex gap-1 col-span-2 items-center">
          {{ formatDate(item.ngayTao) }}
        </div>
      </div>
      <div class="grid gap-1 grid-cols-3">
        <div class="flex items-center">
          Số thành viên
        </div>
        <div class="flex gap-1 col-span-2 items-center">
          {{ item.thanhVien.length }}
        </div>
      </div>
      <div
        v-if="author?.maNguoiDung === userStore.user?.maNguoiDung"
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
