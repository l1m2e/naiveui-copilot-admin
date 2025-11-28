<script lang="tsx" setup>
import { useScroll } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'
import { storeToRefs } from 'pinia'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'
import router from '~/router'

const { removeTag: removeTagFromStore } = useTagsStroe()
const { tagsList, currentTag } = storeToRefs(useTagsStroe())

function navigateAfterRemove(index: number) {
  const list = tagsList.value
  if (list.length <= 1) return

  const isLast = index === list.length - 1
  const next = isLast ? list[index - 1] : list[index + 1]
  next && router.push(next.path)
}

function removeTag(val: Tags) {
  const index = tagsList.value.findIndex(item => item.path === val.path)
  navigateAfterRemove(index)
  removeTagFromStore(val.path)
}

function selectTag(val: Tags) {
  router.push(val.path)
}

function closeCurrent(item: Tags) {
  const index = tagsList.value.findIndex(tag => tag.path === item.path)
  navigateAfterRemove(index)
  removeTagFromStore(item.path)
}

function closeOthers(item: Tags) {
  tagsList.value = tagsList.value.filter(
    tag => tag.path === '/' || tag.path === item.path,
  )
}

function closeLeft(item: Tags) {
  const index = tagsList.value.findIndex(tag => tag.path === item.path)
  tagsList.value = tagsList.value.filter(
    (v, i) => i >= index || v.path === '/',
  )
}

function closeRight(item: Tags) {
  const index = tagsList.value.findIndex(tag => tag.path === item.path)
  tagsList.value = tagsList.value.slice(0, index + 1)
}

// 菜单配置
function getContextMenuItems(item: Tags) {
  // 首页不显示右键菜单
  if (item.path === '/') {
    return []
  }
  return [
    { label: '关闭当前', icon: 'i-lucide-x', action: () => closeCurrent(item) },
    { label: '关闭其他', icon: 'i-lucide-x-circle', action: () => closeOthers(item) },
    { label: '关闭左侧', icon: 'i-lucide-arrow-left-circle', action: () => closeLeft(item) },
    { label: '关闭右侧', icon: 'i-lucide-arrow-right-circle', action: () => closeRight(item) },
  ]
}

const scrollContainer = ref<HTMLElement | null>(null)
const { x: scrollLeft, arrivedState } = useScroll(scrollContainer, { behavior: 'smooth' })

const showLeftArrow = computed(() => !arrivedState.left)
const showRightArrow = computed(() => !arrivedState.right)

function scrollBy(offset: number) {
  scrollLeft.value += offset
}
const scrollToLeft = () => scrollBy(-200)
const scrollToRight = () => scrollBy(200)

const vars = useThemeVars()
</script>

<template>
  <div class="flex items-center relative">
    <!-- 左箭头 -->
    <Transition name="fade">
      <button
        v-if="showLeftArrow"
        class="nav-arrow flex h-32px w-8 cursor-pointer transition-colors items-center left-0 justify-center absolute z-10 hover:bg-gray-100"
        @click="scrollToLeft"
      >
        <div class="i-lucide-chevron-left text-base" />
      </button>
    </Transition>

    <!-- 标签容器 -->
    <div ref="scrollContainer" class="scrollbar-hide px-2 flex flex-1 items-center overflow-x-auto">
      <ContextMenuRoot v-for="item in tagsList" :key="item.label">
        <ContextMenuTrigger as-child>
          <div
            class="tab-item group flex flex-shrink-0 h-32px items-center"
            :class="currentTag?.path === item.path ? 'activation' : 'transition-colors hover:bg-gray-100'"
            @click="() => selectTag(item)"
          >
            <div class="flex gap-5px items-center justify-between">
              <div>{{ item.label }}</div>

              <!-- 关闭按钮 -->
              <div
                v-if="item.path !== '/'" class="rounded-full transition-all" :class="[
                  currentTag?.path === item.path
                    ? 'opacity-100 hover:text-black hover:bg-white'
                    : 'opacity-0 group-hover:opacity-100 hover:text-black hover:bg-gray-300',
                ]" @click.stop="() => removeTag(item)"
              >
                <div class="i-lucide-x" />
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <!-- 右键菜单 -->
        <ContextMenuPortal>
          <ContextMenuContent class="p-1 border border-gray-200 rounded-md bg-white shadow-lg z-9999">
            <ContextMenuItem
              v-for="menuItem in getContextMenuItems(item)" :key="menuItem.label"
              class="text-sm px-3 py-2 outline-none rounded flex gap-2 cursor-pointer transition-colors items-center hover:bg-gray-100"
              @select="menuItem.action"
            >
              <div :class="menuItem.icon" />
              <span>{{ menuItem.label }}</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenuRoot>
    </div>

    <!-- 右箭头 -->
    <Transition name="fade">
      <button
        v-if="showRightArrow"
        class="nav-arrow flex h-32px w-8 cursor-pointer transition-colors items-center right-0 justify-center absolute z-10 hover:bg-gray-100"
        @click="scrollToRight"
      >
        <div class="i-lucide-chevron-right text-base" />
      </button>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.tab-item {
  --uno: 'flex h-32px items-center relative px-15px py-10px rounded-t-5px cursor-pointer';

  &.activation {
    color: white;
    background-color: v-bind('vars.primaryColor');

    &::before,
    &::after {
      --uno: 'absolute bottom-0 w-10px h-10px rounded-full';
      content: '';
      box-shadow: 0 0 0 40px v-bind('vars.primaryColor');
    }

    &::before {
      left: -10px;
      clip-path: inset(50% -10px 0 50%);
    }

    &::after {
      right: -10px;
      clip-path: inset(50% 50% 0 -10px);
    }
  }
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
