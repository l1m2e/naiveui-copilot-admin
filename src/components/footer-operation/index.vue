<script lang="ts" setup>
import type { FooterOperationEmits, FooterOperationProps } from './index'
import { storeToRefs } from 'pinia'

const {
  full = false,
  confirmText = '确定',
  loading = false,
  cancelText = '取消',
} = defineProps<FooterOperationProps>()
const emits = defineEmits<FooterOperationEmits>()

const router = useRouter()
const route = useRoute()

const { sidebarWidth, sidebarCollapsed, sidebarCollapsedWidth } = storeToRefs(useAppStore())
const visible = ref(true)
const isEdit = defineModel<boolean | undefined>('isEdit', { default: undefined })
const sidebarWidthPx = computed(() => sidebarCollapsed.value ? sidebarCollapsedWidth.value : sidebarWidth.value)

onActivated(() => {
  visible.value = true
})

onDeactivated(() => {
  visible.value = false
})

function cancel() {
  isEdit.value = false
  emits('cancel')
}

function confirm() {
  emits('confirm')
}

const { removeTag } = useTagsStroe()

function goBack() {
  removeTag(route.fullPath)
  router.go(-1)
}
</script>

<template>
  <Teleport v-if="visible" to="body">
    <div
      class="border-t-1 border-gray-100 bg-white h-64px w-100% transition-all duration-300 ease-in-out bottom-0 fixed z-10"
      :style="{
        width: full ? '100%' : `calc(100vw - ${sidebarWidthPx}px)`,
        left: full ? 0 : `${sidebarWidthPx}px`,
      }"
    >
      <div class="flex gap-2 h-100% w-100% items-center justify-center">
        <template v-if="isEdit !== false">
          <slot>
            <n-button v-if="isEdit !== undefined" @click="cancel">{{ cancelText }}</n-button>
            <n-button v-else @click="goBack">返回</n-button>
            <n-button type="primary" :loading="loading" @click="confirm">{{ confirmText }}</n-button>
          </slot>
        </template>
        <template v-else>
          <slot>
            <n-button @click="goBack">返回</n-button>
            <n-button type="primary" :loading="loading" @click="isEdit = true">编辑</n-button>
          </slot>
        </template>
      </div>
    </div>
  </Teleport>
</template>
