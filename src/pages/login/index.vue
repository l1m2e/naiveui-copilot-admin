<script lang="ts" setup>
definePage({
  meta: {
    title: '登录',
    layout: 'empty',
    hideInMenu: true,
    noCache: true,
  },
})

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const tokenValue = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!tokenValue.value.trim()) {
    message.warning('请输入 Token')
    return
  }
  loading.value = true
  try {
    const success = await authStore.login(tokenValue.value.trim())
    if (success) {
      message.success('登录成功')
      router.replace('/')
    }
    else {
      message.error('Token 无效，请检查后重试')
    }
  }
  catch {
    message.error('登录失败，请检查服务是否可用')
  }
  finally {
    loading.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="bg-gray-50 flex h-screen w-screen items-center justify-center dark:bg-slate-900">
    <n-card class="rounded-lg w-420px shadow-lg">
      <div class="flex flex-col gap-6 items-center">
        <div class="text-2xl text-gray-800 font-bold dark:text-gray-100">
          Mastra Console
        </div>
        <n-input
          v-model:value="tokenValue"
          type="password"
          show-password-on="click"
          placeholder="请输入 Token"
          size="large"
          @keydown="handleKeydown"
        />
        <n-button
          type="primary"
          block
          size="large"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </n-button>
      </div>
    </n-card>
  </div>
</template>
