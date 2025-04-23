import * as apiChannel from '@/api/channel'
import { defineStore } from 'pinia'

export const useChannelStore = defineStore('channel', () => {
  async function getChannelList(config: any) {
    const res = await apiChannel.getChannelList(config)
    return res.data
  }
  async function createChannel(name: string) {
    const res = await apiChannel.createChannel(name)
    return res.data
  }
  async function updateChannel(id: string, name: string) {
    const res = await apiChannel.updateChannel(id, name)
    return res.data
  }
  async function deleteChannel(listId: string[]) {
    const res = await Promise.all(listId.map(id => apiChannel.deleteChannel(id)))
    return res.map(response => response.data)
  }
  return { createChannel, getChannelList, updateChannel, deleteChannel }
})
