<script setup>
</script>

<template>
  <div class="flex flex-col h-full justify-between">
    <header class="flex h-16 items-center">
      <AppHeader />
    </header>
    <main class="h-[calc(100%-4rem)] flex flex-col lg:flex-row gap-4 lg:gap-0 lg:overflow-hidden">
      <AppSideBar class="max-lg:hidden" />
      <div class="flex flex-col h-full w-full lg:[width:calc(100%-15rem)]">
        <ScrollArea class="flex flex-1 flex-col gap-4 p-4 bg-muted rounded-lg">
          <router-view />
        </ScrollArea>
      </div>

    </main>
  </div>
</template>
