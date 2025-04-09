<script setup>
import UserDropdown from '@/components/common/UserDropdown.vue'
import Button from '@/components/ui/button/Button.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useUserStore } from '@/stores/user'

const sidebarStore = useSidebarStore()
function toggleSidebar() {
  sidebarStore.toggle()
}
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
  <div class="flex items-center justify-between w-full h-full gap-2 p-2 lg:pr-8 bg-card shadow-lg">
    <div class="flex gap-4">
      <div class="gap-2 pl-6 cursor-pointer hidden lg:flex" @click="$router.push('/')">
        <img src="@/assets/images/Logo_Slooh_Horizontal.png" alt="" class="h-12">
      </div>
      <div class="gap-2 pl-1 cursor-pointer hidden max-lg:flex" @click="$router.push('/')">
        <img src="@/assets/images/Logo_Slooh.png" alt="" class="h-12">
      </div>
      <div class="lg:hidden flex items-center mr-4">
        <button
          class="flex items-center justify-center w-10 h-10 rounded-lg transition duration-200 ease-in-out"
          :class="sidebarStore.isOpen ? 'bg-muted border border-border' : ''"
          @click="toggleSidebar()"
        >
          <Icon
            name="IconMenu" class="w-6 h-6 text-foreground"
            :class="sidebarStore.isOpen ? ' text-secondary-foreground' : ''"
          >
            <title>Menu</title>
          </Icon>
        </button>
      </div>
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
