import type { BodyUpdateRoom } from '@/types'
import { $delete, $get, $post, $put } from './axios'

export function createRoom(data: { tenPhong: string, maKenh: string }) {
  return $post('/phong', data)
}

export function getRoomDetail(id: string) {
  return $get(`/phong/${id}`)
}

export function updateRoom(id: string, data: BodyUpdateRoom) {
  return $put(`/phong/${id}`, data)
}

// Create a public room (no channel required)
export function creatPublicRoom(tenPhong: string) {
  return $post('/phong/public', { tenPhong })
}

// Create a public room (no channel required)
export function getPublicRoomList() {
  return $get('/phong/public', { page: 1, limit: 100 })
}

export function deleteRoom(id: string) {
  return $delete(`/phong/${id}`)
}

export function cloneRoom({ roomId, channelId }: { roomId: string, channelId: string }) {
  return $post(`/phong/${roomId}/clone`, { targetChannelId: channelId })
}
