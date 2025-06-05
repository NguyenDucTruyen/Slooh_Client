<script setup lang="ts">
import type { Phong } from '@/types'
import SearchHeader from '@/components/common/SearchHeader.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
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
const confirmStore = useConfirmStore()
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
  <PageContainer title="Phòng công khai" description="Danh sách các phòng trình chiếu công khai bạn đã tạo">
    <SearchHeader
      v-model="searchValue"
      placeholder="Tìm kiếm phòng trình chiếu"
      @search="handleSearch"
    >
      <Button
        type="button"
        variant="destructive"
        :disabled="selectedRoom.length === 0"
        @click="deleteSelectedRoom"
      >
        <Icon
          name="IconTrash"
          class="h-4 w-4 mr-2"
        />
        Xóa {{ selectedRoom.length }} phòng
      </Button>
      <Button
        type="button"
        @click="openCreateRoomModal"
      >
        <Icon
          name="IconPlus"
          class="h-4 w-4 mr-2"
        />
        Tạo phòng trình chiếu
      </Button>
    </SearchHeader>

    <TransitionGroup
      name="list"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4"
    >
      <template v-if="isLoading">
        <Skeleton
          v-for="n in 5"
          :key="`skeleton-${n}`"
          class="h-[325px]"
        />
      </template>
      <template v-else>
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
      </template>
    </TransitionGroup>
  </PageContainer>

  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
</template>
