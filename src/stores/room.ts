import type { BodyUpdateRoom } from '@/types'
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

  async function updateRoom(id: string, data: BodyUpdateRoom) {
    const response = await roomApi.updateRoom(id, data)
    return response.data
  }

  return {
    createRoom,
    getRoomDetail,
    updateRoom,
  }
})
