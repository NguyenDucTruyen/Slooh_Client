<template>
  <div class="default-layout">
    <AppHeader class="navbar" />
    <AppSideBar class="sidebar" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  height: 100vh;
  display: grid;
  gap: 8px;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
  "navbar navbar"
  "sidebar main-content";
  }

  .navbar {
    grid-area: navbar;
  }

  .sidebar {
    grid-area: sidebar;
  }

  .main-content {
    @apply bg-card rounded-lg shadow-lg;
    grid-area: main-content;
    overflow-y: auto;
    height: calc(100vh - 80px);
    padding: 1rem;
  }

  @media screen and (max-width: 1024px) {
    .default-layout {
      grid-template-columns: 1fr;
      grid-template-areas:
        "navbar"
        "main-content";
    }
  }
</style>
