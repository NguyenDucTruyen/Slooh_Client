import type { EmailData, LoginData, RegisterData, ResetPasswordData } from '@/utils/types'
import { apiLogin, apiLogout, apiRegister, forgotPassword, requestResetPassword } from '@/api/auth'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const router = useRouter()
  const returnUrl = ref('')

  async function login(credentials: LoginData) {
    const data = await apiLogin(credentials)

    localStorage.setItem('accesstoken', data.tokens.access.token)
    localStorage.setItem('refreshtoken', data.tokens.refresh.token)

    await userStore.getUserData()
    router.push(returnUrl.value || '/')
  }

  function logout() {
    apiLogout(localStorage.getItem('refreshtoken') || '')
    
    localStorage.removeItem('accesstoken')
    localStorage.removeItem('refreshtoken')
    
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
