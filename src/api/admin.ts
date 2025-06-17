import type { TrangThai } from '@/types'
import { $get, $patch } from './axios'

export async function apiGetAllUsers(config: any) {
  const response = await $get('/users', {
    params: config,
  })
  return response
}

export async function changeUserStatus(
  userId: string,
  status: TrangThai,
) {
  const response = await $patch(`/users/${userId}/status`, {
    trangThai: status,
  })
  return response
}
