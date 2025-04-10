<script setup lang="ts">
import type { NguoiDung, Phong } from '@/types'
import { useConfirmStore } from '@/stores/confirm'
import { HoatDongPhong, TrangThai } from '@/types'

interface PhongData extends Phong {
  isSelected: boolean
}

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}

const confirmStore = useConfirmStore()
const route = useRoute()
const maKenh = route.params.id as string
const searchValue = ref('')
const searchUserValue = ref('')

const isCreateRoomModalOpen = ref(false)
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

const roomsResponse = ref<PhongData[]>([
  {
    maPhong: 'P001',
    tenPhong: 'Phòng họp 1',
    maKenh,
    maChuPhong: 'af0a2c32-22b4-4c7c-a8c8-7711c3e6e473',
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
    maChuPhong: 'af0a2c32-22b4-4c7c-a8c8-7711c3e6e473',
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
    maChuPhong: 'af0a2c32-22b4-4c7c-a8c8-7711c3e6e473',
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
    maChuPhong: 'af0a2c32-22b4-4c7c-a8c8-7711c3e6e473',
    trangThai: TrangThai.HOAT_DONG,
    hoatDong: HoatDongPhong.OFFLINE,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
])
const membersResponse = ref<Partial<NguoiDungData>[]>([
  {
    maNguoiDung: 'af0a2c32-22b4-4c7c',
    hoTen: 'Nguyễn Đức Truyền',
    email: 'mrtruyenbd1407@gmail.com',
    anhDaiDien: 'https://lh3.googleusercontent.com/ogw/AF2bZyikRnSw99pnnd-22xPQeONKHqwkk_Q3knX6PuPFV_p_RiE=s32-c-mo',
    isSelected: false,
  },
  {
    maNguoiDung: 'af0a2c32-22b4-4c7c',
    hoTen: 'Dương Võ',
    email: 'vttduong@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Duong+Vo&background=random&size=300&bold=true',
    isSelected: false,
  },
  {
    maNguoiDung: '029852-klsjhkgskjg-2345',
    hoTen: 'Trần Nhật Long',
    email: 'longtran@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Long+Tran&background=random&size=300&bold=true',
    isSelected: false,
  },
  {
    maNguoiDung: 'aaf0a2c32-22b4-4c7c',
    hoTen: 'Nguyễn Văn Vĩnh Định',
    email: 'nvvdinh@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Vinh+Dinh&background=random&size=300&bold=true',
    isSelected: false,
  },
])

const requestJoinMembers = ref<Partial<NguoiDungData>[]>([
  {
    maNguoiDung: 'af0a2c32-22b4-4c7c',
    hoTen: 'Nguyễn Đức Truyền',
    email: 'mrtruyenbd1407@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Duc+Truyen&background=random&size=300&bold=true',
    isSelected: false,
  },
  {
    maNguoiDung: 'af0a2c32-22b4-4c7c',
    hoTen: 'Dương Võ',
    email: 'vttduong@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Duong+Vo&background=random&size=300&bold=true',
    isSelected: false,
  },
  {
    maNguoiDung: '029852-klsjhkgskjg-2345',
    hoTen: 'Trần Nhật Long',
    email: 'longtran@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Long+Tran&background=random&size=300&bold=true',
    isSelected: false,
  },
  {
    maNguoiDung: 'aaf0a2c32-22b4-4c7c',
    hoTen: 'Nguyễn Văn Vĩnh Định',
    email: 'nvvdinh@gmail.com',
    anhDaiDien: 'https://ui-avatars.com/api/?name=Vinh+Dinh&background=random&size=300&bold=true',
    isSelected: false,
  },
])

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
      acc.push(cur.maNguoiDung as string)
    }
    return acc
  }, [] as string[])
})
const selectedRoom = computed(() => {
  return rooms.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maPhong)
    }
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
  console.log('Deleting channels:', selectedRoom.value)
}
function openCreateRoomModal() {
  isCreateRoomModalOpen.value = true
}
function handleCreateRoom(name: string) {
  console.log('Creating room with name:', name)
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
  console.log('Deleting members:', selectedMembers.value)
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
        >Không có kết quả</div>
      </TabsContent>
      <!-- Danh sách thành viên -->
      <TabsContent value="members">
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
              Xóa thành viên
            </Button>
            <Button
              type="button"
            >
              <Icon name="IconPlus" class="w-6 h-6" />
              <span>Thêm thành viên</span>
            </Button>
          </div>
        </div>
        <div class="mt-4 w-full mx-auto grid grid-cols-1 gap-4">
          <h4
            class="text-lg font-semibold mb-4"
          >
            Danh sách thành viên ({{ membersResponse.length }})
          </h4>
          <template
            v-for="member in members"
            :key="member.maNguoiDung"
          >
            <MemberCard
              v-model="member.isSelected"
              :user="member"
              type="member"
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
          <template
            v-for="member in requestJoinMembers"
            :key="member.maNguoiDung"
          >
            <MemberCard
              v-model="member.isSelected"
              :user="member"
              type="request"
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
</template>
