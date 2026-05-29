<script setup lang="ts">
import type { MonacoEditorProps } from './index'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import { createHighlighter } from 'shiki'

const {
  language = 'json',
  config = {
    theme: 'dark-plus',
    fontSize: 14,
  },
  readOnly = false,
} = defineProps<MonacoEditorProps>()

const editContainer = ref<HTMLElement | null>(null)

const modelValue = defineModel<string>()

let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  monacoEditor = monaco.editor.create(editContainer.value as HTMLElement, {
    language,
    readOnly,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    folding: true,
    wordWrap: 'on',
    tabSize: 2,
    automaticLayout: true,
    ...config,
  })

  monacoEditor.onDidChangeModelContent(() => {
    modelValue.value = monacoEditor!.getValue()
  })

  if (modelValue.value) {
    monacoEditor.setValue(modelValue.value)
  }

  initHighlighter()
})

watch(modelValue, (val) => {
  if (monacoEditor && val !== undefined && val !== monacoEditor.getValue()) {
    monacoEditor.setValue(val)
  }
})

async function initHighlighter() {
  const highlighter = await createHighlighter({
    themes: [config.theme ?? 'dark-plus'],
    langs: [language],
  })
  shikiToMonaco(highlighter, monaco)
}

defineExpose({
  setValue(text: string) {
    monacoEditor?.setValue(text)
  },
})
</script>

<template>
  <div ref="editContainer" class="w-full" />
</template>
