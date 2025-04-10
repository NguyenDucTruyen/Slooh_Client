<script setup lang="ts">
import type { Phong } from '@/types'
import { HoatDongPhong, TrangThai } from '@/types'
import { watchDebounced } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}
const route = useRoute()
const maKenh = route.params.id as string
const searchValue = ref('')

const isCreateRoomModalOpen = ref(false)
const rooms = ref<PhongData[]>([
  {
    maPhong: 'P001',
    tenPhong: 'Phòng họp 1',
    maKenh,
    maChuPhong: 'a8c8-7711c3e6e473',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.OFFLINE,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
  {
    maPhong: 'P002',
    tenPhong: 'Phòng họp 2',
    maKenh,
    maChuPhong: 'a8c8-7711c3e6e473',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.PRESENTING,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
  {
    maPhong: 'P003',
    tenPhong: 'Phòng họp 3',
    maKenh,
    maChuPhong: 'a8c8-7711c3e6e473',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.WAITING,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
  {
    maPhong: 'P004',
    tenPhong: 'Phòng họp 4',
    maKenh,
    maChuPhong: 'a8c8-7711c3e6e473',
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

watchDebounced(
  searchValue,
  () => { console.log('change search value:', searchValue.value) },
  { debounce: 500 },
)
function handleCreateRoom(name: string) {
  console.log('Creating room with name:', name)
}
</script>

<template>
  <BreadCrumbs :items="breadCrumbItems" />
  <div class="flex flex-col items-center h-screen">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="flex items-center justify-center">
        <RouterLink
          :to="{ name: 'JoinedChannels' }"
          class="flex items-center gap-2"
        >
          <Button
            variant="link"
            class="gap-0"
          >
            <Icon name="IconChevronLeft" class="w-4 h-4" />
            Quay lại
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="mt-6 w-full">
      <InputSearch
        v-model="searchValue"
        placeholder="Tìm kiếm phòng trình chiếu"
      />
    </div>
    <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <RoomCard
        v-for="room in rooms"
        :key="room.maPhong"
        v-model="room.isSelected"
        :item="room"
      />
    </div>
  </div>
  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
</template>
