import { Video } from './extensions/video'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
        src: string
        width?: string
        height?: string
      }) => ReturnType
    }
  }
}
