<script setup lang="tsx">
import { useMagicKeys } from '@vueuse/core'
import {
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
  ComboboxViewport,
  DialogContent,
  DialogRoot,
  DialogTrigger
} from 'reka-ui'

interface SearchResult {
  label: string
  path: string
  icon?: string
  fullPath?: string
}

const menuStore = useMenuStore()
const router = useRouter()
const dialogOpen = ref(false)
const searchQuery = ref('')
const selectedValue = ref<SearchResult | null>(null)

// 使用 useMagicKeys 管理快捷键
const keys = useMagicKeys()
const cmdK = keys['meta+k']
const ctrlK = keys['ctrl+k']

// 获取所有菜单项（过滤掉目录，只保留叶子页面）
const allMenuItems = computed(() => {
  const allOptions = menuStore.allFlatRouteTreeOptions
  const allPaths = allOptions.map(item => item.path)

  return allOptions
    .filter((item) => {
      // 检查是否有其他路径以该路径为父路径
      // 如果有，说明这个是目录，需要被过滤掉
      const hasChildren = allPaths.some(path =>
        path !== item.path && path.startsWith(`${item.path}/`) && item.meta?.layout !== 'tabs'
      )
      return !hasChildren
    })
    .map(({ label, path }) => ({
      label,
      path,
      fullPath: path,
    }))
})

// 过滤搜索结果
const filteredResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return query
    ? allMenuItems.value.filter(item =>
        item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query)
      )
    : []
})

// 监听快捷键和对话框状态
watch([cmdK, ctrlK], ([cmd, ctrl]) => {
  if (cmd || ctrl) dialogOpen.value = true
})

watch(dialogOpen, (newVal) => {
  if (!newVal) {
    searchQuery.value = ''
    selectedValue.value = null
  }
})

// 处理值变化 - 自动导航
function handleValueChange(value: SearchResult | null) {
  if (value) {
    router.push(value.path)
    dialogOpen.value = false
  }
}

// 检测是否为 Mac
const isMac = computed(() => typeof window !== 'undefined' && /Mac/i.test(navigator.userAgent))

// 检测是否为 Windows
const isWindows = computed(() => typeof window !== 'undefined' && /Win/i.test(navigator.userAgent))

// 在 keydown 时阻止浏览器默认行为（例如 Windows 上的 Ctrl+K 聚焦地址栏）
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    const key = (e.key || '').toLowerCase()
    if (key !== 'k') return

    // 如果按下的是 Meta+K（mac）或 Ctrl+K（其他平台/Windows），阻止默认行为
    if (isMac.value && e.metaKey) {
      e.preventDefault()
    }
    else if (isWindows.value && e.ctrlKey) {
      e.preventDefault()
    }
    else if (!isMac.value && !isWindows.value && e.ctrlKey) {
      e.preventDefault()
    }
  }

  window.addEventListener('keydown', handler)
  onBeforeUnmount(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <!-- Dialog 包装器用于显示整个菜单搜索 -->
  <DialogRoot v-model:open="dialogOpen">
    <!-- Dialog 触发器 - 快捷键提示按钮 -->
    <DialogTrigger as-child>
      <button
        type="button"
        aria-label="打开菜单搜索"
        class="flex items-center gap-2 border-1 border-gray-200 rounded-lg bg-white px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:shadow-md"
      >
        <span>搜索菜单</span>
        <div class="flex gap-1">
          <kbd class="menu-search-kbd">
            <div v-if="isMac" class="i-lucide-command h-3 w-3" />
            <div v-else>CTRL<div /></div></kbd>
          <kbd class="menu-search-kbd">K</kbd>
        </div>
      </button>
    </DialogTrigger>

    <!-- 蒙版背景，带高斯模糊 -->
    <Teleport v-if="dialogOpen" to="body">
      <div class="fixed inset-0 z-11 bg-black/40 backdrop-blur-sm" />
    </Teleport>

    <!-- Dialog 内容 -->
    <DialogContent
      class="fixed left-1/2 top-1/2 z-99999 max-w-2xl w-full rounded-xl bg-white p-0 shadow-2xl -translate-x-1/2 -translate-y-1/2"
    >
      <!-- Dialog 标题（可访问性） -->
      <div class="sr-only">菜单搜索</div>

      <!-- 使用 Reka UI Combobox -->
      <ComboboxRoot
        v-model="selectedValue"
        :open="dialogOpen && filteredResults.length > 0"
        :open-on-focus="true"
        :ignore-filter="true"
        @update:model-value="handleValueChange"
      >
        <ComboboxAnchor class="w-full">
          <!-- 搜索输入框 -->
          <div class="flex items-center gap-2 border-b-1 border-gray-200 p-3">
            <ComboboxInput
              v-model="searchQuery"
              placeholder="搜索菜单..."
              class="flex-1 bg-transparent text-sm outline-none"
              aria-label="搜索菜单"
            />
            <ComboboxCancel
              v-if="searchQuery"
              class="rounded p-1 transition-colors hover:bg-gray-100"
              aria-label="清除搜索"
            >
              <div class="i-lucide-x h-4 w-4" />
            </ComboboxCancel>
          </div>
        </ComboboxAnchor>

        <!-- Combobox 下拉菜单 -->
        <ComboboxContent class="z-50 max-h-96 overflow-hidden bg-white">
          <!-- 结果列表视口 -->
          <ComboboxViewport class="max-h-96 overflow-y-auto p-2">
            <!-- 有搜索结果时显示列表 -->
            <template v-if="filteredResults.length > 0">
              <ComboboxItem
                v-for="item in filteredResults"
                :key="item.path"
                :value="item"
                class="flex cursor-pointer items-center gap-3 rounded-sm px-4 py-1 transition-colors"
              >
                <!-- 内容 -->
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm text-gray-900 font-medium">
                    {{ item.label }}
                  </div>
                  <div class="truncate text-xs text-gray-500">
                    {{ item.path }}
                  </div>
                </div>

                <!-- 快捷键提示和选中指示器 -->
                <div class="flex flex-shrink-0 items-center gap-2">
                  <kbd class="flex items-center justify-center border-1 border-gray-300 rounded bg-gray-100 p-0.5">
                    <div class="i-lucide-corner-down-left h-3 w-3" />
                  </kbd>
                </div>
              </ComboboxItem>
            </template>

            <!-- 无结果提示 -->
            <ComboboxEmpty class="py-12 text-center text-sm text-gray-500">
              未找到相关菜单
            </ComboboxEmpty>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>

      <!-- 底部快捷键提示 -->
      <div class="border-t-1 border-gray-200 rounded-b-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <kbd class="menu-search-kbd h-5 w-5">
              <div class="i-lucide-arrow-up h-3 w-3" />
            </kbd>
            <kbd class="menu-search-kbd h-5 w-5">
              <div class="i-lucide-arrow-down h-3 w-3" />
            </kbd>
            <span>导航</span>
          </div>
          <div class="flex items-center gap-2">
            <kbd class="menu-search-kbd h-5 w-6">
              <div class="i-lucide-corner-down-left h-3 w-3" />
            </kbd>
            <span>选择</span>
          </div>
          <div class="flex items-center gap-2">
            <kbd class="menu-search-kbd px-1">
              ESC
            </kbd>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

<style scoped>
.menu-search-kbd {
  @apply border-1 border-gray-300 rounded bg-gray-100 inline-flex items-center justify-center px-1;
}

:deep([data-highlighted]) {
  @apply bg-gray-100;
}
</style>
