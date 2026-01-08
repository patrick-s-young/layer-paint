export const loadImageToCanvas = (imageSrc: string): Promise<HTMLCanvasElement | undefined> => {
  return new Promise((resolve, reject) => {
    const cv = document.createElement('canvas')
    const ctx = cv.getContext('2d')
    if (!ctx) return reject(new Error('Failed to get context'))
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      cv.width = image.width
      cv.height = image.height
      ctx.drawImage(image, 0, 0)
      return resolve(cv)
    }
    image.onerror = () => reject(new Error('Failed to load image'))
  })
}

export const loadImage = (imageSrc: string): Promise<HTMLImageElement | undefined> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
  })
}

export const fillColorToCanvas = (colorHex: string, width: number, height: number): HTMLCanvasElement => {
  const cv = document.createElement('canvas')
  cv.width = width
  cv.height = height
  const ctx = cv.getContext('2d')
  if (!ctx) return cv as HTMLCanvasElement
  ctx.fillStyle = colorHex
  ctx.fillRect(0, 0, cv.width, cv.height)
  console.log(cv)
  return cv as HTMLCanvasElement
}

export const compositeToDestination = (sourceA: HTMLCanvasElement, sourceB: HTMLCanvasElement,  destination: HTMLCanvasElement, operation: GlobalCompositeOperation): boolean => {
  const sourceActx = sourceA.getContext('2d')
  if (!sourceActx) return false
  sourceActx.globalCompositeOperation = operation
  sourceActx.drawImage(sourceB, 0, 0)

  destination.width = sourceA.width
  destination.height = sourceA.height
  const destinationCtx = destination.getContext('2d')
  if (!destinationCtx) return false
  destinationCtx.globalCompositeOperation = "source-over";
  destinationCtx.drawImage(sourceA, 0, 0)
  return true
}

export const compositeMaskToCanvas = (mask: HTMLImageElement, color: HTMLImageElement, xpos: number, ypos: number): HTMLCanvasElement | undefined => {
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

export const copyToDestination = (source: HTMLCanvasElement, destination: HTMLCanvasElement, operation: GlobalCompositeOperation = "source-over"): boolean => {
  const destinationCtx = destination.getContext('2d')
  if (!destinationCtx) return false
  destinationCtx.globalCompositeOperation = operation;
  destinationCtx.drawImage(source, 0, 0)
  return true
}

export const copyImageToDestination = (image: HTMLImageElement, destination: HTMLCanvasElement, operation: GlobalCompositeOperation = "source-over"): boolean => {
  const destinationCtx = destination.getContext('2d')
  if (!destinationCtx) return false
  destinationCtx.globalCompositeOperation = operation;
  destinationCtx.drawImage(image, 0, 0)
  return true
}