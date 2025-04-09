<script setup lang="ts">
import { HoatDongPhong, type Kenh, type Phong, TrangThai } from '@/types'

const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'create'])

const channelName = ref('')
function handleCreate() {
  if (!channelName.value.trim())
    return
  emit('create', channelName.value)
  emit('update:open', false)
}
const isCreatable = computed(() => {
  return channelName.value.trim() !== ''
})
</script>

<template>
  <Dialog :open="open" @update:open="(value:boolean) => emit('update:open', value)">
    <DialogContent class="sm:max-w-[425px] p-4">
      <DialogHeader>
        <DialogTitle>Tạo kênh mới</DialogTitle>
        <DialogDescription>
          Nhập tên kênh và nhấn "Tạo" khi bạn sẵn sàng.
        </DialogDescription>
      </DialogHeader>
      <div class="grid grid-cols-5 items-center gap-4">
        <Label for="channel-name" class="text-right"> Tên kênh </Label>
        <Input
          id="channel-name"
          v-model="channelName"
          placeholder="Nhập tên kênh"
          class="col-span-4"
          autocomplete="off"
        />
      </div>
      <DialogFooter>
        <Button
          type="submit"
          :disabled="!isCreatable"
          @click="handleCreate"
        >
          Tạo
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
