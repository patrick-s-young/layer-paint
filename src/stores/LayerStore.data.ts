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

type ColourUpData = {
  id: string
  assetSrc: string
  assetMaskSrc: string
  layers: LayerData[]
}

export const COLOUR_UP_DATA: ColourUpData = {
  id: '0000',
  assetSrc: '/parka_444x474.png',
  assetMaskSrc: '/parka_444x474_mask.png',
  layers:  [{
    id: '0001',
    order: 1,
    type: 'all',
    colorHex: '#ffebcd',
    //colorImageSrc: '/parka_444x474.png',
    maskImageSrc: '/parka_444x474_mask.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0002',
    order: 2,
    type: 'area',
    colorImageSrc: '/area-color-00_444x474.png',
    maskImageSrc: '/area-mask-00_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0003',
    order: 3,
    type: 'area',
    colorImageSrc: '/area-color-01_444x474.png',
    maskImageSrc: '/area-mask-01_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0004',
    order: 4,
    type: 'area',
    colorImageSrc: '/area-color-02_444x474.png',
    maskImageSrc: '/area-mask-02_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0005',
    order: 5,
    type: 'area',
    colorImageSrc: '/area-color-03_444x474.png',
    maskImageSrc: '/area-mask-03_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0006',
    order: 6,
    type: 'area',
    colorImageSrc: '/area-color-04_444x474.png',
    maskImageSrc: '/area-mask-04_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0007',
    order: 7,
    type: 'area',
    colorImageSrc: '/area-color-05_444x474.png',
    maskImageSrc: '/area-mask-05_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0008',
    order: 8,
    type: 'area',
    colorImageSrc: '/area-color-06_444x474.png',
    maskImageSrc: '/area-mask-06_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0009',
    order: 9,
    type: 'area',
    colorImageSrc: '/area-color-07_444x474.png',
    maskImageSrc: '/area-mask-07_444x474.png',
    xpos: 0,
    ypos: 0,
  },
  {
    id: '0010',
    order: 10,
    type: 'area',
    colorHex: '#ff00ff',
    maskImageSrc: '/area-mask-08_444x474.png',
    xpos: 0,
    ypos: 0,
  }
  ]
}

