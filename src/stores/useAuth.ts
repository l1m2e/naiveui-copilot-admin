import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('mastra-token') ?? '')

  function setToken(value: string) {
    token.value = value
    sessionStorage.setItem('mastra-token', value)
  }

  function clearToken() {
    token.value = ''
    sessionStorage.removeItem('mastra-token')
  }

  async function validateToken(t: string) {
    try {
      await api.mastra.postAuthCredentialsSignIn({
        email: 'admin@admin.com',
        password: t,
      })
      return true
    }
    catch {
      return false
    }
  }

  async function login(t: string) {
    const valid = await validateToken(t)
    if (valid) {
      setToken(t)
      return true
    }
    return false
  }

  function logout() {
    clearToken()
  }

  const isAuthenticated = computed(() => !!token.value)

  return { token, isAuthenticated, login, logout, validateToken }
})
