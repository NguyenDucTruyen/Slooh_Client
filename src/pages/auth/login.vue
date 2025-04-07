<route>
  {
      meta: {
      layout: "auth",
      title: "Login",
      }
  }
  </route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { loginValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useAsyncState } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()
if (route.query.error) {
  toast({
    title: 'Lỗi',
    description: route.query.error as string ?? 'Có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.',
    variant: 'destructive',
    duration: 5000,
  })
  router.replace({ query: { ...route.query, error: undefined } })
}
const authStore = useAuthStore()
const form = useForm({
  validationSchema: toTypedSchema(loginValidator),
})

const { isLoading, execute } = useAsyncState(authStore.login, null, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  await execute(0, values)
})
function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_URL}/v1/auth/google`
}
</script>

<template>
  <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Login
        </CardTitle>
        <CardDescription class="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <InputValidator id="email" type="email" label="Email" placeholder="example@gmai.com" name="email" />
            <div class="grid gap-2">
              <InputValidator id="password" type="password" placeholder="Password" label="Password" name="password" />
              <RouterLink to="/auth/forgot-password" class="ml-auto text-sm underline">
                Forgot your password?
              </RouterLink>
            </div>
          </div>
          <Button
            type="submit"
            :is-loading="isLoading"
          >
            Login
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <RouterLink to="/auth/signup" class="underline">
            Sign up
          </RouterLink>
        </div>
        <Separator label="Or" style-label="bg-transparent" class="my-4" />
        <Button type="button" class="w-full" @click="loginWithGoogle">
          <Icon name="IconGoogle" class="w-8 h-8" />
          Login with Google
        </Button>
      </cardcontent>
    </Card>
  </form>
</template>
