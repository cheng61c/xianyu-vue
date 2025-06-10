import { onMounted, onUnmounted, type Ref } from 'vue'

interface SelectionInfo {
  start: number
  end: number
  inputEl: HTMLTextAreaElement | HTMLInputElement
}

function getSelection(
  inputEl: HTMLTextAreaElement | HTMLInputElement
): SelectionInfo | null {
  const start = inputEl.selectionStart
  const end = inputEl.selectionEnd
  if (start !== null && end !== null) {
    return { start, end, inputEl }
  }
  return null
}

function insertWrapped(
  inputEl: HTMLTextAreaElement | HTMLInputElement,
  before: string,
  after = before,
  cursorOffset = before.length
) {
  const sel = getSelection(inputEl)
  if (!sel) return

  const { start, end } = sel
  inputEl.setRangeText(before + after, start, end, 'end')
  const newPos = start + cursorOffset
  inputEl.setSelectionRange(newPos, newPos)
}

export function useEditorShortcuts(
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  tabWidth: Ref<number, number>,
  formatFn?: () => void
) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const el = inputRef.value
    if (!el) return

    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      formatFn?.()
      return
    }

    const actions: Record<string, () => void> = {
      Tab: () => {
        event.preventDefault()
        insertWrapped(el, ' '.repeat(+tabWidth.value), '', +tabWidth.value)
      },
      '<': () => {
        event.preventDefault()
        insertWrapped(el, '<', '>', 1)
      },
      '>': () => {
        event.preventDefault()
        insertWrapped(el, '</', '>', 2)
      },
      "'": () => {
        event.preventDefault()
        insertWrapped(el, "'", "'", 1)
      },
      '"': () => {
        event.preventDefault()
        insertWrapped(el, '"', '"', 1)
      },
    }

    const action = actions[event.key]
    if (action) action()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
