<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { HoatDongPhong, type Phong } from '@/types'

interface Props {
  item: Phong
}

const { item } = defineProps<Props>()
const userStore = useUserStore()
const id_selected = defineModel({
  type: Boolean,
})
// Class badge theo trạng thái
const badgeClass = computed(() => {
  switch (item.hoatDong) {
    case HoatDongPhong.PRESENTING:
      return 'bg-success text-white'
    case HoatDongPhong.OFFLINE:
      return 'bg-gray-500 text-white'
    case HoatDongPhong.WAITING:
      return 'bg-warning text-white'
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
    <input v-if="item.maChuPhong === userStore.user?.maNguoiDung" id="" v-model="id_selected" :disabled="item.hoatDong !== HoatDongPhong.OFFLINE" type="checkbox" name="" class="absolute top-2 right-2 w-4 h-4 cursor-pointer">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 pt-6 px-6">
      <h2 class="title">
        {{ item.tenPhong }}
      </h2>
      <span
        class="text-xs font-medium px-2 py-0.5 rounded-full absolute top-16 left-2"
        :class="badgeClass"
      >
        {{ item.hoatDong === HoatDongPhong.PRESENTING ? 'Đang trình chiếu' : item.hoatDong === HoatDongPhong.OFFLINE ? 'Offline' : 'Đang Chờ' }}
      </span>
    </div>

    <!-- Body -->
    <img v-lazy="`https://ui-avatars.com/api/?name=${item.tenPhong}&background=random&size=300&bold=true`" alt="" class="w-full h-40 mb-2 object-cover">
    <!-- Footer -->
    <div class="text-muted-foreground text-sm space-y-2 pb-6 px-6">
      <p>
        Ngày tạo: {{ formatDate(item.ngayTao) }}
      </p>
      <div v-if="item.maChuPhong === userStore.user?.maNguoiDung" class="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          class="w-full"
        >
          Chỉnh sửa
        </Button>
        <Button
          type="button"
          class="w-full"
        >
          Trình chiếu
        </Button>
      </div>
      <Button
        v-else
        type="button"
        class="w-full"
        :disabled="item.hoatDong === HoatDongPhong.OFFLINE"
      >
        Tham gia
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
