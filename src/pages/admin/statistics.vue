<route>
  {
      meta: {
      layout: "admin",
      title: "Admin - Thống kê người dùng",
      }
  }
  </route>

<script setup lang="ts">
import type { NguoiDung } from '@/types'
import { useAdminStore } from '@/stores/admin'
import { useAsyncState } from '@vueuse/core'
import { BarChart3, Calendar, TrendingUp, Users } from 'lucide-vue-next'

interface PaginatedUsersResponse {
  users: NguoiDung[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface StatCard {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
}

const router = useRouter()
const adminStore = useAdminStore()
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
const selectedYear = ref(new Date().getFullYear())
// Remove unused variable
// const selectedMetric = ref('registrations')

const metaData = ref({
  total: 0,
  page: 1,
  limit: 1000,
  totalPages: 0,
})

const { isLoading: _isLoading, state: users } = useAsyncState<NguoiDung[]>(
  async () => {
    const response = await adminStore.getAllUser({
      page: 1,
      limit: 1000,
    }) as PaginatedUsersResponse
    metaData.value = {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
    return response.users
  },
  [],
  { immediate: true },
)

// Calculate statistics
const statistics = computed(() => {
  if (!users.value?.length)
    return null

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  // Total users
  const totalUsers = users.value.length

  // Users this year
  const thisYearUsers = users.value.filter(user =>
    new Date(user.ngayTao).getFullYear() === currentYear,
  ).length // Users this month
  const thisMonthUsers = users.value.filter((user) => {
    const userDate = new Date(user.ngayTao)
    return userDate.getFullYear() === currentYear && userDate.getMonth() === currentMonth
  }).length

  // Users last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const lastMonthUsers = users.value.filter((user) => {
    const userDate = new Date(user.ngayTao)
    return userDate.getFullYear() === lastMonthYear && userDate.getMonth() === lastMonth
  }).length

  // Growth percentage
  const monthlyGrowth = lastMonthUsers > 0
    ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
    : '100'

  return {
    totalUsers,
    thisYearUsers,
    thisMonthUsers,
    lastMonthUsers,
    monthlyGrowth: Number(monthlyGrowth),
  }
})

// Statistics cards data
const statCards = computed((): StatCard[] => {
  if (!statistics.value)
    return []

  return [
    {
      title: 'Tổng người dùng',
      value: statistics.value.totalUsers.toLocaleString(),
      change: `${statistics.value.thisYearUsers} trong năm nay`,
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Đăng ký tháng này',
      value: statistics.value.thisMonthUsers,
      change: `${statistics.value.monthlyGrowth > 0 ? '+' : ''}${statistics.value.monthlyGrowth}%`,
      trend: statistics.value.monthlyGrowth > 0 ? 'up' : statistics.value.monthlyGrowth < 0 ? 'down' : 'neutral',
      icon: TrendingUp,
    },
    {
      title: 'Đăng ký tháng trước',
      value: statistics.value.lastMonthUsers,
      change: 'So với tháng này',
      trend: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Tăng trưởng',
      value: `${statistics.value.monthlyGrowth > 0 ? '+' : ''}${statistics.value.monthlyGrowth}%`,
      change: 'So với tháng trước',
      trend: statistics.value.monthlyGrowth > 0 ? 'up' : statistics.value.monthlyGrowth < 0 ? 'down' : 'neutral',
      icon: BarChart3,
    },
  ]
})

function processData(year: number) {
  if (!users || !users.value.length) {
    return Array.from({ length: 12 }, () => 0)
  }
  const data = Array.from({ length: 12 }, () => 0)
  users.value.forEach((user) => {
    const createdAt = new Date(user.ngayTao)
    const month = createdAt.getMonth()
    const userYear = createdAt.getFullYear()
    if (userYear === year) {
      (data[month] as number) += 1
    }
  })
  return data
}

// Computed chart data that updates when users or selectedYear changes
const chartData = computed(() => {
  if (!users.value || users.value.length === 0) {
    return Array.from({ length: 12 }, () => 0)
  }
  const data = processData(selectedYear.value)
  return data
})

// Check if chart has data to display
const hasChartData = computed(() => {
  return chartData.value.some(value => value > 0)
})

const series = ref([
  {
    name: 'Số lượng đăng ký',
    data: [] as number[],
  },
])

// Watch chartData and update series
watch(chartData, (newData) => {
  series.value[0].data = newData
}, { immediate: true })

const chartOptions = ref({
  chart: {
    background: 'transparent',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
  },
  xaxis: {
    categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    style: {
      fontSize: '14px',
    },
    y: {
      formatter: (value: number) => `${value} người dùng`,
    },
  },
  theme: {
    mode: isDarkMode.value ? 'dark' : 'light',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      endingShape: 'rounded',
      borderRadius: 4,
    },
  },
  fill: {
    colors: ['#3b82f6'],
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#1d4ed8'],
      stops: [0, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
    strokeDashArray: 3,
  },
})

// Available years for selection
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

watch(isDarkMode, (newValue) => {
  chartOptions.value = {
    ...chartOptions.value,
    theme: {
      mode: newValue ? 'dark' : 'light',
    },
    grid: {
      ...chartOptions.value.grid,
      borderColor: newValue ? '#374151' : '#e5e7eb',
    },
  }
})

function navigateToDetailedStats(type: string) {
  router.push(`/admin/statistics/${type}`)
}
</script>

<template>
  <div class="min-h-full bg-background">
    <!-- Header Section -->
    <div class="border-b bg-card">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-foreground">
              Thống kê hệ thống
            </h1>
            <p class="text-sm text-muted-foreground mt-1">
              Tổng quan về người dùng và hoạt động hệ thống
            </p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Year Selector -->
            <Select v-model="selectedYear">
              <SelectTrigger class="w-32">
                <SelectValue :placeholder="String(selectedYear)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="year in availableYears"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- Additional Statistics Button -->
            <Button variant="outline" @click="navigateToDetailedStats('detailed')">
              <BarChart3 class="w-4 h-4 mr-2" />
              Thống kê chi tiết
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6 space-y-6 bg-background">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="(stat, index) in statCards"
          :key="index"
          class="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">
              {{ stat.title }}
            </CardTitle>
            <component
              :is="stat.icon"
              class="h-4 w-4"
              :class="{
                'text-green-600': stat.trend === 'up',
                'text-red-600': stat.trend === 'down',
                'text-blue-600': stat.trend === 'neutral',
              }"
            />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ stat.value }}
            </div>
            <p
              class="text-xs mt-1"
              :class="{
                'text-green-600': stat.trend === 'up',
                'text-red-600': stat.trend === 'down',
                'text-muted-foreground': stat.trend === 'neutral',
              }"
            >
              {{ stat.change }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Chart Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Chart -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Số lượng đăng ký theo tháng</CardTitle>
                <CardDescription>
                  Thống kê người dùng đăng ký trong năm {{ selectedYear }}
                </CardDescription>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 bg-blue-500 rounded-full" />
                  <span class="text-sm text-muted-foreground">Đăng ký</span>
                </div>
              </div>
            </div>
          </CardHeader>          <CardContent>
            <div class="h-[400px] relative">
              <div v-if="!users || users.length === 0" class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="animate-pulse">
                    <BarChart3 class="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
              <div v-else-if="!hasChartData" class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <BarChart3 class="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p class="text-sm text-muted-foreground">
                    Không có dữ liệu cho năm {{ selectedYear }}
                  </p>
                </div>
              </div>              <apexchart
                v-else
                :key="`chart-${selectedYear}-${users?.length || 0}`"
                type="bar"
                height="100%"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Quick Stats Panel -->
        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
            <CardDescription>
              Các chỉ số quan trọng
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Total Growth -->
            <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p class="text-sm font-medium">
                  Tăng trưởng tổng
                </p>
                <p class="text-xs text-muted-foreground">
                  So với tháng trước
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">
                  +{{ statistics?.monthlyGrowth || 0 }}%
                </p>
              </div>
            </div>

            <!-- Average per month -->
            <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p class="text-sm font-medium">
                  Trung bình/tháng
                </p>
                <p class="text-xs text-muted-foreground">
                  Năm {{ selectedYear }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">
                  {{ Math.round((statistics?.thisYearUsers || 0) / 12) }}
                </p>
              </div>
            </div>

            <!-- Peak month -->
            <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p class="text-sm font-medium">
                  Tháng cao nhất
                </p>
                <p class="text-xs text-muted-foreground">
                  Trong năm
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-purple-600">
                  {{ Math.max(...(series[0]?.data || [0])) }}
                </p>
              </div>
            </div>

            <!-- Quick Actions -->
            <Separator class="my-4" />
            <div class="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                @click="navigateToDetailedStats('age')"
              >
                <Users class="w-4 h-4 mr-2" />
                Thống kê theo tuổi
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                @click="navigateToDetailedStats('gender')"
              >
                <BarChart3 class="w-4 h-4 mr-2" />
                Thống kê giới tính
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                @click="navigateToDetailedStats('activity')"
              >
                <TrendingUp class="w-4 h-4 mr-2" />
                Hoạt động người dùng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Additional Insights -->
      <Card>
        <CardHeader>
          <CardTitle>Insights & Phân tích</CardTitle>
          <CardDescription>
            Những nhận xét và xu hướng đáng chú ý
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div class="flex items-center space-x-2 mb-2">
                <TrendingUp class="w-5 h-5 text-blue-600" />
                <h4 class="font-medium text-blue-900 dark:text-blue-100">
                  Xu hướng tăng trưởng
                </h4>
              </div>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                {{ statistics?.monthlyGrowth && statistics.monthlyGrowth > 0
                  ? `Hệ thống đang có xu hướng tăng trưởng tích cực với ${statistics.monthlyGrowth}% so với tháng trước.`
                  : 'Tăng trưởng đang chậm lại, cần có chiến lược thu hút người dùng mới.'
                }}
              </p>
            </div>

            <div class="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div class="flex items-center space-x-2 mb-2">
                <Users class="w-5 h-5 text-green-600" />
                <h4 class="font-medium text-green-900 dark:text-green-100">
                  Quy mô người dùng
                </h4>
              </div>
              <p class="text-sm text-green-800 dark:text-green-200">
                Với {{ statistics?.totalUsers }} người dùng, hệ thống đang ở giai đoạn
                {{ (statistics?.totalUsers || 0) > 1000 ? 'phát triển mạnh' : 'khởi đầu tốt' }}.
              </p>
            </div>

            <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div class="flex items-center space-x-2 mb-2">
                <Calendar class="w-5 h-5 text-purple-600" />
                <h4 class="font-medium text-purple-900 dark:text-purple-100">
                  Hoạt động gần đây
                </h4>
              </div>
              <p class="text-sm text-purple-800 dark:text-purple-200">
                Tháng này có {{ statistics?.thisMonthUsers }} người dùng mới,
                {{ (statistics?.thisMonthUsers || 0) > (statistics?.lastMonthUsers || 0)
                  ? 'cao hơn' : 'thấp hơn'
                }} so với tháng trước.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
