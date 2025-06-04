<script setup lang="ts">
import type { Kenh, NguoiDung, Phong } from '@/types'
import MemberList from '@/components/app/channel/MemberList.vue'
import RoomList from '@/components/app/channel/RoomList.vue'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { useRoomStore } from '@/stores/room'
import { TrangThaiThanhVien, VaiTroKenh } from '@/types'
import { useAsyncState } from '@vueuse/core'
import { Loader2 } from 'lucide-vue-next'

interface PhongData extends Phong {
  isSelected: boolean
}

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}

const TAB_LIST = {
  LIST: 'list',
  MEMBERS: 'members',
}

const router = useRouter()
const confirmStore = useConfirmStore()
const channelStore = useChannelStore()
const roomStore = useRoomStore()

const route = useRoute()
const maKenh = route.params.id as string
const searchValue = ref('')
const searchUserValue = ref('')
const isAddUserModalOpen = ref(false)
const isCreateRoomModalOpen = ref(false)
const breadCrumbItems = ref<any[]>([])
const membersResponse = ref<Partial<NguoiDungData>[]>([])
const requestJoinMembers = ref<Partial<NguoiDungData>[]>([])
const queryConfig = ref({
  page: 1,
  limit: 100,
})
const { execute: fetchChannels } = useAsyncState<Kenh>(() => {
  return (async () => {
    const response = await channelStore.getChannelDetail(maKenh)
    if (response) {
      const members = []
      const requests = []
      for (const member of response.thanhVien) {
        if (member.vaiTro !== VaiTroKenh.CHU_KENH && member.trangThai === TrangThaiThanhVien.THAM_GIA) {
          members.push({
            ...member.nguoiDung,
            isSelected: false,
          })
        }
        if (member.vaiTro !== VaiTroKenh.CHU_KENH && member.trangThai === TrangThaiThanhVien.YEU_CAU) {
          requests.push({
            ...member.nguoiDung,
            isSelected: false,
          })
        }
      }
      membersResponse.value = members
      requestJoinMembers.value = requests

      breadCrumbItems.value = [
        {
          text: 'Kênh của tôi',
          to: { name: 'channels' },
        },
        {
          text: response.tenKenh,
          disabled: true,
        },
      ]
    }
    return response
  })()
}, null as unknown as Kenh, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

const rooms = ref<PhongData[]>([])
const { isLoading } = useAsyncState<PhongData[]>(() => {
  return (async () => {
    const response = await channelStore.getRoomsInChannel(maKenh, queryConfig.value)
    rooms.value = response.rooms
    return response
  })()
}, [], {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})
const members = computed(() => {
  if (!searchUserValue.value)
    return membersResponse.value
  return membersResponse.value.filter((member) => {
    return member.hoTen?.toLowerCase().includes(searchUserValue.value.toLowerCase())
  })
})

const selectedMembers = computed(() => {
  return members.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur)
    }
    return acc
  }, [] as Partial<NguoiDungData>[])
})

const selectedRequestJoinMembers = computed(() => {
  return requestJoinMembers.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur)
    }
    return acc
  }, [] as Partial<NguoiDungData>[])
})
const selectedRoom = computed(() => {
  return rooms.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maPhong)
    }
    return acc
  }, [] as string[])
})
const filterdRooms = computed(() => {
  if (!searchValue.value)
    return rooms.value
  return rooms.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase())
  })
})
function handleSearch(value: string) {
  searchValue.value = value
}
async function deleteSelectedRoom() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedRoom.value.length} phòng đã chọn không?`,
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
function openAddUserModal() {
  isAddUserModalOpen.value = true
}
async function handleCreateRoom(name: string) {
  const response = await roomStore.createRoom({
    tenPhong: name,
    maKenh,
  })
  router.push({ name: 'rooms-id', params: { id: response.maPhong } })
}
async function handleRemoveMember(user: NguoiDungData) {
  await channelStore.removeMemberToChannel(maKenh, [user.email] as string[])
  fetchChannels(0)
}
async function deleteSelectedMembers() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedMembers.value.length} thành viên đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  await channelStore.removeMemberToChannel(maKenh, selectedMembers.value.map(member => member.email) as string[])
  fetchChannels(0)
}
async function handleAcceptMultiRequest(value: boolean) {
  if (!value) {
    const result = await confirmStore.showConfirmDialog({
      title: 'Cảnh báo',
      message: `Bạn có chắc chắn muốn ${value ? 'chấp nhận' : 'từ chối'} ${selectedRequestJoinMembers.value.length} yêu cầu tham gia đã chọn không?`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
    })
    if (!result)
      return
  }
  if (value) {
    await channelStore.acceptRequestJoinChannel(maKenh, selectedRequestJoinMembers.value.map(member => member.email) as string[])
  }
  else {
    await channelStore.rejectRequestJoinChannel(maKenh, selectedRequestJoinMembers.value.map(member => member.email) as string[])
  }
  fetchChannels(0)
}
async function handleAcceptRequest(user: NguoiDungData, accept: boolean) {
  if (accept) {
    await channelStore.acceptRequestJoinChannel(maKenh, [user.email] as string[])
  }
  else {
    await channelStore.rejectRequestJoinChannel(maKenh, [user.email] as string[])
  }
  fetchChannels(0)
}
async function handleAddUser(ids: string[]) {
  await channelStore.addMemberToChannel(maKenh, ids)
  fetchChannels(0)
  toast({
    title: 'Thành công',
    description: 'Thêm thành viên thành công',
  })
}
</script>

<template>
  <BreadCrumbs :items="breadCrumbItems" />
  <div class="flex flex-col items-center h-screen">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="flex items-center justify-center">
        <RouterLink
          :to="{ name: 'channels' }"
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
    <Tabs :default-value="route.query.tab || 'list'" class="mt-6 w-full">
      <TabsList>
        <TabsTrigger value="list" @click="router.replace({ query: { tab: TAB_LIST.LIST } })">
          <Icon name="IconList" class="w-6 h-6" />
          Danh sách phòng
        </TabsTrigger>
        <TabsTrigger value="members" @click="router.replace({ query: { tab: TAB_LIST.MEMBERS } })">
          <Icon name="IconListUser" class="w-6 h-6" />
          Thành viên
        </TabsTrigger>
      </TabsList>      <!-- Danh sách room -->
      <TabsContent value="list">
        <div
          v-if="isLoading"
          class="flex items-center justify-center h-full w-full"
        >
          <Loader2 class="w-6 h-6 animate-spin text-gray-500" />
        </div>
        <RoomList
          v-else
          :rooms="filterdRooms"
          @create="openCreateRoomModal"
          @delete="deleteSelectedRoom"
          @search="handleSearch"
        />
      </TabsContent>
      <!-- Danh sách thành viên -->
      <TabsContent value="members">
        <MemberList
          :members="membersResponse"
          :request-join-members="requestJoinMembers"
          @remove-member="handleRemoveMember"
          @delete-selected="deleteSelectedMembers"
          @add-user="openAddUserModal"
          @accept-request="handleAcceptRequest"
          @accept-multi-request="handleAcceptMultiRequest"
        />
      </TabsContent>
    </Tabs>
  </div>
  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
  <AddUserModal
    v-model:open="isAddUserModalOpen"
    @add="handleAddUser"
  />
</template>
