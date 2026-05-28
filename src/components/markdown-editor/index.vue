<script lang="ts" setup>
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import 'github-markdown-css/github-markdown-light.css'
import '~/styles/markdown-editor.css'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  minHeight?: number
  editable?: boolean
}>(), {
  modelValue: '',
  placeholder: '请输入 Markdown 内容...',
  minHeight: 200,
  editable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = shallowRef<Editor>()
const focused = ref(false)

let isInternalUpdate = false

watch(() => props.modelValue, (value) => {
  if (isInternalUpdate)
    return
  if (editor.value && editor.value.getMarkdown() !== value) {
    editor.value.commands.setContent(value || '', { emitUpdate: false, contentType: 'markdown' })
  }
})

watch(() => props.editable, (value) => {
  editor.value?.setEditable(value)
})

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue || '',
    contentType: 'markdown',
    editable: props.editable,
    extensions: [
      StarterKit,
      Markdown,
    ],
    editorProps: {
      attributes: {
        'class': 'markdown-editor-body markdown-body p-3',
        'data-placeholder': props.placeholder,
      },
    },
    onUpdate: ({ editor: e }) => {
      isInternalUpdate = true
      emit('update:modelValue', e.getMarkdown())
      nextTick(() => isInternalUpdate = false)
    },
    onFocus: () => {
      focused.value = true
    },
    onBlur: () => {
      focused.value = false
    },
  })
})

function handleContainerClick() {
  editor.value?.commands.focus()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div
    class="b rounded-md bg-white w-full transition-border-color duration-200 overflow-hidden"
    :class="[
      focused ? 'b-[#36ad6a]' : 'b-gray-300',
      { 'opacity-60 pointer-events-none': !editable },
    ]"
    :style="{ minHeight: `${minHeight}px` }"
    @click="handleContainerClick"
  >
    <EditorContent :editor="editor" class="markdown-editor w-full" />
  </div>
</template>
