<route>
  {
      meta: {
      layout: "admin",
      title: "Admin - Quản lý phòng",
      }
  }
</route>

<script setup lang="ts">
import type { Phong, TrangThai } from '@/types'
import { Switch } from '@/components/ui/switch'
import { useAdminStore } from '@/stores/admin'
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import { ArrowLeft, Calendar, Eye, Loader2, Search, Users, Video } from 'lucide-vue-next'

interface PaginatedRoomsResponse {
  rooms: Phong[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const channelId = route.params.id as string

const queryConfig = ref({
  tenPhong: '',
  page: 1,
  limit: 10,
})

const metaData = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
})

// Initialize queryConfig from URL parameters
function _initializeFromRoute() {
  const page = Number(route.query.page) || 1
  const search = (route.query.search as string) || ''
  const limit = Number(route.query.limit) || 10

  queryConfig.value = {
    tenPhong: search,
    page,
    limit,
  }
}

const { isLoading, state, execute: _execute } = useAsyncState<Phong[]>(
  async () => {
    const response = await adminStore.getAllRoomsInChannel(channelId, queryConfig.value) as PaginatedRoomsResponse
    metaData.value = {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
    return response.rooms
  },
  [],
  { immediate: false },
)

// Update URL query parameters
function updateQueryParams(params: Record<string, any>) {
  const query = { ...route.query, ...params }

  // Remove empty search parameter
  if (params.search === '') {
    delete query.search
  }

  router.push({ query })
}

// Handle search input changes with debounced URL update
const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: queryConfig.value.tenPhong, page: 1 })
}, 300)

// Handle page changes from pagination
function handlePageChange(newPage: number) {
  updateQueryParams({ page: newPage })
}

// Watch for search input changes
watch(() => queryConfig.value.tenPhong, debouncedSearch)

async function updateRoomStatus(maPhong: string, trangThai: boolean) {
  const status = trangThai ? 'HOAT_DONG' as TrangThai : 'KHOA' as TrangThai
  await adminStore.updateRoomStatus(maPhong, status)
  state.value = state.value.map((room) => {
    if (room.maPhong === maPhong) {
      return { ...room, trangThai: status }
    }
    return room
  })
}

