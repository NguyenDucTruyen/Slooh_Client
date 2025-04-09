<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center h-screen bg-card p-4">
    <div class="mx-2 flex items-center justify-between w-full bg-card rounded-lg shadow-lg p-6 gap-4">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl text-center font-bold mb-1">
          Kênh của tôi
        </h1>
        <p class="text-lg text-center text-foreground">
          Chào mừng bạn đến với kênh của tôi!
        </p>
      </div>
      <Button type="button" xl>
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tạo kênh mới</span>
        </Button>
    </div>
  </div>
</template>
