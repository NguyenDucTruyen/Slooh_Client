<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { type Kenh, type NguoiDung, TrangThai } from '@/types'
import { useAsyncState } from '@vueuse/core'

interface KenhData extends Kenh {
  isSelected: boolean
}
interface KenhResponseData {
  channels: Kenh[]
  total: number
}
const confirmStore = useConfirmStore()
const channelStore = useChannelStore()

const isCreateChannelModalOpen = ref(false)
const editingChannel = ref<Kenh | null>(null)
const searchChannelValue = ref('')
const breadCrumbItems = [
  {
    text: 'Kênh của tôi',
    disabled: true,
  },
]
const channelsResponse = ref<KenhData[]>([])
const channelQuery = ref({
  page: 1,
  limit: 10,
})

const { state: channelResponseData, execute: fetchChannels, isLoading: isFetchingChannels } = useAsyncState<KenhResponseData>(() => {
  return (async () => {
    const response = await channelStore.getChannelList(channelQuery.value)
    channelsResponse.value = response.channels.map((channel: Kenh) => {
      return {
        ...channel,
        isSelected: false,
      }
    })
    return response
  })()
}, null as unknown as KenhResponseData, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})
const { execute: createChannel } = useAsyncState(channelStore.createChannel, null, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})

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
async function handleCreateChannel(name: string) {
  await createChannel(0, name)
  fetchChannels(0)
  toast({
    title: 'Thành công',
    description: 'Tạo kênh thành công',
  })
}
async function handleUpdateChannel(data: { kenh: Kenh, tenKenh: string }) {
  await channelStore.updateChannel(data.kenh.maKenh, data.tenKenh)
  fetchChannels(0)
  toast({
    title: 'Thành công',
    description: 'Cập nhật kênh thành công',
  })
}

function openCreateChannelModal() {
  isCreateChannelModalOpen.value = true
}
function openUpdateChannelModal(channel: Kenh) {
  editingChannel.value = channel
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
  await channelStore.deleteChannel(selectedChannels.value)
  fetchChannels(0)
}

watch(isCreateChannelModalOpen, (value) => {
  if (!value) {
    editingChannel.value = null
  }
})
watch(() => channelQuery.value.page, () => {
  fetchChannels(0)
}, {
  immediate: true,
})
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
    <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <ChannelCard
        v-for="channel in channels"
        v-model="channel.isSelected"
        :key="channel.maKenh"
        :item="channel"
        :is-owner="true"
        @edit="openUpdateChannelModal"
      />
    </div>
    <span
      v-if="!channels.length"
      class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
    >Không có kết quả</span>

    <template
      v-if="!isFetchingChannels && channels.length"
    >
      <Pagination
        v-slot="{ page }"
        v-model:page="channelQuery.page"
        :items-per-page="channelQuery.limit"
        :total="channelResponseData.total"
        :sibling-count="1"
        :default-page="channelQuery.page"
        show-edges
        class="mt-4 pb-10"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </template>
    
  </div>

  <CreateOrUpdateChannelModal
    v-model:open="isCreateChannelModalOpen"
    :kenh="editingChannel"
    @update="handleUpdateChannel"
    @create="handleCreateChannel"
  />
</template>
