import type { Socket } from 'socket.io-client'
import { useSocketIO } from '@/service/socket'
// src/stores/socket.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Interface definitions
interface BaseResponse {
  success: boolean
  message?: string
}

interface CreateSessionResponse extends BaseResponse {
  data: {
    maPhien?: string
    maPin?: string
  }
}

interface JoinSessionResponse extends BaseResponse {
  maThanhVienPhien?: string
}

interface SubmitAnswerResponse extends BaseResponse {
  score?: number
}

interface Member {
  maThanhVienPhien: string
  tenThanhVien: string
  anhDaiDien?: string
}

interface SessionData {
  maPhien?: string
  maPin?: string
  maThanhVienPhien?: string
  isHost: boolean
  currentPage: number
  members: Member[]
  leaderboard: any[]
  finalLeaderboard: any[]
}

interface QuestionState {
  isActive: boolean
  trangIndex: number
  startTime: number
}

export const useSessionStore = defineStore('session', () => {
  // State
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const accessToken = ref<string | undefined>()

  // Session state
  const sessionData = ref<SessionData>({
    isHost: false,
    currentPage: 0,
    members: [],
    leaderboard: [],
    finalLeaderboard: [],
  })

  // Question state
  const questionState = ref<QuestionState>({
    isActive: false,
    trangIndex: 0,
    startTime: 0,
  })

  // Error state
  const error = ref<string | null>(null)
  const loading = ref(false)

  // Computed
  const isInSession = computed(() =>
    !!(sessionData.value.maPhien || sessionData.value.maThanhVienPhien),
  )

  const memberCount = computed(() => sessionData.value.members.length)

  const setupSocketListeners = () => {
    if (!socket.value)
      return

    // Connection events
    socket.value.on('connect', () => {
      isConnected.value = true
      error.value = null
      console.log('Connected to server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from server')
    })

    socket.value.on('error', (errorData: any) => {
      error.value = errorData.message || 'Socket error occurred'
      console.error('Socket error:', errorData)
    })

    // Session events
    socket.value.on('phien:started', (data: { maPhien: string, maPin: string }) => {
      sessionData.value.maPhien = data.maPhien
      sessionData.value.maPin = data.maPin
      console.log('Session started:', data)
    })

    socket.value.on('phien:memberJoined', (data: Member) => {
      const existingIndex = sessionData.value.members.findIndex(
        member => member.maThanhVienPhien === data.maThanhVienPhien,
      )

      if (existingIndex === -1) {
        sessionData.value.members.push(data)
      }
      else {
        sessionData.value.members[existingIndex] = data
      }

      console.log('Member joined:', data)
    })

    socket.value.on('phien:memberLeft', (data: { maThanhVienPhien: string }) => {
      sessionData.value.members = sessionData.value.members.filter(
        member => member.maThanhVienPhien !== data.maThanhVienPhien,
      )
      console.log('Member left:', data)
    })

    socket.value.on('phien:navigated', (data: { trangIndex: number }) => {
      sessionData.value.currentPage = data.trangIndex
      console.log('Navigate to page:', data.trangIndex)
    })

    socket.value.on('phien:questionStarted', (data: { trangIndex: number, startTime: number }) => {
      questionState.value = {
        isActive: true,
        trangIndex: data.trangIndex,
        startTime: data.startTime,
      }
      console.log('Question started:', data)
    })

    socket.value.on('phien:answerSubmitted', (data: { maThanhVienPhien: string }) => {
      console.log('Answer submitted by:', data.maThanhVienPhien)
    })

    socket.value.on('phien:leaderboard', (data: any[]) => {
      sessionData.value.leaderboard = data
      console.log('Leaderboard updated:', data)
    })

    socket.value.on('phien:ended', (data: { finalLeaderboard: any[] }) => {
      sessionData.value.finalLeaderboard = data.finalLeaderboard
      questionState.value.isActive = false
      console.log('Session ended:', data)
    })
  }
  // Actions
  const initializeSocket = (token?: string) => {
    if (socket.value) {
      socket.value.disconnect()
    }

    accessToken.value = token
    socket.value = useSocketIO()

    if (token) {
      socket.value.auth = { token }
    }

    setupSocketListeners()
  }

  // Host functions
  const createSession = async (maPhong: string): Promise<CreateSessionResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<CreateSessionResponse>((resolve, reject) => {
        socket.value!.emit('phien:create', { maPhong }, (response: CreateSessionResponse) => {
          if (response.success) {
            resolve(response)
          }
          else {
            reject(new Error(response.message))
          }
        })
      })
      sessionData.value.isHost = true
      sessionData.value.maPhien = response.data.maPhien
      sessionData.value.maPin = response.data.maPin

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const navigateToPage = (trangIndex: number) => {
    if (!socket.value)
      return
    socket.value.emit('phien:navigate', { trangIndex })
  }

  const startQuestion = (trangIndex: number) => {
    if (!socket.value)
      return
    socket.value.emit('phien:startQuestion', { trangIndex })
  }

  const showLeaderboard = () => {
    if (!socket.value)
      return
    socket.value.emit('phien:showLeaderboard')
  }

  // Utility functions
  const resetSessionData = () => {
    sessionData.value = {
      isHost: false,
      currentPage: 0,
      members: [],
      leaderboard: [],
      finalLeaderboard: [],
    }
    questionState.value = {
      isActive: false,
      trangIndex: 0,
      startTime: 0,
    }
  }

  const endSession = async (): Promise<BaseResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<BaseResponse>((resolve, reject) => {
        socket.value!.emit('phien:end', (response: BaseResponse) => {
          if (response.success) {
            resolve(response)
          }
          else {
            reject(new Error(response.message))
          }
        })
      })

      // Reset session data
      resetSessionData()

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to end session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Participant functions
  const joinSession = async (maPin: string, tenThanhVien?: string): Promise<JoinSessionResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<JoinSessionResponse>((resolve, reject) => {
        socket.value!.emit('phien:join', { maPin, tenThanhVien }, (response: JoinSessionResponse) => {
          if (response.success) {
            resolve(response)
          }
          else {
            reject(new Error(response.message))
          }
        })
      })

      sessionData.value.isHost = false
      sessionData.value.maPin = maPin
      sessionData.value.maThanhVienPhien = response.maThanhVienPhien

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to join session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const submitAnswer = async (maLuaChon: string, thoiGian: number): Promise<SubmitAnswerResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<SubmitAnswerResponse>((resolve, reject) => {
        socket.value!.emit(
          'phien:submitAnswer',
          { maLuaChon, thoiGian },
          (response: SubmitAnswerResponse) => {
            if (response.success) {
              resolve(response)
            }
            else {
              reject(new Error(response.message))
            }
          },
        )
      })

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit answer'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const leaveSession = async (): Promise<BaseResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<BaseResponse>((resolve, reject) => {
        socket.value!.emit('phien:leave', (response: BaseResponse) => {
          if (response.success) {
            resolve(response)
          }
          else {
            reject(new Error(response.message))
          }
        })
      })

      // Reset session data
      resetSessionData()

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to leave session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    isConnected.value = false
    resetSessionData()
  }

  // Initialize socket on store creation
  initializeSocket()

  return {
    // State
    socket,
    isConnected,
    sessionData,
    questionState,
    error,
    loading,

    // Computed
    isInSession,
    memberCount,

    // Actions
    initializeSocket,
    createSession,
    navigateToPage,
    startQuestion,
    showLeaderboard,
    endSession,
    joinSession,
    submitAnswer,
    leaveSession,
    clearError,
    disconnect,
  }
})
