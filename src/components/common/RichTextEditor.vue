<script setup lang="ts">
import { decode } from 'html-entities'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = ref<HTMLElement | null>(null)

type FormatCommand = 'bold' | 'italic' | 'superscript' | 'subscript' | 'removeFormat'
const LIST_ALIGN = [{
  name: 'left',
  icon: 'IconAlignLeft',
}, {
  name: '',
  icon: 'IconAlignCenter',
}, {
  name: 'right',
  icon: 'IconAlignRight',
}, {
  name: 'justify',
  icon: 'IconAlignJustify',
}]
const currentAlign = ref<string>('')
function format(command: FormatCommand) {
  document.execCommand(command, false)
}
function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain')
  if (!text)
    return
  document.execCommand('insertText', false, text)
}

function handleUpdate() {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.target === editor.value) {
    switch (e.key.toLowerCase()) {
      case ',':
        e.preventDefault()
        e.stopPropagation()
        format('subscript')
        break
      case '.':

        e.preventDefault()
        e.stopPropagation()
        format('superscript')
        break
      case '/':

        e.preventDefault()
        e.stopPropagation()
        format('removeFormat')
        break
      case 'l':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('left')
        break
      case 'e':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('')
        break
      case 'r':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('right')
        break
      case 'j':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('justify')
        break
    }
  }
}

function handleAlign(name: string) {
  currentAlign.value = name
}
</script>

<template>
  <div class="w-full space-y-2 group relative">
    <!-- Formatting toolbar (ẩn mặc định, chỉ hiện khi hover/focus vào editor) -->
    <div
      class="flex gap-2 justify-center items-center bg-card/80 backdrop-blur-sm p-2 rounded-md absolute -top-[46px] left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition"
    >
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Bold" @click="format('bold')">
        <strong>B</strong>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Italic" @click="format('italic')">
        <i>I</i>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0 text-xs" title="Subscript" @click="format('subscript')">
        <p>X<sub>2</sub></p>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0 text-xs" title="Superscript" @click="format('superscript')">
        <p>X<sup>2</sup></p>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Remove Formatting" @click="format('removeFormat')">
        <Icon name="IconClear" class="w-4 h-4" />
      </Button>
      |
      <Button
        v-for="item in LIST_ALIGN"
        :key="item.name"
        variant="outline" size="sm" class="w-8 h-8 p-0" :title="`Align ${item.name || 'center'}`" :class="{ 'bg-accent': item.name === currentAlign }"
        @click="handleAlign(item.name)"
      >
        <Icon
          :name="item.icon" class="w-4 h-4"
          :class="{ 'text-background': item.name === currentAlign }"
        />
      </Button>
    </div>

    <!-- Editable title -->
    <div class="relative w-full">
      <div
        ref="editor"
        contenteditable
        class="w-full min-h-[60px] text-3xl bg-card/80 backdrop-blur-sm p-4 rounded-md border-0 focus:outline-none focus:ring-0 empty:before:content-[attr(placeholder)] empty:before:text-gray-400/50 overflow-auto scrollbar-hidden"
        :class="{
          'text-center': !currentAlign,
          'text-right': currentAlign === 'right',
          'text-justify': currentAlign === 'justify',
          'text-left': currentAlign === 'left',
        }"
        v-bind="$attrs"
        :placeholder="placeholder"
        @blur="handleUpdate"
        @paste="handlePaste"
        v-html="decode(modelValue)"
      />
      <div class="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform" />
    </div>
  </div>
</template>

<style scoped>
.empty::before {
  content: attr(placeholder);
  color: rgba(156, 163, 175, 0.5);
  pointer-events: none;
}
</style>
