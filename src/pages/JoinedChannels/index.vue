 <route>
  {
      meta: {
        title: "Kênh đã tham gia",
        authorized: true,
      }
  }
</route>

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
import { useChannelStore } from '@/stores/channel'
import { HoatDongPhong, type Kenh, TrangThai, TrangThaiThanhVien, VaiTroKenh } from '@/types'

import { useAsyncState, watchDebounced } from '@vueuse/core'

interface KenhData extends Kenh {
  isSelected: boolean
  vaiTro: VaiTroKenh
}
interface KenhResponseData {
  channels: Kenh[]
  total: number
}
const channelStore = useChannelStore()
const isJoinChannelModalOpen = ref(false)
const breadCrumbItems = [
  {
    text: 'Kênh đã tham gia',
    disabled: true,
  },
]
const channels = ref<KenhData[]>([])

const channelQuery = ref({
  page: 1,
  limit: 10,
})
const { state: channelResponseData, execute: fetchChannels, isLoading: isFetchingChannels } = useAsyncState<KenhResponseData>(() => {
  return (async () => {
    const response = await channelStore.getChannelsJoined(channelQuery.value)
    // channels.value = response.channels.map((channel: Kenh) => {
    //   return {
    //     ...channel,
    //     isSelected: false,
    //   }
    // })
    channels.value = response.channels.reduce((acc: KenhData[], curr: KenhData) => {
      if (curr.vaiTro !== VaiTroKenh.CHU_KENH) {
        acc.push({
          ...curr,
          isSelected: false,
        })
      }
      return acc
    }, [])
    return response
  })()
}, null as unknown as KenhResponseData, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})
function handleRequestJoinChannel(id: string) {
  console.log('Sent request join channel :', id)
}
function openCreateChannelModal() {
  isJoinChannelModalOpen.value = true
}
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
    <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <ChannelCard
        v-for="channel in channels"
        :key="channel.maKenh"
        v-model="channel.isSelected"
        :item="channel"
      />
    </div>
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
    <span
      v-if="!isFetchingChannels && !channels.length"
      class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
    >
      Không có kết quả
    </span>
  </div>
  <JoinChannelModal
    v-model:open="isJoinChannelModalOpen"
    @create="handleRequestJoinChannel"
  />
</template>
