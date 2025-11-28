<script setup lang="tsx" generic="T">
import type { DataTableColumns } from '../../index'
import type { ColumnSettingsPopupEmits, ColumnSettingsPopupProps } from './index'
import { cloneDeep } from 'es-toolkit'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<ColumnSettingsPopupProps<T>>()
const emit = defineEmits<ColumnSettingsPopupEmits<T>>()

const showDropdown = ref(false)
const localColumns = ref<DataTableColumns<T>>([])

// 使用 watch 监听 props.columns 的变化并深度克隆
watch(
  () => props.columns,
  (newColumns) => {
    localColumns.value = cloneDeep(newColumns)
  },
  { immediate: true, deep: true },
)

function toggleFixed(key: string | number, position: 'left' | 'right') {
  const col = localColumns.value.find(col => col.key === key)
  if (col) {
    if (col.fixed === position) {
      col.fixed = undefined
    }
    else {
      col.fixed = position
    }
  }
}

function resetColumnSettings() {
  emit('reset')
  showDropdown.value = false
}

function cancelColumnSettings() {
  localColumns.value = cloneDeep(props.columns)
  showDropdown.value = false
}

function confirmColumnSettings() {
  emit('confirm', cloneDeep(localColumns.value))
  showDropdown.value = false
}

// 暴露打开下拉框的方法
defineExpose({
  showDropdown,
})
</script>

<template>
  <n-popover v-model:show="showDropdown" placement="bottom" trigger="click">
    <template #trigger>
      <n-button text>
        <i class="i-lucide-settings text-16px" />
      </n-button>
    </template>

    <div>
      <span>排序/显示</span>
      <n-divider class="my-2!" />

      <!-- 列列表 -->
      <VueDraggable v-model="localColumns" :animation="200" handle=".drag-handle">
        <div
          v-for="col in localColumns"
          :key="col.key"
          class="group p-1 rounded flex transition-colors items-center justify-between hover:bg-neutral-100"
        >
          <div class="flex items-center">
            <div class="drag-handle text-neutral-400 mr-8px flex cursor-move items-center">
              <div class="i-lucide-grip-vertical text-16px" />
            </div>
            <n-checkbox v-model:checked="col.visible">{{ col.title }}</n-checkbox>
          </div>

          <div>
            <div class="ml-8px flex gap-4px items-center">
              <button class="pin-btn" :class="col.fixed === 'left' ? 'text-green-500!' : ''" @click="() => toggleFixed(col.key, 'left')">
                <div class="i-lucide-pin text-14px" />
              </button>
              <button class="pin-btn" :class="col.fixed === 'right' ? 'text-green-500!' : ''" @click="() => toggleFixed(col.key, 'right')">
                <div class="i-lucide-pin text-14px rotate-270deg" />
              </button>
            </div>
          </div>
        </div>
      </VueDraggable>

      <n-divider class="my-2!" />

      <div class="p-1 flex items-center justify-between">
        <n-button text size="small" @click="resetColumnSettings">重置</n-button>
        <div class="flex gap-4">
          <n-button text size="small" @click="cancelColumnSettings">取消</n-button>
          <n-button text size="small" type="primary" @click="confirmColumnSettings">确定</n-button>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.pin-btn {
  @apply 'p-4px rounded cursor-pointer transition-colors hover:bg-neutral-200 text-neutral-400';
}
</style>
