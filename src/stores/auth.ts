import type { EmailData, LoginData, RegisterData, ResetPasswordData } from '@/types'
import { apiLogin, apiLogout, apiRegister, forgotPassword, requestResetPassword } from '@/api/auth'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const router = useRouter()
  const returnUrl = ref('')

  async function login(credentials: LoginData) {
    const data = await apiLogin(credentials)

    localStorage.setItem('Slooh_AccessToken', data.tokens.access.token)
    localStorage.setItem('Slooh_RefreshToken', data.tokens.refresh.token)

    await userStore.getUserData()
    router.push(returnUrl.value || '/')
  }

  function logout() {
    apiLogout(localStorage.getItem('Slooh_RefreshToken') || '')

    localStorage.removeItem('Slooh_AccessToken')
    localStorage.removeItem('Slooh_RefreshToken')

    userStore.removeUser()
    router.push('/auth/login')
  }

  function register(credentials: RegisterData) {
    return apiRegister(credentials)
  }

  function setReturnUrl(url: string) {
    returnUrl.value = url
  }

  function sendEmailResetPassword(data: EmailData) {
    return forgotPassword(data)
  }
  function resetPassword(data: ResetPasswordData) {
    return requestResetPassword(data)
  }
  return {
    login,
    logout,
    register,
    returnUrl,
    setReturnUrl,
    resetPassword,
    sendEmailResetPassword,
  }
})
