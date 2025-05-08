import { Heading } from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'
import slugify from 'slugify'

const usedIds = new Map<string, number>()

export const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const content = node.textContent || ''
    let baseId = slugify(content, { lower: true, strict: true })

    // 处理空 id（如 slugify 移除了所有字符）
    if (!baseId) baseId = 'heading'

    // 保证唯一性
    const count = usedIds.get(baseId) || 0
    usedIds.set(baseId, count + 1)
    const id = count === 0 ? baseId : `${baseId}-${count}`

    return [`h${node.attrs.level}`, mergeAttributes(HTMLAttributes, { id }), 0]
  },

  // 清除记录（防止多个编辑器或更新时污染）
  addStorage() {
    return {
      onDestroy: () => {
        usedIds.clear()
      },
    }
  },
})
