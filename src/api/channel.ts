import { $delete, $get, $patch, $post } from './axios'

export function getChannelList(config: any) {
  return $get('/kenh', {
    params: config,
  })
}
export function createChannel(name: string) {
  return $post('/kenh', { tenKenh: name })
}

export function updateChannel(id: string, name: string) {
  return $patch(`/kenh/${id}`, { tenKenh: name })
}
export function deleteChannel(id: string) {
  return $delete(`/kenh/${id}`)
}
