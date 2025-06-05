<script setup lang="ts">
import { HoatDongPhong, type Phong } from '@/types'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface Props {
  item: Phong
  isAuthor: boolean
}

const { item, isAuthor } = defineProps<Props>()
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
</script>

<template>
  <div
    class="rounded-lg border border-border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 relative"
  >
    <!-- <input v-if="item.maChuPhong === userStore.user?.maNguoiDung" id="" v-model="id_selected" :disabled="item.hoatDong !== HoatDongPhong.OFFLINE" type="checkbox" name="" class="absolute top-2 right-2 w-4 h-4 cursor-pointer"> -->
    <CheckboxRoot
      v-if="isAuthor"
      v-model="id_selected"
      :disabled="item.hoatDong !== HoatDongPhong.OFFLINE"
      :class="[item.hoatDong !== HoatDongPhong.OFFLINE ? 'cursor-not-allowed' : 'cursor-pointer']"
      class="absolute top-0 left-0 hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-background border border-border shadow-blackA7 shadow-[0_1px_4px_-2px] outline-none"
    >
      <CheckboxIndicator class="h-full w-full rounded flex items-center justify-center">
        <Icon
          name="IconCheck"
          class="h-4 w-4"
        />
      </CheckboxIndicator>
    </CheckboxRoot>
    <button variant="link" class="absolute top-1 right-6 z-10 px-1 ">
      <Icon name="IconEllipsis" class="w-4 h-4" />
    </button>
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 pt-6 px-6">
      <h2 class="title">
        {{ item.tenPhong }}
      </h2>
      <span
        class="text-xs font-medium px-2 py-0.5 rounded-full top-14 left-6"
        :class="badgeClass"
      >
        {{ item.hoatDong === HoatDongPhong.PRESENTING ? 'Đang trình chiếu' : item.hoatDong === HoatDongPhong.OFFLINE ? 'Offline' : 'Đang Chờ' }}
      </span>
    </div>

    <!-- Body -->
    <div class="pt-2">
      <Icon name="IconTable" class="w-full h-40 mb-2 object-cover text-primary/90" />
    </div>
    <!-- Footer -->
    <div class="text-muted-foreground text-sm space-y-2 pb-6 px-6">
      <p>
        <Button variant="link" class="text-primary font-semibold">
          Nhân bản
        </Button>
      </p>
      <div v-if="isAuthor" class="grid grid-cols-2 gap-4">
        <RouterLink
          :to="`/rooms/${item.maPhong}`"
        >
          <Button
            type="button"
            variant="outline"
            class="w-full"
          >
            <Icon name="IconEdit" class="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </RouterLink>
        <Button
          type="button"
          class="w-full"
        >
          <Icon name="IconPlay" class="w-4 h-4" />
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
