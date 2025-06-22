<route>
{
  meta: {
    layout: "session",
    title: "Phiên trình chiếu - Thành viên"
  }
}
</route>

<script setup lang="ts">
import type { Phong, Slide } from '@/types'
import { phienApi } from '@/api/phien'
import SlidePresenting from '@/components/common/SlidePresenting.vue'
import { useRoomStore } from '@/stores/room'
import { useSessionStore } from '@/stores/session'
import { LoaiCauTraLoi, LoaiSlide, SocketEvent } from '@/types'
import { useAsyncState } from '@vueuse/core'

const LOAITRALOI = {
  [LoaiCauTraLoi.SINGLE_SELECT]: 'Trắc nghiệm một lựa chọn',
  [LoaiCauTraLoi.MULTI_SELECT]: 'Trắc nghiệm nhiều lựa chọn',
  [LoaiCauTraLoi.TRUE_FALSE]: 'Đúng/Sai',
} as const

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
// const roomStore = useRoomStore()

// State
const currentSlide = ref<Slide | null>(null)
const isConnecting = ref(false)
const isSessionError = ref(false)
const showNotice = ref(true)
const questionStarted = ref(false)
const roomData = ref<Phong | null>(null)

const showOption = ref(false)
const countDownShowOption = ref(5)
const countDownEndQuestion = ref(10) // Add countdown for question end
let intervalShowOptionId: any = null
let intervalEndQuestionId: any = null
// Get pin from route params
const pin = route.params.pin as string
const name = decodeURIComponent(route.query.name as string || '')
if (!pin || pin.length !== 6) {
  router.push('/prepare')
}
// Load initial session data
const { isLoading } = useAsyncState(async () => {
  try {
    isConnecting.value = true // Get session data by PIN

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

    // Join the session
    const response = await session.joinSession(pin, name)
    roomData.value = response.data.phong
    console.log('Session joined:', response)
  }
  catch (error: any) {
    console.error('Error joining session:', error)
    isSessionError.value = true
  }
  finally {
    isConnecting.value = false
  }
}, null, { immediate: true })

// Socket event handlers
onMounted(() => {
  // Listen for navigation events
  session.socket?.on(SocketEvent.NAVIGATED, ({ trangIndex }) => {
    // Update current slide
    if (roomData.value?.trangs && trangIndex >= 0 && trangIndex < roomData.value.trangs.length) {
      currentSlide.value = roomData.value.trangs[trangIndex]
    }

    // Reset states
    if (currentSlide.value?.loaiTrang === LoaiSlide.NOI_DUNG) {
      showNotice.value = true
      questionStarted.value = false
    }
  })

  // Listen for question start events
  session.socket?.on(SocketEvent.QUESTION_STARTED, () => {
    if (currentSlide.value?.loaiTrang === LoaiSlide.CAU_HOI) {
      questionStarted.value = true
      showNotice.value = false
    }
  })

  // Reset everything when session ends
  session.socket?.on(SocketEvent.ENDED, () => {
    router.push('/')
  })
})

onUnmounted(() => {
  session.disconnect()
})
function clearIntervalShowOption() {
  if (intervalShowOptionId) {
    clearInterval(intervalShowOptionId)
    intervalShowOptionId = null
  }
}

function clearIntervalEndQuestion() {
  if (intervalEndQuestionId) {
    clearInterval(intervalEndQuestionId)
    intervalEndQuestionId = null
  }
}

watch(currentSlide, (newValue) => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()

  showOption.value = false
  countDownShowOption.value = 5
  countDownEndQuestion.value = newValue?.thoiGianGioiHan || 10

  if (newValue?.loaiTrang === LoaiSlide.CAU_HOI) {
    intervalShowOptionId = setInterval(() => {
      if (countDownShowOption.value > 1) {
        countDownShowOption.value--
      }
      else {
        clearIntervalShowOption()
        showOption.value = true
        countDownShowOption.value = 5

        // Start end question countdown after options are shown
        intervalEndQuestionId = setInterval(() => {
          if (countDownEndQuestion.value >= 1) {
            countDownEndQuestion.value--
          }
          else {
            clearIntervalEndQuestion()
          }
        }, 1000)
      }
    }, 1000)
  }
}, { immediate: true })

onUnmounted(() => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()
})
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center bg-slate-900/80">
    <!-- Loading state -->
    <div
      v-if="isLoading || isConnecting"
      class="text-center"
    >
      <div class="animate-spin w-8 h-8 border-4 border-background border-t-transparent rounded-full mx-auto mb-4" />
      <p class="text-lg font-medium text-background">
        Đang kết nối...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="isSessionError"
      class="text-center space-y-4"
    >
      <Icon name="IconClose" class="w-16 h-16 text-destructive mx-auto" />
      <h2 class="text-2xl font-semibold">
        Không thể tham gia phiên trình chiếu
      </h2>
      <p class="text-muted-foreground">
        Có lỗi xảy ra khi tham gia phiên hoặc phiên không tồn tại.
      </p>
      <Button @click="router.push('/')">
        Về trang chủ
      </Button>
    </div>

    <!-- Session content -->
    <template v-else>
      <!-- Notice screen -->
      <div
        v-if="currentSlide?.loaiTrang === LoaiSlide.NOI_DUNG && showNotice"
        class="text-center space-y-6 p-6"
      >
        <h2 class="text-2xl font-semibold text-background">
          Hãy nhìn lên màn hình trình chiếu để xem nội dung
        </h2>
      </div>

      <!-- Question screen -->
      <div v-else-if="currentSlide?.loaiTrang === LoaiSlide.CAU_HOI" class="w-full h-full">
        <div v-if="!showOption" class="flex flex-col h-full justify-center items-center">
          <h2
            class="text-2xl font-semibold text-background mb-4"
          >
            Trả lời câu hỏi: {{ LOAITRALOI[currentSlide.loaiCauTraLoi!] }}
          </h2>
          <div
            class="mb-12 z-10 rounded-full w-24 leading-[96px] flex justify-center items-center bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 text-5xl font-semibold"
            @click="showOption = true"
          >
            {{ countDownShowOption }}
          </div>
        </div>
        <div
          v-else
          class="flex relative w-full h-full flex-col items-center justify-end p-4"
        >
          <div class="border-2 mb-4 right-0 z-10 rounded-full px-6 py-4 bg-primary text-2xl text-background font-semibold min-w-36 text-center">
            Còn {{ countDownEndQuestion }}s
          </div>
          <div
            class="grid lg:grid-cols-2 gap-y-2.5 lg:gap-x-10 lg:gap-y-4 shrink-0 w-full rounded-lg"
          >
            <template v-for="(option, index) in currentSlide!.luaChon" :key="index">
              <AnswerOption
                v-model:option="currentSlide!.luaChon![index]"
                :index="index"
                :class="{ 'border-[4px] border-success': countDownEndQuestion <= 0 && option.ketQua === true }"
              />
            </template>
          </div>
        </div>
      </div>
      <!-- Default slide content -->
      <div v-else class="w-full h-full flex items-center justify-center text-background text-2xl">
        Vui lòng chờ, đang tải nội dung...
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
