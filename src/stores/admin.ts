import type { TrangThai } from '@/types'
import * as api from '@/api/admin'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  async function getAllUser(config: any = {}) {
    const response = await api.apiGetAllUsers(config)
    return response
  }
  async function changeUserStatus(
    userId: string,
    status: TrangThai,
  ) {
    const response = await api.changeUserStatus(userId, status)
    return response
  }

  return {
    getAllUser,
    changeUserStatus,
  }
})
