<script setup lang="ts">
import type { Slide } from '@/types'
import { CachTrinhBay, Diem, LoaiCauTraLoi, LoaiSlide } from '@/types'

const slideModel = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const listTimeOption = [
  { value: 5, label: '5 giây' },
  { value: 10, label: '10 giây' },
  { value: 15, label: '15 giây' },
  { value: 20, label: '20 giây' },
  { value: 30, label: '30 giây' },
  { value: 60, label: '1 phút' },
  { value: 120, label: '2 phút' },
  { value: 180, label: '3 phút' },
  { value: 300, label: '5 phút' },
]
function handleUpdateLoaiTrang(newValue: LoaiSlide) {
  slideModel.value.loaiTrang = newValue
  if (newValue === LoaiSlide.NOI_DUNG) {
    slideModel.value.cachTrinhBay = CachTrinhBay.CO_BAN
    slideModel.value.luaChon = []
  }
  else {
    slideModel.value.thoiGianGioiHan = 5
    slideModel.value.diem = Diem.BINH_THUONG
    slideModel.value.loaiCauTraLoi = LoaiCauTraLoi.SINGLE_SELECT
    slideModel.value.noiDung = ''
  }
}
function handleUpdateLoaiCauTraLoi(newValue: LoaiCauTraLoi) {
  slideModel.value.loaiCauTraLoi = newValue
  slideModel.value.luaChon = Array.from({ length: newValue === LoaiCauTraLoi.TRUE_FALSE ? 2 : 4 }).map(() => ({
    noiDung: '',
    ketQua: false,
  }))
}
</script>

<template>
  <div class="w-full flex-col items-center p-2">
    <div class="flex flex-col mb-4">
      <Label class="mb-1">Loại Trang</Label>
      <Select
        :model-value="slideModel.loaiTrang"
        class="w-full mb-4"
        @update:model-value="handleUpdateLoaiTrang"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Chọn loại trang" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem :value="LoaiSlide.NOI_DUNG">
              Nội dung
            </SelectItem>
            <SelectItem :value="LoaiSlide.CAU_HOI">
              Câu hỏi
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <Separator class="my-4" />
    <!-- Presentation Style Section -->
    <div v-if="slideModel.loaiTrang === LoaiSlide.NOI_DUNG" class="flex flex-col mb-4">
      <Label class="mb-1">Cách trình bày</Label>
      <Select
        v-model="slideModel.cachTrinhBay"
        class="w-full mb-4"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Chọn cách trình bày" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem :value="CachTrinhBay.CO_BAN">
              Cơ bản
            </SelectItem>
            <SelectItem :value="CachTrinhBay.HAI_COT">
              Hai cột
            </SelectItem>
            <SelectItem :value="CachTrinhBay.TRICH_DAN">
              Trích dẫn
            </SelectItem>
            <SelectItem :value="CachTrinhBay.HINH_ANH">
              Hình ảnh
            </SelectItem>
            <SelectItem :value="CachTrinhBay.CO_BAN_TEXT">
              Văn bản
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <template v-else>
      <!-- Time Limit Section -->
      <div class="flex flex-col mb-4">
        <Label class="mb-1">Thời gian giới hạn</Label>
        <Select
          v-model="slideModel.thoiGianGioiHan"
          class="w-full mb-4"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Chọn thời gian" class="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="option in listTimeOption"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <!-- Points Section -->
      <div class="flex flex-col mb-4">
        <Label class="mb-1">Điểm số</Label>
        <Select
          v-model="slideModel.diem"
          class="w-full mb-4"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Chọn điểm số" class="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="Diem.BINH_THUONG">
                Bình thường
              </SelectItem>
              <SelectItem :value="Diem.GAP_DOI">
                Gấp đôi
              </SelectItem>
              <SelectItem :value="Diem.KHONG_DIEM">
                Không điểm
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator class="my-4" />
      <!-- Question Type Section -->
      <div v-if="slideModel.loaiTrang === LoaiSlide.CAU_HOI" class="flex flex-col mb-4">
        <Label class="mb-1">Loại câu trả lời</Label>
        <Select
          :model-value="slideModel.loaiCauTraLoi"
          class="w-full mb-4"
          @update:model-value="handleUpdateLoaiCauTraLoi"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Chọn loại câu trả lời" class="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="LoaiCauTraLoi.SINGLE_SELECT">
                Chọn một đáp án
              </SelectItem>
              <SelectItem :value="LoaiCauTraLoi.MULTI_SELECT">
                Chọn nhiều đáp án
              </SelectItem>
              <SelectItem :value="LoaiCauTraLoi.TRUE_FALSE">
                Đúng / Sai
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </template>
  </div>
</template>
