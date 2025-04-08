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
  <div class="flex items-center justify-end w-full h-full gap-2 p-2 lg:pr-8 bg-card">
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
