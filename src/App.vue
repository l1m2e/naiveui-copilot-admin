<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :date-locale="dateZhCN" :locale="zhCN">
    <main font-sans>
      <router-view />
    </main>
  </n-config-provider>
</template>
