<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'
import { type Kenh, type NguoiDung, TrangThai } from '@/types'

interface KenhData extends Kenh {
  isSelected: boolean
}
const confirmStore = useConfirmStore()

const isCreateChannelModalOpen = ref(false)
const searchChannelValue = ref('')
const breadCrumbItems = [
  {
    text: 'Kênh của tôi',
    disabled: true,
  },
]
const channelsResponse = ref<KenhData[]>([
  {
    maKenh: 'K001',
    tenKenh: 'Giáo Dục Quốc Phòng',
    trangThai: TrangThai.HOAT_DONG,
    ngayTao: '2023-01-01',
    ngayXoa: '',
    isSelected: false,
  },
  {
    maKenh: 'K002',
    tenKenh: 'Kênh 2',
    trangThai: TrangThai.KHOA,
    ngayTao: '2023-02-01',
    ngayXoa: '',
    isSelected: false,
  },
])
const channels = computed(() => {
  if (!searchChannelValue.value)
    return channelsResponse.value
  return channelsResponse.value.filter((channel) => {
    return channel.tenKenh?.toLowerCase().includes(searchChannelValue.value.toLowerCase())
  })
})

const selectedChannels = computed(() => {
  return channels.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maKenh)
    }
    return acc
  }, [] as string[])
})

function handleCreateChannel(name: string) {
  console.log('Creating channel with name:', name)
}

function openCreateChannelModal() {
  isCreateChannelModalOpen.value = true
}

async function deleteSelectedChannels() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedChannels.value.length} kênh đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  console.log('Deleting channels:', selectedChannels.value)
}
</script>

<template>
  <BreadCrumbs
    :items="breadCrumbItems"
  />
  <div class="flex flex-col items-center h-screen">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="hidden sm:flex flex-col items-center justify-center">
        <h1 class="text-2xl text-center font-bold mb-1">
          Kênh của tôi
        </h1>
        <p class="text-lg text-center text-foreground">
          Danh sách kênh do bạn tạo và có quyền quản lý
        </p>
      </div>
      <div class="flex gap-4">
        <Button
          type="button"
          variant="destructive"
          :disabled="selectedChannels.length === 0"
          @click="deleteSelectedChannels"
        >
          Xóa
        </Button>
        <Button
          type="button"
          @click="openCreateChannelModal"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tạo kênh mới</span>
        </Button>
      </div>
    </div>
    <div class="mt-6 w-full">
      <InputSearch
        v-model="searchChannelValue"
        placeholder="Nhập tên kênh để tìm kiếm"
      />
    </div>
    <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <ChannelCard
        v-for="channel in channels"
        :key="channel.maKenh"
        v-model="channel.isSelected"
        :item="channel"
      />
    </div>
    <span
      v-if="!channels.length"
      class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
    >Không có kết quả</span>
  </div>
  <CreateChannelModal
    v-model:open="isCreateChannelModalOpen"
    @create="handleCreateChannel"
  />
</template>
