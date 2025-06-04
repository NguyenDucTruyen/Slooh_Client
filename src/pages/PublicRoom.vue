<script setup lang="ts">
import type { Phong } from '@/types'
import { toast } from '@/components/ui/toast'
import { useConfirmStore } from '@/stores/confirm'
import { useRoomStore } from '@/stores/room'
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router'

interface PhongData extends Phong {
  isSelected: boolean
}

const router = useRouter()
const roomStore = useRoomStore()
const searchValue = ref('')
const isCreateRoomModalOpen = ref(false)

const roomsResponse = ref<PhongData[]>([])
const { isLoading } = useAsyncState(
  async () => {
    const response = await roomStore.getPublicRoomList()
    roomsResponse.value = response.rooms.map((room: Phong) => ({ ...room, isSelected: false }))
    return response
  },
  [],
  { immediate: true },
)

const filteredRooms = computed(() => {
  if (!searchValue.value)
    return roomsResponse.value
  return roomsResponse.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase())
  })
})

const selectedRoom = computed(() => {
  return roomsResponse.value.reduce((acc, cur) => {
    if (cur.isSelected)
      acc.push(cur.maPhong)
    return acc
  }, [] as string[])
})

function handleSearch(value: string) {
  searchValue.value = value
}

function openCreateRoomModal() {
  isCreateRoomModalOpen.value = true
}

async function handleCreateRoom(name: string) {
  try {
    const response = await roomStore.createPublicRoom(name)
    router.push({ name: 'rooms-id', params: { id: response.maPhong } })
    toast({
      title: 'Thành công',
      description: 'Tạo phòng công khai thành công',
    })
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi tạo phòng',
      variant: 'destructive',
    })
  }
}

const confirmStore = useConfirmStore()

async function deleteSelectedRoom() {
  if (selectedRoom.value.length === 0)
    return

  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedRoom.value.length} phòng đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })

  if (!result)
    return
  try {
    await Promise.all(selectedRoom.value.map(id => roomStore.deleteRoom(id)))
    toast({
      title: 'Thành công',
      description: 'Xóa phòng thành công',
    })
    const response = await roomStore.getPublicRoomList()
    roomsResponse.value = response.rooms.map((room: Phong) => ({ ...room, isSelected: false }))
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi xóa phòng',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="flex items-center">
        <h1 class="text-2xl font-semibold">
          Phòng công khai
        </h1>
      </div>
    </div>

    <div class="mt-6 p-6 bg-card rounded-lg shadow-lg mx-2">
      <div class="w-full flex items-center justify-between mb-6">
        <InputSearch
          v-model="searchValue"
          placeholder="Tìm kiếm phòng trình chiếu"
          @update:model-value="handleSearch"
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
            @click="openCreateRoomModal"
          >
            <Icon name="IconPlus" class="w-6 h-6" />
            <span>Tạo phòng trình chiếu</span>
          </Button>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="flex items-center justify-center h-40"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4"
      >
        <RoomCard
          v-for="room in filteredRooms"
          :key="room.maPhong"
          v-model="room.isSelected"
          :is-author="true"
          :item="room"
        />
        <div
          v-if="!filteredRooms.length"
          class="text-md font-semibold mb-4 w-full text-center text-muted-foreground col-span-full"
        >
          Không có kết quả
        </div>
      </div>
    </div>
  </div>

  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
</template>
