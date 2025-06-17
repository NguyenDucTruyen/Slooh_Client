import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { Quyen } from '@/types'

export async function middlewareLayout(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const isAuthenticated = userStore.isAuthenticated
  const layout = to.meta.layout as string

  if (isAuthenticated && layout === 'auth') {
    if (authStore.returnUrl) {
      const returnUrl = authStore.returnUrl
      authStore.clearReturnUrl()
      return next(returnUrl)
    }
    return next('/')
  }

  if (isAuthenticated && !layout && userStore.user?.quyen === Quyen.ADMIN) {
    return next('/admin')
  }

  if (!isAuthenticated && !['error', 'auth'].includes(layout)) {
    authStore.clearUserData()
  }

  if (!isAuthenticated && to.meta.authorized) {
    console.warn('Unauthorized access attempt to:', to.fullPath)
    next('/')
  }

  return next()
}
