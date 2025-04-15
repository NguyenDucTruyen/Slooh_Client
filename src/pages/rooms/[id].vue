<route>
    {
        meta: {
            layout: "empty",
            title: "Chỉnh sửa",
        }
    }
</route>

<script setup lang="ts">
</script>

<template>
  <div class="room-layout">
    <EditNavBar class="navbar" />
    <div class="body">
      <div class="slide-navigator">
        <SlideNavigator />
      </div>
      <div class="main-content">
        <div class="content-area" />
        <div class="panel-area" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-layout {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
  "navbar"
  "body";
  }

  .navbar {
    grid-area: navbar;
  }
  .body {
    @apply flex;
    grid-area: body;
    height: calc(100vh - 80px);
  }
  .slide-navigator {
    @apply bg-card shadow-lg h-full overflow-y-auto w-[200px] relative;
  }
  .main-content {
    @apply bg-card shadow-lg h-full w-[calc(100%-200px)] relative;
  }
  .content-area{
    @apply bg-card h-full w-[calc(100%-260px)];
    background-image: url("@/assets/images/theme-standard.webp");
    background-size: cover;
    overflow-y: auto;
  }
  .panel-area {
    @apply bg-card h-full w-[260px] absolute right-0 top-0;
  }
</style>
