<script setup lang="ts">
import type { QueryFormProps } from './index'
import { NCard } from 'naive-ui'
import { BREAKPOINTS } from '~/constants'

const {
  items = [],
  gridCols = '2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1',
  defaultCollapsed = true,
  collapsedRows = 2,
  search,
  reset,
  as = NCard
} = defineProps<QueryFormProps>()

const [Form, form, formRef] = useForm<any>()

const isCollapsed = ref(defaultCollapsed)
const currentColumns = useBreakpointsCols(gridCols)
const limit = computed(() => Math.max(0, currentColumns.value * collapsedRows - 1))
const showCollapseButton = computed(() => items.length > limit.value)
const visibleItems = computed(() => (showCollapseButton.value && isCollapsed.value) ? items.slice(0, limit.value) : items)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

const [isSearchLoading, executeSearch] = useLoading(async () => {
  return await search?.(form.value)
})

const [isResetLoading, executeReset] = useLoading(async () => {
  formRef.value?.reset()
  return await reset?.()
})

function useBreakpointsCols(columns: number | string | undefined) {
  const breakpoints = useBreakpoints(BREAKPOINTS)
  const config = typeof columns === 'string' ? parseGridColumns(columns) : {}

  return computed(() => {
    if (typeof columns === 'number')
      return columns

    if (!columns)
      return 3

    const active = breakpoints.active().value
    const keys = Object.keys(BREAKPOINTS)

    // 查找当前有效的最大断点配置（从当前断点向下查找）
    const match = keys
      .slice(0, keys.indexOf(active) + 1)
      .reverse()
      .find(key => config[key] != null)

    return match ? config[match] : (config.default ?? 1)
  })
}

function parseGridColumns(classStr: string): Record<string, number> {
  const config: Record<string, number> = {}
  // 匹配 (断点:)?grid-cols-(数字)
  const regex = /(?:([a-z0-9]+):)?grid-cols-(\d+)/g

  for (const match of classStr.matchAll(regex)) {
    config[match[1] || 'default'] = Number.parseInt(match[2], 10)
  }

  return config
}

defineExpose({
  form,
  formRef,
})
</script>

<template>
  <component :is="as">
    <Form.Root label-placement="left" label-width="auto">
      <div class="gap-x-2 grid" :class="typeof gridCols === 'string' ? gridCols : ''">
        <template v-for="item in visibleItems" :key="item.field">
          <Form.Item v-bind="item" />
        </template>
        <div class="flex gap-x-3 items-start justify-end" :style="{ gridColumnStart: currentColumns }">
          <div v-if="showCollapseButton" class="ml-2 mt-2 flex gap-1 cursor-pointer items-center" @click="toggleCollapse">
            {{ isCollapsed ? '展开' : '收起' }}
            <div :class="isCollapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'" />
          </div>
          <NButton :loading="isResetLoading || isSearchLoading" class="w-80px" @click="executeReset">重置</NButton>
          <NButton type="primary" :loading="isSearchLoading || isResetLoading" class="w-80px" @click="executeSearch">查询</NButton>
        </div>
      </div>
    </Form.Root>
  </component>
</template>
