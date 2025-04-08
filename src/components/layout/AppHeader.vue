<script setup>
import UserDropdown from '@/components/common/UserDropdown.vue'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const inputSearch = useTemplateRef('input-search')

onMounted(() => {
  if (route.query.q) {
    searchValue.value = route.query.q
  }
  if (Object.keys(route.query).includes('q'))
    inputSearch.value.focus()
})
</script>

<template>
  <div class="flex items-center justify-between w-full h-full gap-2 p-2 lg:pr-8 bg-card">
    <div class="flex gap-2 pl-6 cursor-pointer" @click="$router.push('/home')">
      <img src="@/assets/images/Logo_Slooh.png" alt="" class="h-12">
    </div>
    <div class="flex">
      <UserDropdown v-if="userStore?.user" />
      <template v-else>
        <router-link to="/auth/register">
          <Button class="rounded-full px-6" variant="ghost">
            Sign up
          </Button>
        </router-link>
        <router-link to="/auth/login">
          <Button class="rounded-full px-6 bg-foreground">
            Log in
          </Button>
        </router-link>
      </template>
    </div>
  </div>
</template>
