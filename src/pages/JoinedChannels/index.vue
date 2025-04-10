<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'
import { type Kenh, TrangThai } from '@/types'
import { watchDebounced } from '@vueuse/core'

interface KenhData extends Kenh {
  isSelected: boolean
}

const isJoinChannelModalOpen = ref(false)
const searchValue = ref('')
const breadCrumbItems = [
  {
    text: 'Kênh đã tham gia',
    disabled: true,
  },
]
const channels = ref<KenhData[]>([
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

watchDebounced(
  searchValue,
  () => { console.log('change:', searchValue.value) },
  { debounce: 500 },
)
function handleRequestJoinChannel(id: string) {
  console.log('Sent request join channel :', id)
}
function openCreateChannelModal() {
  isJoinChannelModalOpen.value = true
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
          Kênh đã tham gia
        </h1>
        <p class="text-lg text-center text-foreground">
          Bạn có thể tham gia các kênh khác bằng cách nhấn vào nút bên cạnh
        </p>
      </div>
      <div class="flex gap-4">
        <Button
          type="button"
          @click="openCreateChannelModal"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tham gia bằng mã</span>
        </Button>
      </div>
    </div>
    <div class="mt-6 w-full">
      <InputSearch
        v-model="searchValue"
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
  </div>
  <JoinChannelModal
    v-model:open="isJoinChannelModalOpen"
    @create="handleRequestJoinChannel"
  />
</template>