function goBack() {
  router.push('/admin/channel')
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getStatusText(status: TrangThai) {
  return status === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa'
}

function getActivityText(activity: string) {
  switch (activity) {
    case 'OFFLINE':
      return 'Offline'
    case 'WAITING':
      return 'Đang chờ'
    case 'PRESENTING':
      return 'Đang trình bày'
    default:
      return 'Không xác định'
  }
}

function getActivityColor(activity: string) {
  switch (activity) {
    case 'OFFLINE':
      return 'text-gray-500'
    case 'WAITING':
      return 'text-yellow-500'
    case 'PRESENTING':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

// Computed statistics
const roomStats = computed(() => {
  if (!state.value?.length)
    return null

  const total = state.value.length
  const active = state.value.filter(room => room.trangThai === 'HOAT_DONG').length
  const locked = state.value.filter(room => room.trangThai === 'KHOA').length
  const presenting = state.value.filter(room => room.hoatDong === 'PRESENTING').length

  return { total, active, locked, presenting }
})
</script>

<template>
  <div class="h-full flex flex-col py-6">
    <!-- Header Section -->
    <div class="border-b bg-card mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="goBack">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 class="text-2xl font-bold text-foreground">
                Quản lý phòng - Kênh {{ channelId }}
              </h1>
              <p class="text-sm text-muted-foreground mt-1">
                Quản lý và giám sát tất cả các phòng trong kênh này
              </p>
            </div>
          </div>

          <!-- Summary Cards -->
          <div v-if="roomStats" class="flex gap-4">
            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Users class="w-5 h-5 text-blue-600" />
                <div>
                  <p class="text-sm font-medium">
                    Tổng phòng
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.total }}
                  </p>
                </div>
              </div>
            </Card>

            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Eye class="w-5 h-5 text-green-600" />
                <div>
                  <p class="text-sm font-medium">
                    Hoạt động
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.active }}
                  </p>
                </div>
              </div>
            </Card>

            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Video class="w-5 h-5 text-orange-600" />
                <div>
                  <p class="text-sm font-medium">
                    Đang trình bày
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.presenting }}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="px-6 mb-6">
      <div class="flex items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <Input
            v-model="queryConfig.tenPhong"
            placeholder="Tìm kiếm phòng..."
            class="pl-10"
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>

        <!-- Items per page -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-muted-foreground">Hiển thị:</span>          <Select
            :model-value="String(queryConfig.limit)"
            @update:model-value="(value: string) => updateQueryParams({ limit: Number(value), page: 1 })"
          >
            <SelectTrigger class="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">
                5
              </SelectItem>
              <SelectItem value="10">
                10
              </SelectItem>
              <SelectItem value="20">
                20
              </SelectItem>
              <SelectItem value="50">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex-1 px-6">
      <Card>
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="text-lg">
              Danh sách phòng
            </CardTitle>
            <div class="text-sm text-muted-foreground">
              Hiển thị {{ ((metaData.page - 1) * metaData.limit) + 1 }} -
              {{ Math.min(metaData.page * metaData.limit, metaData.total) }}
              trong tổng số {{ metaData.total }} phòng
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <Loader2 class="w-6 h-6 animate-spin text-muted-foreground" />
            <span class="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="!state?.length" class="text-center py-12">
            <Users class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-medium text-foreground mb-2">
              Không có phòng nào
            </h3>
            <p class="text-muted-foreground">
              {{ queryConfig.tenPhong ? 'Không tìm thấy phòng phù hợp với từ khóa tìm kiếm' : 'Kênh này chưa có phòng nào' }}
            </p>
          </div>

          <!-- Table -->
          <div v-else>
            <Table>
              <TableHeader>
                <TableRow class="hover:bg-transparent border-b">
                  <TableHead class="font-semibold">
                    Tên phòng
                  </TableHead>
                  <TableHead class="font-semibold">
                    Chủ phòng
                  </TableHead>
                  <TableHead class="font-semibold">
                    Hoạt động
                  </TableHead>
                  <TableHead class="font-semibold">
                    Số slide
                  </TableHead>
                  <TableHead class="font-semibold">
                    Ngày tạo
                  </TableHead>
                  <TableHead class="font-semibold">
                    Trạng thái
                  </TableHead>
                  <TableHead class="font-semibold text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="room in state"
                  :key="room.maPhong"
                  class="hover:bg-muted/50 transition-colors"
                >
                  <TableCell class="font-medium">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Video class="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div class="font-medium">
                          {{ room.tenPhong }}
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {{ room.maPhong }}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">{{ room.maChuPhong.charAt(0).toUpperCase() }}</span>
                      </div>
                      <span class="text-sm">{{ room.maChuPhong }}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span :class="`text-sm font-medium ${getActivityColor(room.hoatDong)}`">
                      {{ getActivityText(room.hoatDong) }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center space-x-1">
                      <Calendar class="w-4 h-4 text-muted-foreground" />
                      <span class="text-sm">{{ room._count?.trangs || 0 }}</span>
                    </div>
                  </TableCell>
                  <TableCell class="text-sm text-muted-foreground">
                    {{ formatDate(room.ngayTao) }}
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="room.trangThai === 'HOAT_DONG' ? 'default' : 'destructive'"
                      class="text-xs"
                    >
                      {{ getStatusText(room.trangThai) }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <Switch
                        :checked="room.trangThai === 'HOAT_DONG'"
                        :aria-label="`Chuyển đổi trạng thái phòng ${room.tenPhong}`"
                        @update:checked="(checked: boolean) => updateRoomStatus(room.maPhong, checked)"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>        <!-- Pagination -->
        <CardFooter v-if="metaData.totalPages > 1" class="border-t pt-4">
          <Pagination
            :total="metaData.total"
            :sibling-count="1"
            :items-per-page="metaData.limit"
            :page="metaData.page"
            show-edges
            :default-page="1"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst @click="handlePageChange(1)" />
              <PaginationPrev @click="handlePageChange(Math.max(1, metaData.page - 1))" />

              <template v-for="(item, index) in items">
                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <PaginationLink @click="handlePageChange(item.value)">
                    {{ item.value }}
                  </PaginationLink>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext @click="handlePageChange(Math.min(metaData.totalPages, metaData.page + 1))" />
              <PaginationLast @click="handlePageChange(metaData.totalPages)" />
            </PaginationList>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
