<script lang="tsx" setup>
import { useScroll } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import router from '~/router'

const { tagsList, currentTag } = storeToRefs(useTagsStroe())

// 点击tag跳转路由
function selectTag(val: Tags) {
  router.push(val.path)
}

// 删除标签
function removeTag(val: Tags) {
  const index = tagsList.value.findIndex(item => item.path === val.path)
  const isLast = index === tagsList.value.length - 1

  if (isLast) {
    router.push(tagsList.value[index - 1].path)
  }
  else {
    router.push(tagsList.value[index + 1].path)
  }

  tagsList.value.splice(index, 1)
}

// 滚动相关 - 使用 VueUse 简化
const scrollContainer = ref<HTMLElement>()
const { x: scrollLeft, arrivedState } = useScroll(scrollContainer, { behavior: 'smooth' })

const showLeftArrow = computed(() => !arrivedState.left)
const showRightArrow = computed(() => !arrivedState.right)

function scrollToLeft() {
  scrollLeft.value -= 200
}

function scrollToRight() {
  scrollLeft.value += 200
}

const vars = useThemeVars()
</script>

<template>
  <div class="flex items-center relative">
    <Transition name="fade">
      <button
        v-if="showLeftArrow"
        class="bg-white flex h-[34px] w-8 cursor-pointer items-center left-0 justify-center absolute z-10"
        @click="scrollToLeft"
      >
        <div class="i-ri-arrow-left-s-line text-lg" />
      </button>
    </Transition>

    <!-- 标签容器 -->
    <div ref="scrollContainer" class="scrollbar-hide px-4 flex flex-1 items-center overflow-x-auto">
      <div
        v-for="item in tagsList" :key="item.label" class="tab-item group flex flex-shrink-0 h-[34px] items-center"
        :class="currentTag?.path === item.path ? 'activation' : 'hover:bg-gray-200 rounded'"
        @click="() => selectTag(item)"
      >
        <div class="flex gap-5px items-center justify-between">
          <div>{{ item.label }}</div>
          <div
            v-if="item.path !== '/'" class="rounded-full transition-all" :class="[
              currentTag && currentTag.path === item.path
                ? 'opacity-100 hover:text-black hover:bg-white'
                : 'opacity-0 group-hover:opacity-100 hover:text-black hover:bg-white',
            ]" @click.stop="() => removeTag(item)"
          >
            <div class="i-ri-close-line" />
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <button
        v-if="showRightArrow"
        class="bg-white flex h-[34px] w-8 cursor-pointer items-center right-0 justify-center absolute z-10"
        @click="scrollToRight"
      >
        <div class="i-ri-arrow-right-s-line text-lg" />
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
