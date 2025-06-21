<route>
{
  meta: {
    layout: "session",
    title: "Trình chiếu - Chủ kênh",
    requiresAuth: true
  }
}
</route>

<script setup lang="ts">
import Presenting from '@/components/app/room/presenting/Presenting.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { useRoomStore } from '@/stores/room'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
const roomStore = useRoomStore()

// Get room ID from route params
const roomId = route.params.id as string

// State
const isConnecting = ref(false)
const isSessionActive = ref(false)
const showEventsDialog = ref(false)
const roomData = ref<any>(null)

// Check if user is channel owner (placeholder - implement actual check)
const isChannelOwner = computed(() => {
  // You'll need to implement this check based on your room/channel structure
  return true
})

// Computed properties (defined early to avoid hoisting issues)
const currentSlide = computed(() => {
  if (!roomData.value?.trangs)
    return null
  return roomData.value.trangs[session.sessionData.currentPage]
})

const totalSlides = computed(() => roomData.value?.trangs?.length || 0)
const sessionPin = computed(() => session.sessionData.maPin)
const isConnected = computed(() => session.isConnected)

const isCurrentPageQuestion = computed(() => {
  return currentSlide.value?.loaiTrang === 'CAU_HOI'
})

// Mock events for now - you can implement actual event tracking
const events = ref<Array<{ type: string, message: string, time: string }>>([])

// Redirect if not authorized
if (!isChannelOwner.value) {
  router.push({ name: 'index' })
}

