import * as roomApi from '@/api/room'
import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', () => {
  async function createRoom(data: { tenPhong: string, maKenh: string }) {
    const response = await roomApi.createRoom(data)
    return response.data
  }

  async function getRoomDetail(id: string) {
    const response = await roomApi.getRoomDetail(id)
    return response.data
  }

  return {
    createRoom,
    getRoomDetail,
  }
})
