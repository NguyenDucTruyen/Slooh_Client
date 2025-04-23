<script setup lang="ts">
import type { Kenh, NguoiDung, Phong, ThanhVienKenh } from '@/types'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { HoatDongPhong, TrangThai, TrangThaiThanhVien, VaiTroKenh } from '@/types'
import { useAsyncState } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}

const confirmStore = useConfirmStore()
const channelStore = useChannelStore()

const route = useRoute()
const maKenh = route.params.id as string
const searchValue = ref('')
const searchUserValue = ref('')
const isAddUserModalOpen = ref(false)
const isCreateRoomModalOpen = ref(false)
const breadCrumbItems = ref<any[]>([])

const roomsResponse = ref<PhongData[]>([
  {
    maPhong: 'P001',
    tenPhong: 'Phòng họp 1',
    maKenh,
    maChuPhong: 'a5bd98da-6007-4d8a-b6bd-e3e175a66e3d',
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
    maChuPhong: 'a5bd98da-6007-4d8a-b6bd-e3e175a66e3d',
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
    maChuPhong: 'a5bd98da-6007-4d8a-b6bd-e3e175a66e3d',
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
    maChuPhong: 'a5bd98da-6007-4d8a-b6bd-e3e175a66e3d',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.OFFLINE,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
])
const membersResponse = ref<Partial<NguoiDungData>[]>([])

const requestJoinMembers = ref<Partial<NguoiDungData>[]>([])

const members = computed(() => {
  if (!searchUserValue.value)
    return membersResponse.value
  return membersResponse.value.filter((member) => {
    return member.hoTen?.toLowerCase().includes(searchUserValue.value.toLowerCase())
  })
})

const rooms = computed(() => {
  if (!searchValue.value)
    return roomsResponse.value
  return roomsResponse.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase())
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
function handleCreateRoom(name: string) {
  console.log('Creating room with name:', name)
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
function selectedAllRequestJoinMembers() {
  if (!requestJoinMembers.value.length)
    return
  const isAllSelected = requestJoinMembers.value.every(member => member.isSelected)
  requestJoinMembers.value.forEach((member) => {
    member.isSelected = !isAllSelected
  })
}
async function handleAddUser(ids: string[]) {
  const response = await channelStore.addMemberToChannel(maKenh, ids)
  console.log('Add user response:', response)
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
    <Tabs default-value="list" class="mt-6 w-full">
      <TabsList>
        <TabsTrigger value="list">
          <Icon name="IconList" class="w-6 h-6" />
          Danh sách phòng
        </TabsTrigger>
        <TabsTrigger value="members">
          <Icon name="IconListUser" class="w-6 h-6" />
          Thành viên
        </TabsTrigger>
      </TabsList>
      <!-- Danh sách room -->
      <TabsContent value="list">
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
              @click="openCreateRoomModal"
            >
              <Icon name="IconPlus" class="w-6 h-6" />
              <span>Tạo phòng trình chiếu</span>
            </Button>
          </div>
        </div>
        <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
          <RoomCard
            v-for="room in rooms"
            :key="room.maPhong"
            v-model="room.isSelected"
            :item="room"
          />
        </div>
        <div
          v-if="!rooms.length"
          class="text-md font-semibold mb-4 w-full text-center text-muted-foreground mx-auto"
        >
          Không có kết quả
        </div>
      </TabsContent>
      <!-- Danh sách thành viên -->
      <TabsContent value="members">
        <h4
          class="text-lg font-semibold mt-4"
        >
          Danh sách thành viên ({{ membersResponse.length }})
        </h4>

        <div class="mt-2 w-full mx-auto grid grid-cols-1 gap-4">
          <div class="flex justify-between">
            <InputSearch
              v-model="searchUserValue"
              placeholder="Tìm kiếm thành viên"
            />
            <div class="flex gap-4">
              <Button
                type="button"
                variant="destructive"
                :disabled="selectedMembers.length === 0"
                @click="deleteSelectedMembers"
              >
                Xóa khỏi kênh
              </Button>
              <Button
                type="button"
                @click="openAddUserModal"
              >
                <Icon name="IconPlus" class="w-6 h-6" />
                <span>Thêm thành viên</span>
              </Button>
            </div>
          </div>
          <template
            v-for="member in members"
            :key="member.maNguoiDung"
          >
            <MemberCard
              v-model="member.isSelected"
              :user="member"
              :is-owner="true"
              type="member"
              @remove="handleRemoveMember"
            />
          </template>
          <span
            v-if="!members.length"
            class="text-md font-semibold mb-4 text-center text-muted-foreground"
          >Không có kết quả</span>
        </div>
        <div class="mt-4 w-full mx-auto grid grid-cols-1 gap-4">
          <h4
            class="text-lg font-semibold mb-4"
          >
            Danh sách yêu cầu tham gia ({{ requestJoinMembers.length }})
          </h4>
          <div class="flex justify-between mb-4">
            <Button
              variant="link"
              class="text-foreground"
              @click="selectedAllRequestJoinMembers"
            >
              Chọn tất cả
            </Button>
            <div class="flex gap-4">
              <Button
                type="button"
                variant="destructive"
                :disabled="selectedRequestJoinMembers.length === 0"
                @click="handleAcceptMultiRequest(false)"
              >
                Từ chối
              </Button>
              <Button
                type="button"
                :disabled="selectedRequestJoinMembers.length === 0"
                @click="handleAcceptMultiRequest(true)"
              >
                Chấp nhận
              </Button>
            </div>
          </div>
          <template
            v-for="member in requestJoinMembers"
            :key="member.maNguoiDung"
          >
            <MemberCard
              v-model="member.isSelected"
              :user="member"
              type="request"
              @handle-request="handleAcceptRequest"
            />
          </template>
          <span
            v-if="!requestJoinMembers.length"
            class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
          >Không có kết quả</span>
        </div>
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