// Load room data and create session when component mounts
onMounted(async () => {
  try {
    isConnecting.value = true

    // Load room data first
    roomData.value = await roomStore.getRoomDetail(roomId)

    // Get access token from localStorage
    const accessToken = localStorage.getItem('Slooh_AccessToken')

    // Initialize socket connection
    session.initializeSocket(accessToken || undefined)

    // Wait for socket connection
    await new Promise((resolve) => {
      const checkConnection = () => {
        if (session.isConnected) {
          resolve(void 0)
        }
        else {
          setTimeout(checkConnection, 100)
        }
      }
      checkConnection()
    })

    // Create session for this room
    await session.createSession(roomId)
    isSessionActive.value = true
    toast({
      title: 'Kết nối thành công',
      description: `Phiên trình chiếu đã được tạo. PIN: ${session.sessionData.maPin}`,
    })
  }
  catch (error: any) {
    toast({
      title: 'Lỗi kết nối',
      description: error?.message || 'Không thể tạo phiên trình chiếu',
      variant: 'destructive',
    })
    console.error('Failed to create session:', error)
  }
  finally {
    isConnecting.value = false
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (isSessionActive.value) {
    session.endSession()
  }
  session.disconnect()
})

// Navigation methods
function navigateToPage(pageIndex: number) {
  try {
    session.navigateToPage(pageIndex)
  }
  catch (error: any) {
    toast({
      title: 'Lỗi điều hướng',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

function startQuestion() {
  if (!isCurrentPageQuestion.value) {
    toast({
      title: 'Không thể bắt đầu',
      description: 'Trang hiện tại không phải là câu hỏi',
      variant: 'destructive',
    })
    return
  }

  try {
    session.startQuestion(session.sessionData.currentPage)
    toast({
      title: 'Câu hỏi đã bắt đầu',
      description: 'Thành viên có thể bắt đầu trả lời',
    })
  }
  catch (error: any) {
    toast({
      title: 'Lỗi bắt đầu câu hỏi',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

function showLeaderboard() {
  try {
    session.showLeaderboard()
    toast({
      title: 'Bảng xếp hạng',
      description: 'Đã hiển thị bảng xếp hạng cho thành viên',
    })
  }
  catch (error: any) {
    toast({
      title: 'Lỗi hiển thị bảng xếp hạng',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

async function endSession() {
  try {
    await session.endSession()
    isSessionActive.value = false
    toast({
      title: 'Kết thúc phiên',
      description: 'Phiên trình chiếu đã kết thúc',
    })
    router.push({ name: 'rooms' })
  }
  catch (error: any) {
    toast({
      title: 'Lỗi kết thúc phiên',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

// Copy PIN to clipboard
async function copyPin() {
  if (session.sessionData.maPin) {
    try {
      await navigator.clipboard.writeText(session.sessionData.maPin)
      toast({
        title: 'Đã sao chép',
        description: 'PIN đã được sao chép vào clipboard',
      })
    }
    catch {
      toast({
        title: 'Lỗi sao chép',
        description: 'Không thể sao chép PIN',
        variant: 'destructive',
      })
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Trình chiếu - Chủ kênh
            </h1>
            <p class="text-gray-600 mt-1">
              Quản lý phiên trình chiếu của bạn
            </p>
          </div>

          <!-- Connection Status -->
          <div class="flex items-center gap-4">
            <span
              :class="isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
              class="text-sm px-3 py-1 rounded"
            >
              {{ isConnected ? 'Đã kết nối' : 'Mất kết nối' }}
            </span>

            <!-- Session PIN -->
            <div v-if="sessionPin" class="flex items-center gap-2">
              <span class="text-sm text-gray-600">PIN:</span>
              <Button
                variant="outline"
                size="sm"
                class="font-mono text-lg"
                @click="copyPin"
              >
                {{ sessionPin }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isConnecting" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p class="text-gray-600">
          Đang kết nối và tạo phiên trình chiếu...
        </p>
      </div>

      <!-- Main Content -->
      <div v-else-if="isSessionActive" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Slide Preview -->
        <div class="lg:col-span-2">
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="flex items-center justify-between">
                <span>Slide hiện tại</span>
                <span class="text-sm bg-gray-100 px-2 py-1 rounded">
                  {{ session.sessionData.currentPage + 1 }} / {{ totalSlides }}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent class="h-full">
              <Presenting
                v-if="currentSlide"
                :slide="currentSlide"
                :current="session.sessionData.currentPage"
                :length="totalSlides"
                @next="navigateToPage(session.sessionData.currentPage + 1)"
                @previous="navigateToPage(session.sessionData.currentPage - 1)"
              />

              <div v-else class="text-center py-12 text-gray-500">
                Không có slide nào được chọn
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Controls Panel -->
        <div class="space-y-6">
          <!-- Navigation Controls -->
          <Card>
            <CardHeader>
              <CardTitle>Điều khiển</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Previous/Next buttons -->
              <div class="flex gap-2">
                <Button
                  :disabled="session.sessionData.currentPage <= 0"
                  variant="outline"
                  class="flex-1"
                  @click="navigateToPage(session.sessionData.currentPage - 1)"
                >
                  ← Trước
                </Button>
                <Button
                  :disabled="session.sessionData.currentPage >= totalSlides - 1"
                  variant="outline"
                  class="flex-1"
                  @click="navigateToPage(session.sessionData.currentPage + 1)"
                >
                  Sau →
                </Button>
              </div>
              <div v-if="isCurrentPageQuestion" class="w-full">
                <Button variant="default" class="w-full" @click="startQuestion">
                  Bắt đầu câu hỏi
                </Button>
              </div>

              <Separator />

              <!-- Page selector -->
              <div class="space-y-2">
                <label class="text-sm font-medium">Chuyển đến trang:</label>
                <div class="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  <Button
                    v-for="(slide, index) in roomData?.trangs"
                    :key="index"
                    :variant="index === session.sessionData.currentPage ? 'default' : 'outline'"
                    size="sm"
                    class="text-xs"
                    @click="navigateToPage(index)"
                  >
                    {{ index + 1 }}
                  </Button>
                </div>
              </div>

              <Separator />

              <!-- Session controls -->
              <div class="space-y-2">
                <Button variant="outline" class="w-full" @click="showLeaderboard">
                  Bảng xếp hạng
                </Button>

                <!-- Events Dialog -->
                <Dialog v-model:open="showEventsDialog">
                  <DialogTrigger as-child>
                    <Button variant="outline" class="w-full">
                      Xem sự kiện
                      <span v-if="events.length" class="ml-2 bg-gray-200 px-2 py-1 rounded text-xs">
                        {{ events.length }}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="max-w-2xl max-h-96">
                    <DialogHeader>
                      <DialogTitle>Nhật ký sự kiện</DialogTitle>
                    </DialogHeader>
                    <div class="space-y-2 overflow-y-auto">
                      <div
                        v-for="(event, index) in events.slice().reverse()"
                        :key="index"
                        class="text-sm p-2 rounded border-l-4"
                        :class="{
                          'border-l-green-500 bg-green-50': event.type === 'received',
                          'border-l-blue-500 bg-blue-50': event.type === 'sent',
                          'border-l-red-500 bg-red-50': event.type === 'error',
                        }"
                      >
                        <div class="flex justify-between items-start">
                          <span>{{ event.message }}</span>
                          <span class="text-xs text-gray-500 ml-2">{{ event.time }}</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="destructive" class="w-full" @click="endSession">
                  Kết thúc phiên
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Session Info -->
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phiên</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Phòng:</span>
                <span class="font-medium">{{ roomData?.tenPhong }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">PIN:</span>
                <span class="font-mono">{{ sessionPin }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tổng slides:</span>
                <span>{{ totalSlides }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Slide hiện tại:</span>
                <span>{{ session.sessionData.currentPage + 1 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thành viên:</span>
                <span>{{ session.memberCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Trạng thái:</span>
                <span
                  :class="isConnected ? 'text-green-600' : 'text-red-600'"
                  class="text-xs"
                >
                  {{ isConnected ? 'Đã kết nối' : 'Mất kết nối' }}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">
          Không thể tạo phiên trình chiếu
        </h2>
        <p class="text-gray-600 mb-4">
          Đã xảy ra lỗi khi kết nối hoặc tạo phiên trình chiếu. Vui lòng thử lại sau.
        </p>
        <Button variant="outline" @click="router.go(0)">
          Thử lại
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.625;
}
</style>
