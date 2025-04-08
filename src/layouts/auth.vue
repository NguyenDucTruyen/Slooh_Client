<template>
  <div class="grid lg:grid-cols-2 grid-cols-1 h-full">
    <div class="flex justify-center items-center">
      <RouterView />
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="@/assets/images/Logo_Slooh_Vertical.png"
        alt="Image"
        class="h-full w-full dark:brightness-[0.2] dark:grayscale object-contain"
      >
    </div>
  </div>
</template>
