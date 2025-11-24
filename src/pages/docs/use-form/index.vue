<script setup lang="ts">
import type { Component } from 'vue'
import ActionExample from './components/action-example.vue'
import AsyncExample from './components/async-example.vue'
import BaseExample from './components/base-example.vue'
import DynamicExample from './components/dynamic-example.vue'
import LayoutExample from './components/layout-example.vue'
import RuleExample from './components/rule-example.vue'

definePage({
  meta: {
    title: 'useForm',
    order: 1,
  },
})

interface ExampleItem {
  title: string
  component: Component
  description?: string
  name: string
}

const formListRef = useTemplateRef<InstanceType<typeof BaseExample>[]>('FormListRef')

const examples: ExampleItem[] = [
  {
    title: '基础示例',
    component: BaseExample,
    name: 'BaseExample',
  },
  {
    title: '验证规则示例 (含扩展)',
    component: RuleExample,
    name: 'RuleExample',
  },
  {
    title: '动态字段示例',
    component: DynamicExample,
    name: 'DynamicExample',
  },
  {
    title: '自定义布局与插槽',
    component: LayoutExample,
    name: 'LayoutExample',
  },
  {
    title: '异步唯一性校验示例',
    component: AsyncExample,
    name: 'AsyncExample',
  },
  {
    title: '提交与重置示例',
    component: ActionExample,
    name: 'ActionExample',
  },
]

function submit(name: string) {
  const formRef = getFormRefByName(name)
  formRef?.validate()
}

function validate(name: string) {
  const formRef = getFormRefByName(name)
  formRef?.validate()
}

function reset(name: string) {
  const formRef = getFormRefByName(name)
  formRef?.reset()
}

function getFormRefByName(name: string) {
  const index = examples.findIndex(item => item.name === name)
  return formListRef.value?.[index]?.formRef
}
</script>

<template>
  <n-card class="bg-slate-100">
    <div class="space-y-6">
      <div v-for="(example, index) in examples" :key="index" class="p-4 rounded bg-white">
        <n-h3>{{ example.title }}</n-h3>
        <component :is="example.component" ref="FormListRef" />
        <n-divider />
        <div class="flex gap-2 justify-center">
          <n-button type="primary" @click="() => submit(example.name)">提交</n-button>
          <n-button @click="() => validate(example.name)">校验</n-button>
          <n-button @click="() => reset(example.name)">重置</n-button>
        </div>
      </div>
    </div>
  </n-card>
</template>
