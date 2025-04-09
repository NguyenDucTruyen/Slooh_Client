<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'
import { useThemeStore } from '@/stores/theme'

const confirmStore = useConfirmStore()

useThemeStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide">
      <ErrorBoundary>
        <component :is="Component" />
      </ErrorBoundary>
    </transition>
  </router-view>
  <Toaster />
  <ConfirmationModal
    v-if="confirmStore.visible"
    :title="confirmStore.title"
    :message="confirmStore.message"
    @confirm="confirmStore.confirm"
    @cancel="confirmStore.cancel"
  />
</template>
