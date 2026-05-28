<script lang="tsx" setup>
import navTags from './navTags.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.replace('/login')
}

const dropdownOptions = [
  {
    label: '退出登录',
    key: 'logout'
  },
]

function handleDropdownSelect(key: string) {
  if (key === 'logout')
    handleLogout()
}
</script>

<template>
  <div>
    <div class="px-4 border-b border-[var(--n-border-color)] flex h-48px items-center justify-between">
      <span class="text-lg font-semibold">naiveui-copilot</span>
      <n-dropdown :options="dropdownOptions" trigger="click" @select="handleDropdownSelect">
        <div class="px-2 py-1 rounded-md flex gap-2 cursor-pointer transition-colors items-center hover:bg-[var(--n-color-hover)]">
          <span class="text-sm">Admin</span>
          <n-icon size="14"><div class="i-lucide-chevron-down" /></n-icon>
        </div>
      </n-dropdown>
    </div>
    <navTags />
  </div>
</template>
