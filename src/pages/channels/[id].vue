<script setup lang="ts">
import type { Phong } from '@/types'
import { useConfirmStore } from '@/stores/confirm'
import { HoatDongPhong, TrangThai } from '@/types'
import { watchDebounced } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}
const route = useRoute()
const confirmStore = useConfirmStore()
const maKenh = route.params.id as string
const searchValue = ref('')

const isCreateRoomModalOpen = ref(false)
const rooms = ref<PhongData[]>([
  {
    maPhong: 'P001',
    tenPhong: 'Phòng họp 1',
    maKenh: 'K001',
    maChuPhong: 'U001',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.OFFLINE,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
])
const breadCrumbItems = [
  {
    text: 'Kênh của tôi',
    to: '/channels',
  },
  {
    text: 'Kênh 123',
    disabled: true,
  },
]

const selectedRoom = computed(() => {
  return rooms.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maPhong)
    }
    return acc
  }, [] as string[])
})
watchDebounced(
  searchValue,
  () => { console.log('change search value:', searchValue.value) },
  { debounce: 500 },
)
async function deleteSelectedRoom() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedRoom.value.length} kênh đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  console.log('Deleting channels:', selectedRoom.value)
}
function openCreateRoomModal() {
  isCreateRoomModalOpen.value = true
}
</script>

<template>
  <BreadCrumbs :items="breadCrumbItems" />
  <div class="flex flex-col items-center h-screen">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="hidden sm:flex flex-col items-center justify-center">
        <h1 class="text-2xl text-center font-bold mb-1">
          Kênh: {{ maKenh }}
        </h1>
        <p class="text-lg text-center text-foreground">
          Kênh này được tạo bởi bạn và bạn có quyền quản lý
        </p>
      </div>
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
          @click="openCreateRoomModal"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tạo phòng trình chiếu</span>
        </Button>
      </div>
    </div>
    <div class="mt-6 w-full">
      <InputSearch
        v-model="searchValue"
        placeholder="Tìm kiếm phòng trình chiếu"
      />
    </div>
  </div>
</template>
