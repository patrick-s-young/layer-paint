export const imageToCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const cv = document.createElement('canvas')
  cv.width = image.width
  cv.height = image.height
  const ctx = cv.getContext('2d')
  if (!ctx) return cv as HTMLCanvasElement
  ctx.drawImage(image, 0, 0)
  return cv as HTMLCanvasElement
}

export const loadImage = (imageSrc: string): Promise<HTMLImageElement | undefined> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
  })
}

export const compositeMaskToCanvas = (mask: HTMLCanvasElement, color: HTMLImageElement, xpos: number, ypos: number): HTMLCanvasElement | undefined => {
  const { width, height } = mask
  const cv = document.createElement('canvas')
  cv.width = width
  cv.height = height
  const ctx = cv.getContext('2d')
  if (!ctx) return undefined
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(mask, 0, 0)
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(color, xpos, ypos)
  return cv
}

export const fillColorToImageSrc = (colorHex: string, width: number, height: number): string | undefined => {
  const cv = document.createElement('canvas')
  cv.width = width
  cv.height = height
  const ctx = cv.getContext('2d')
  if (!ctx) return undefined
  ctx.fillStyle = colorHex
  ctx.fillRect(0, 0, cv.width, cv.height)
  return cv.toDataURL()
}

export const createEmptyCanvas = (width: number, height: number): HTMLCanvasElement => {
  const cv = document.createElement('canvas')
  cv.width = width
  cv.height = height
  return cv
}