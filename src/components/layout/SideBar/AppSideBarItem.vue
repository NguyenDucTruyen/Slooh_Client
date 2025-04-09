<script setup>
import { useUserStore } from '@/stores/user'

const props = defineProps({
  icon: String,
  iconActive: String,
  title: String,
  type: {
    type: String,
    default: 'router-link',
  },
  url: {
    type: String,
    default: '/',
  },
  textStyle: {
    type: String,
    default: 'text-sm',
  },
})
const userStore = useUserStore()
const route = useRoute()
const isActive = computed(() => props.url === route.path)
const component = computed(() => {
  if (userStore.isAuthenticated)
    return props.type

  if (props.requiredAuthen)
    return 'button'
  else return 'RouterLink'
})
</script>

<template>
  <component
    :is="component"
    v-bind="props.type === 'router-link' ? { to: props.url } : {}"
    :class="isActive || props.type !== 'router-link' ? 'bg-primary text-primary-foreground bg-opacity-50' : ''"
    class="flex py-2 pl-4 gap-4 items-center cursor-pointer text-foreground hover:bg-accent hover:bg-opacity-10 hover:text-primary-foreground transition-colors duration-200 ease-in-out rounded-md"
  >
    <Icon v-show="!isActive" :name=" props.icon" class="w-6 h-6" />
    <Icon v-show="isActive" :name="props.iconActive ?? props.icon" class="w-6 h-6" />
    <span class="font-bold" :class="props.textStyle">{{ props.title }}</span>
  </component>
</template>
