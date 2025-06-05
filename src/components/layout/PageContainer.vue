<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col min-h-0 max-w-full h-full">
    <div class="mx-2 flex items-center justify-between bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="hidden sm:flex flex-col items-center justify-center">
        <h1 class="text-2xl text-center font-bold mb-1">
          {{ title }}
        </h1>
        <p class="text-lg text-center text-foreground">
          {{ description }}
        </p>
      </div>
      <slot name="header-actions" />
    </div>

    <div class="mt-6 p-6 bg-card rounded-lg shadow-lg flex-1">
      <slot />
    </div>
  </div>
</template>
