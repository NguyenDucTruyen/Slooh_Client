<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col min-h-0 max-w-full h-full">
    <div class="flex items-center justify-between bg-card rounded-lg shadow-lg py-2 px-6 gap-4">
      <div class="hidden sm:flex flex-col items-center justify-center">
        <h1 class="text-xl text-center font-bold mb-1">
          {{ title }}
        </h1>
        <p class="text-base text-center text-foreground">
          {{ description }}
        </p>
      </div>
      <slot name="header-actions" />
    </div>

    <div class="mt-4 py-2 px-6 bg-card rounded-lg shadow-lg flex-1">
      <slot />
    </div>
  </div>
</template>
