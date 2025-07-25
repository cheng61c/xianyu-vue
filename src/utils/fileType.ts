import {
  Globe,
  Sofa,
  BrickWall,
  Shirt,
  Boxes,
  ImageIcon,
  FileArchive,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

export const iconMap = {
  1: Globe,
  2: Sofa,
  3: BrickWall,
  4: Shirt,
  5: Boxes,
  6: ImageIcon,
  7: FileArchive,
} as const

export function useTypeLabelMap() {
  const { t } = useI18n()
  return {
    1: t('b.cun-dang'),
    2: t('b.jia-ju'),
    3: t('b.cai-zhi'),
    4: t('b.pi-fu'),
    5: t('b.mo-zu'),
    6: t('b.tu-pian'),
    7: t('b.ruan-jian'),
  } as const
}
