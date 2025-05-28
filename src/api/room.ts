import type { BodyUpdateRoom } from '@/types'
import { $get, $post, $put } from './axios'

export function createRoom(data: { tenPhong: string, maKenh: string }) {
  return $post('/phong', data)
}

export function getRoomDetail(id: string) {
  return $get(`/phong/${id}`)
}

export function updateRoom(id: string, data: BodyUpdateRoom) {
  return $put(`/phong/${id}`, data)
}
