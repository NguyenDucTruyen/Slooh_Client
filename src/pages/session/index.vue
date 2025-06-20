<route>
    {
        meta: {
        layout: "session",
        title: "Phiên trình chiếu",
        }
    }
</route>

<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '@/components/ui/pin-input'
import { useUserStore } from '@/stores/user'
import { formJoinSessionValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useAsyncState } from '@vueuse/core'
import { useForm } from 'vee-validate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
if (!route.query.pin) {
  router.push({ name: 'PublicRoom' })
}

// Get pin from query parameters and convert to array of strings
const queryPin = ref(route.query.pin as string || '')
const pinArray = computed(() => {
  return queryPin.value.split('').slice(0, 6)
})

const form = useForm({
  validationSchema: toTypedSchema(formJoinSessionValidator),
  initialValues: {
    name: userStore.user?.hoTen || '',
  },
})

const onSubmit = form.handleSubmit(async (_values) => {
  // Handle form submission
})
</script>

<template>
  <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Tham gia phiên trình chiếu
        </CardTitle>
        <CardDescription class="text-center">
          Nhập họ tên của bạn để tham gia phiên trình chiếu
        </CardDescription>
      </CardHeader>      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label class="text-sm font-medium">Mã PIN phiên trình chiếu</Label>
            <PinInput
              :model-value="pinArray"
              placeholder="○"
              class="flex gap-2 items-center"
              otp
              type="number"
              disabled
            >
              <PinInputGroup>
                <PinInputSlot
                  v-for="(_, index) in 6"
                  :key="index"
                  :index="index"
                  class="bg-muted"
                />
              </PinInputGroup>
            </PinInput>
            <p class="text-sm text-muted-foreground">
              Bạn sẽ tham gia phiên trình chiếu với mã PIN trên
            </p>
          </div>
          <div class="grid gap-2">
            <InputValidator id="name" type="name" label="Họ tên" name="name" placeholder="Họ tên của bạn" />
          </div>
          <Button
            type="submit"
          >
            Tham gia phiên
          </Button>
        </div>
      </CardContent>
    </Card>
  </form>
</template>
