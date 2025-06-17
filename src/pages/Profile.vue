<script setup lang="ts">
import { uploadImage } from '@/api/upload'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { changePasswordValidator, emailSchema, nameSchema, passwordSchema } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const avatarPreview = ref(userStore.user?.anhDaiDien || '')
const isAvatarRemoved = ref(false)
const fileImage = ref<File | null>(null)
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const activeTab = ref('profile')

// Watch for route hash changes to switch tabs
watch(() => route.hash, (newHash) => {
  if (newHash === '#password') {
    activeTab.value = 'password'
  }
  else {
    activeTab.value = 'profile'
  }
}, { immediate: true })

// Profile form schema
const profileSchema = toTypedSchema(
  z
    .object({
      username: nameSchema,
      email: emailSchema,
      password: passwordSchema.optional(),
      confirmPassword: z.string().optional(),
      role: z.string().optional(),
      gender: z.string().optional(),
      dateOfBirth: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.password) {
          return data.password === data.confirmPassword
        }
        return true
      },
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      },
    ),
)

// Profile form
const profileForm = useForm({
  validationSchema: profileSchema,
  initialValues: {
    username: userStore.user?.hoTen || '',
    email: userStore.user?.email || '',
  },
})

// Change password form
const passwordForm = useForm({
  validationSchema: toTypedSchema(changePasswordValidator),
})

// Profile form submit handler
const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
  try {
    isLoading.value = true
    let avatarLink = isAvatarRemoved.value ? '' : userStore.user?.anhDaiDien || ''
    if (fileImage.value) {
      const res = await uploadImage(fileImage.value)
      avatarLink = res.url
    }
    const updatedValues = {
      ...values,
      avatar: avatarLink || 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png',
    }
    await userStore.updateUser(userStore.user!.maNguoiDung, updatedValues)
    toast({
      title: 'Cập nhật thành công',
      description: 'Thông tin cá nhân đã được cập nhật.',
    })
    isEditing.value = false
    profileForm.resetForm()
    profileForm.setValues({
      username: updatedValues.username || '',
      email: updatedValues.email || '',
    })
  }
  finally {
    isLoading.value = false
  }
})

// Change password submit handler
const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
  try {
    isPasswordLoading.value = true
    await userStore.updatePassword(values)
    toast({
      title: 'Thành công',
      description: 'Đổi mật khẩu thành công',
    })
    await authStore.logout()
    router.push('/')
    passwordForm.resetForm()
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
    isPasswordLoading.value = false
  }
})

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    fileImage.value = target.files[0]
  }
  avatarPreview.value = URL.createObjectURL(fileImage.value as File)
  isAvatarRemoved.value = false
}
function removeAvatar() {
  avatarPreview.value = ''
  isAvatarRemoved.value = true
  fileImage.value = null
}
function startEdit() {
  isEditing.value = true
}
function cancelEdit() {
  isEditing.value = false
  profileForm.resetForm()
  avatarPreview.value = userStore.user?.anhDaiDien || ''
  isAvatarRemoved.value = false
  fileImage.value = null
}
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <div class="w-full flex justify-center">
      <div class="flex flex-col items-center w-11/12 md:w-3/4 lg:w-1/2">
        <h1 class="self-start text-2xl font-bold mt-4 mb-6">
          Tài khoản
        </h1>        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="password">
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          <!-- Profile Tab -->
          <TabsContent value="profile" class="mt-6">
            <form class="w-full" @submit="handleProfileSubmit">
              <div class="relative w-24 h-24 mb-4">
                <img
                  v-lazy="avatarPreview || 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png'"
                  alt="Avatar"
                  class="w-full h-full rounded-lg object-cover"
                >
                <div
                  v-if="isEditing"
                  class="absolute rounded-lg inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer "
                >
                  <label class="text-white text-sm font-medium cursor-pointer">
                    Tải lên
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleAvatarChange"
                    >
                  </label>
                </div>
              </div>

              <button
                v-if="isEditing && avatarPreview"
                type="button"
                class="text-red-500 text-sm mb-4"
                @click="removeAvatar"
              >
                Xóa ảnh đại diện
              </button>

              <InputValidator
                v-model="profileForm.values.username"
                type="text"
                label="Tên người dùng"
                name="username"
                :disabled="!isEditing"
                custom-class="mb-5 mt-1"
              />
              <InputValidator
                v-model="profileForm.values.email"
                type="text"
                label="Email"
                name="email"
                disabled
                custom-class="mb-5 mt-4"
              />

              <div class="flex justify-end mt-6">
                <div v-if="isEditing">
                  <Button
                    class="mr-2"
                    variant="outline"
                    @click="cancelEdit"
                  >
                    Hủy
                  </Button>
                  <Button type="submit" :disabled="isLoading">
                    <template v-if="isLoading">
                      <div class="flex w-full p-8 justify-center gap-2 items-center">
                        <Loader2 />
                        Vui lòng chờ...
                      </div>
                    </template>
                    <template v-else>
                      Lưu
                    </template>
                  </Button>
                </div>
                <div v-else>
                  <Button @click="startEdit">
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <!-- Change Password Tab -->
          <TabsContent value="password" class="mt-6">
            <Card>
              <CardHeader>
                <CardTitle class="text-2xl text-center">
                  Đổi mật khẩu
                </CardTitle>
                <CardDescription class="text-center">
                  Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="handlePasswordSubmit">
                  <div class="space-y-4">
                    <InputValidator
                      id="password"
                      label="Mật khẩu hiện tại"
                      placeholder="Nhập mật khẩu hiện tại"
                      type="password"
                      name="currentPassword"
                    />
                    <InputValidator
                      id="newPassword"
                      label="Mật khẩu mới"
                      placeholder="Nhập mật khẩu mới"
                      type="password"
                      name="newPassword"
                    />
                    <InputValidator
                      id="confirmNewPassword"
                      label="Xác nhận mật khẩu mới"
                      placeholder="Xác nhận mật khẩu mới"
                      type="password"
                      name="confirmNewPassword"
                    />
                    <div class="flex justify-end">
                      <Button type="submit" :disabled="isPasswordLoading">
                        <template v-if="isPasswordLoading">
                          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                          Vui lòng chờ
                        </template>
                        <template v-else>
                          Đổi mật khẩu
                        </template>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
