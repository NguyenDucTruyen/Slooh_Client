<script setup lang="ts">
interface Feature {
  title: string
  description: string
  icon: string
}

const router = useRouter()
const isLoading = ref(true)
const heroImage = ref<HTMLImageElement | null>(null)

onMounted(() => {
  // Simulate loading time and then hide skeleton
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const features = ref<Feature[]>([
  {
    title: 'Join Channels',
    description: 'Connect with others in topic-focused channels and grow your community',
    icon: 'IconChannel',
  },
  {
    title: 'Public Rooms',
    description: 'Explore and participate in public discussions in real-time',
    icon: 'IconPublic',
  },
  {
    title: 'Group Chats',
    description: 'Create private groups for seamless team collaboration',
    icon: 'IconGroup',
  },
])
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- Hero Section with Animated Background -->
    <section class="relative overflow-hidden bg-gradient-to-b from-background via-background/90 to-background/50 py-16 md:py-32">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="animate-float absolute -top-4 -right-4 w-72 h-72 bg-primary/40 rounded-full blur-3xl" />
        <div class="animate-float-delayed absolute -bottom-8 -left-8 w-96 h-96 bg-secondary/40 rounded-full blur-3xl" />
      </div>

      <div class="container relative mx-auto px-4">
        <div class="flex flex-col items-center text-center gap-8 md:gap-12">
          <!-- Logo with Skeleton and Fade -->
          <div class="w-64 h-24 relative transition-all duration-700 ease-out transform" :class="isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'">
            <Skeleton v-if="isLoading" class="w-full h-full animate-pulse" />
            <img
              v-else
              ref="heroImage"
              src="@/assets/images/Logo_Slooh_Horizontal.png"
              alt="Slooh Logo"
              class="w-full h-full object-contain drop-shadow-lg"
            >
          </div>

          <!-- Hero Text with Slide-up Animation -->
          <div class="space-y-6 max-w-4xl transition-all duration-700 ease-out transform" :class="isLoading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'">
            <h1 class="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-slate-500 to-primary bg-clip-text text-transparent">
              Welcome to Slooh
            </h1>

            <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect, collaborate, and communicate in real-time with your team and community
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" class="text-lg px-8 py-6 transform hover:scale-105 transition-transform" @click="router.push('/auth/login')">
                Get Started
              </Button>
              <Button size="lg" variant="outline" class="text-lg px-8 py-6 backdrop-blur transform hover:scale-105 transition-transform" @click="router.push('/PublicRoom')">
                Explore Public Rooms
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with Staggered Animation -->
    <section class="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 transition-all duration-700 ease-out transform" :class="isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
          Why Choose Slooh?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            :class="isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <div v-if="isLoading" class="space-y-4">
              <Skeleton class="w-16 h-16 rounded-lg" />
              <Skeleton class="w-3/4 h-8" />
              <Skeleton class="w-full h-20" />
            </div>
            <template v-else>
              <div class="rounded-lg p-4 bg-primary/10 inline-block transform group-hover:scale-110 transition-transform">
                <component
                  :is="feature.icon"
                  class="w-12 h-12 text-primary"
                />
              </div>
              <h3 class="text-2xl font-semibold mt-6 group-hover:text-primary transition-colors">
                {{ feature.title }}
              </h3>
              <p class="mt-4 text-muted-foreground text-lg leading-relaxed">
                {{ feature.description }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(20px) scale(1.1);
    opacity: 0.7;
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: -4s;
}
</style>
