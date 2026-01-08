
export type LayerData = {
  id: string
  order: number
  type: 'all' | 'area'
  colorHex?: string | undefined
  colorImageSrc?: string | undefined
  maskImageSrc: string
  xpos: number
  ypos: number
}

export const LAYER_DATA: LayerData[] = [
  {
    id: '0001',
    order: 0,
    type: 'all',
    colorImageSrc: '/parka_444x474.png',
    maskImageSrc: '/parka_444x474_mask.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0002',
    order: 1,
    type: 'area',
    colorImageSrc: '/area-color-00_444x474.png',
    maskImageSrc: '/area-mask-00_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0003',
    order: 2,
    type: 'area',
    colorImageSrc: '/area-color-01_444x474.png',
    maskImageSrc: '/area-mask-01_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0003',
    order: 3,
    type: 'area',
    colorImageSrc: '/area-color-02_444x474.png',
    maskImageSrc: '/area-mask-02_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0004',
    order: 4,
    type: 'area',
    colorImageSrc: '/area-color-03_444x474.png',
    maskImageSrc: '/area-mask-03_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0005',
    order: 5,
    type: 'area',
    colorImageSrc: '/area-color-04_444x474.png',
    maskImageSrc: '/area-mask-04_444x474.png',
    xpos: 0,
    ypos: 0,
  }
]