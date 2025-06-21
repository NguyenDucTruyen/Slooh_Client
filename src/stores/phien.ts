import { phienApi } from '@/api/phien'
import { defineStore } from 'pinia'

export const usePhienStore = defineStore('phine', () => {
  // Create new presentation session
  const createPhien = async (maPhong: string) => {
    const response = await phienApi.createPhien(maPhong)
    return response.data
  }

  // Get session by PIN
  const getPhienByPin = async (maPin: string) => {
    const response = await phienApi.getPhienByPin(maPin)
    return response.data
  }

  // Get session details
  const getPhienById = async (maPhien: string) => {
    const response = await phienApi.getPhienById(maPhien)
    return response.data
  }
  // Get leaderboard
  const getLeaderboard = async (maPhien: string) => {
    const response = await phienApi.getLeaderboard(maPhien)
    return response.data
  }
  return {
    createPhien,
    getPhienByPin,
    getPhienById,
    getLeaderboard,
  }
})
