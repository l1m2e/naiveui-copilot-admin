import type { RouteRecordNameGeneric } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { defineStore } from 'pinia'
import router from '~/router'

export interface Tags {
  /** 路由路径 */
  path: string
  /** 路由标识 需要和组件名称相同 */
  name: string | RouteRecordNameGeneric
  /** 名称 */
  label: string
}

export const useTagsStroe = defineStore('tagsStore', () => {
  const { path, name, meta } = router.getRoutes().find(route => route.name === '//')!
  const defaultTags = [{
    path,
    name,
    label: meta?.title as string || '首页'
  }]

  const tagsList = ref<Tags[]>(cloneDeep(defaultTags))

  /** 获取当前标签（响应路由变化） */
  const currentTag = computed<Tags | undefined>(() => {
    const path = router.currentRoute.value?.path ?? window.location.pathname
    return tagsList.value.find(item => item.path === String(path))
  })

  /** 清空标签页数据 */
  function removeTagData() {
    tagsList.value = cloneDeep(defaultTags)
  }

  // 添加到标签缓存
  function addTag({ path, name, label }: Tags) {
    const tag = tagsList.value.find(item => item.path === path)
    // 不存在该标签 则添加 如果存在 不需要添加直接跳转到该路由
    if (!tag) {
      const tag = { name, path, label }
      tagsList.value.push(tag)
    }
  }

  /** 删除标签缓存 */
  function removeTag(path: string) {
    tagsList.value = tagsList.value.filter(item => item.path !== path)
  }

  /** 修改标签名称 */
  function changeTagName(tagName: string, name?: string) {
    const existTagName = tagsList.value.some(item => item.name === name && item.path === window.location.pathname)
    if (existTagName) {
      const item = tagsList.value.find(item => item.path === window.location.pathname)
      item && (item.label = tagName)
    }
  }

  /** 缓存标签页计算属性 */
  const pageCaches = computed(() => tagsList.value.map(item => item.path))

  return {
    /** 标签列表 */
    tagsList,
    /** 缓存的页面 */
    pageCaches,
    /** 清空标签数据 */
    removeTagData,
    /** 添加标签 */
    addTag,
    /** 删除标签缓存 */
    removeTag,
    /** 修改标签名称 */
    changeTagName,
    /** 当前标签 */
    currentTag
  }
})
