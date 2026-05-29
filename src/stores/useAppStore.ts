import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const sidebarWidth = ref(240)
  const sidebarIconSize = ref(22)
  const sidebarCollapsedWidth = ref(64)

  return {
    sidebarCollapsed,
    sidebarWidth,
    sidebarIconSize,
    sidebarCollapsedWidth
  }
})
