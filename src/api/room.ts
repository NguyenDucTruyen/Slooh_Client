import { $get, $post } from './axios'

export function createRoom(data: { tenPhong: string, maKenh: string }) {
  return $post('/phong', data)
}

export function getRoomDetail(id: string) {
  return $get(`/phong/${id}`)
}
