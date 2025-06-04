<script setup lang="ts">
import type { Phong } from '@/types'
import { useConfirmStore } from '@/stores/confirm'
import { useDebounceFn } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}

const props = defineProps<{
  rooms: PhongData[]

}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'create'): void
  (e: 'search', value: string): void
}>()

const confirmStore = useConfirmStore()
const searchValue = ref('')

const debouncedSearchValue = useDebounceFn(() => {
  emit('search', searchValue.value)
}, 300)
watch(searchValue, debouncedSearchValue)

const selectedRoom = computed(() => {
  return props.rooms.reduce((acc, cur) => {
    if (cur.isSelected)
      acc.push(cur.maPhong)
    return acc
  }, [] as string[])
})

async function deleteSelectedRoom() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedRoom.value.length} phòng đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  emit('delete')
}
</script>

<template>
  <div>
    <div class="w-full flex items-center justify-between">
      <InputSearch
        v-model="searchValue"
        placeholder="Tìm kiếm phòng trình chiếu"
      />
      <div class="flex gap-4">
        <Button
          type="button"
          variant="destructive"
          :disabled="selectedRoom.length === 0"
          @click="deleteSelectedRoom"
        >
          Xóa
        </Button>
        <Button
          type="button"
          @click="$emit('create')"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tạo phòng trình chiếu</span>
        </Button>
      </div>
    </div>
    <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <RoomCard
        v-for="room in props.rooms"
        :key="room.maPhong"
        v-model="room.isSelected"
        :is-author="true"
        :item="room"
      />
    </div>
    <div
      v-if="!props.rooms.length"
      class="text-md font-semibold mb-4 w-full text-center text-muted-foreground mx-auto"
    >
      Không có kết quả
    </div>
  </div>
</template>
