<template>
  <div class="flex lg:flex-row flex-col-reverse justify-end h-full">
    <div class="flex justify-center items-center lg:w-1/2  w-full">
      <RouterView />
    </div>
    <div class="lg:bg-muted flex justify-center lg:w-1/2 ">
      <img
        src="@/assets/images/Logo_Slooh_Vertical.png"
        alt="Image"
        class="lg:h-full h-40 lg:w-full dark:brightness-[0.2] dark:grayscale object-contain"
      >
    </div>
  </div>
</template>
