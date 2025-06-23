import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ResizableImage from '@/components/pc/tiptap/ResizableImage.vue'

export default Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(
      ResizableImage as unknown as typeof VueNodeViewRenderer extends (
        arg: infer T
      ) => any
        ? T
        : never
    )
  },
})
