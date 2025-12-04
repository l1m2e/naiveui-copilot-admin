<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

definePage({
  meta: {
    layout: 'empty',
    isMenu: false,
    keepAlive: false,
  },
})

const message = useMessage()
const router = useRouter()
const [Form, form, formRef] = useForm()

const items: FormItemProps[] = [
  {
    label: '账户',
    field: 'username',
    component: 'n-input',
    value: '',
    props: {
      placeholder: '请输入账户',
      size: 'large',
    },
    rule: yup.string().required('请输入账户'),
  },
  {
    label: '密码',
    field: 'password',
    component: 'n-input',
    value: '',
    props: {
      type: 'password',
      placeholder: '请输入密码',
      showPasswordOn: 'click',
      size: 'large',
    },
    rule: yup.string().required('请输入密码'),
  },
]

async function login() {
  await formRef.value?.validate()

  // TODO: 调用登录 API，发送 form.value 数据
  // 示例: await loginApi(form.value)
  // form.value 的使用方式：form.value 是一个对象，包含了表单中所有字段的值
  // 例如：{ username: 'admin', password: '123456' }
  // 模拟登录延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  message.success('登录成功')
  router.push('/')
}

const [loading, handleLogin] = useLoading(async () => {
  try {
    await login()
  }
  catch {
    message.error('请检查表单')
  }
})

// 回车登录
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center relative from-gray-50 to-gray-100 bg-gradient-to-br" @keypress="handleKeyPress">
    <!-- 装饰性背景 -->
    <div class="inset-0 absolute overflow-hidden">
      <div class="rounded-full bg-green-400/25 h-120 w-120 absolute blur-3xl -left-32 -top-32" />
      <div class="rounded-full bg-emerald-400/20 h-96 w-96 right-10 top-20 absolute blur-3xl" />
      <div class="rounded-full bg-teal-400/25 h-120 w-120 absolute blur-3xl -bottom-32 -right-32" />
    </div>

    <!-- 登录卡片 -->
    <div class="px-2 max-w-md w-full relative z-10">
      <div class="p-10 border border-white/60 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-xl">
        <!-- 标题区域 -->
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 rounded-2xl inline-flex h-14 w-14 shadow-green-500/30 shadow-lg items-center justify-center from-green-400 to-emerald-500 bg-gradient-to-br">
            <div class="i-lucide-salad text-white h-7 w-7" />
          </div>
          <h1 class="text-2xl text-gray-800 font-bold">
            欢迎登录
          </h1>
        </div>

        <!-- 表单区域 -->
        <Form.Root label-placement="top" label-width="auto">
          <Form.ItemGrid :items="items" class="gap-6" />
          <n-button type="primary" size="large" class="mt-8 rounded-xl w-full" :loading="loading" @click="handleLogin">
            登录
          </n-button>
        </Form.Root>
      </div>
    </div>
  </div>
</template>
