<route>
  {
      meta: {
          title: 'Change Password',
          layout: 'profile'
      }
  }
</route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { changePasswordValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const form = useForm({
  validationSchema: toTypedSchema(changePasswordValidator),
})
const isLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await userStore.updatePassword(values)
    toast({
      title: 'Thành công',
      description: 'Đổi mật khẩu thành công',
    })
    await authStore.logout()
    router.push('/')
    form.resetForm()
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = Array.isArray(data?.message) ? data.message[0]?.message : data?.message || data?.error || 'Some thing went wrong'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>
  <form class="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto h-max w-full" @submit.prevent="onSubmit">
    <CardHeader>
      <CardTitle class="text-2xl text-center">
        Đổi mật khẩu
      </CardTitle>
      <CardDescription class="text-center">
        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của bạn.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="">
        <InputValidator id="password" label="Mật khẩu hiện tại" placeholder="Nhập mật khẩu hiện tại" type="password" name="currentPassword" />
        <InputValidator id="newPassword" label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" type="password" name="newPassword" />
        <InputValidator id="confirmNewPassword" label="Xác nhận mật khẩu mới" placeholder="Xác nhận mật khẩu mới" type="password" name="confirmNewPassword" />
        <Button type="submit" :disabled="isLoading" class="ml-4">
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Vui lòng chờ
          </template>
          <template v-else>
            Đổi mật khẩu
          </template>
        </Button>
      </div>
    </CardContent>
  </form>
</template>
