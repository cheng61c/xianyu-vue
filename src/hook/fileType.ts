import {
  Globe,
  Sofa,
  BrickWall,
  Shirt,
  Boxes,
  ImageIcon,
  FileArchive,
} from 'lucide-vue-next'

export const iconMap = {
  1: Globe,
  2: Sofa,
  3: BrickWall,
  4: Shirt,
  5: Boxes,
  6: ImageIcon,
  7: FileArchive,
} as const

export const typeLabelMap = {
  1: '存档',
  2: '家具',
  3: '材质',
  4: '皮肤',
  5: '模组',
  6: '图片',
  7: '软件',
} as const
