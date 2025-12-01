<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :date-locale="dateZhCN" :locale="zhCN">
    <n-message-provider>
      <main font-sans>
        <router-view />
      </main>
    </n-message-provider>
  </n-config-provider>
</template>
