import { makeAutoObservable, observable, autorun, action } from 'mobx'
import { type ColourUpData, type LayerData } from './LayerStore.data.ts'
import { COLOUR_UP_DATA } from './LayerStore.data.ts'
import { compositeMaskToCanvas, imageToCanvas, loadImage, fillColorToImageSrc, createEmptyCanvas } from '@/lib/canvas.ts'

export type Layer = {
  id: string
  order: number
  colorImageSrc?: string
  colorHex?: string
  maskImageSrc: string
  type: 'all' | 'area'
  colorImage: HTMLImageElement | undefined
  maskImage: HTMLImageElement | undefined
  maskCanvas: HTMLCanvasElement | undefined
  compositeCanvas: HTMLCanvasElement | undefined
  xpos: number
  ypos: number
}

export default class LayerStore {
  @observable protected _layers: Layer[] = []
  @observable protected _loading: boolean = true
  @observable protected _assetImage: HTMLImageElement | undefined = undefined
  @observable protected _assetMaskImage: HTMLImageElement | undefined = undefined
  @observable protected _documentCanvas: HTMLCanvasElement | undefined = undefined
  @observable protected _activeLayer: Layer | undefined = undefined
  @observable protected _editMode: 'mask' | 'color' | 'none' = 'color'
  @observable protected _editMaskMode: 'draw' | 'erase' | 'none' = 'draw'
  @observable protected _editMaskEraseCanvas: HTMLCanvasElement | undefined = undefined
  @observable protected _dragAction: 'start' | 'drag' | 'stop' | 'none' = 'none'
  @observable protected _dragFromPoint: {x: number, y: number} | undefined = undefined
  @observable protected _paintOffsets: {top: number, left: number, scale: number} | undefined = undefined
  @observable protected _redraw: number = 1
  constructor(data: ColourUpData) {
    makeAutoObservable(this)

    autorun(async() => {
      const layerPromises = data.layers.map(async (data: LayerData) => {
        const maskImage = await loadImage(data.maskImageSrc);
        const colorImageSrc: string | undefined = data.colorHex 
        ? fillColorToImageSrc(data.colorHex, maskImage!.width, maskImage!.height) 
        : data.colorImageSrc as string;
        const colorImage = await loadImage(colorImageSrc as string);
        const maskCanvas = imageToCanvas(maskImage as HTMLImageElement);
        const compositeCanvas = compositeMaskToCanvas(
          maskCanvas as HTMLCanvasElement,
          colorImage as HTMLImageElement,
          data.xpos,
          data.ypos
        );
  
        return {
          ...data,
          colorImageSrc: colorImageSrc as string,
          colorImage: colorImage as HTMLImageElement,
          maskImage: maskImage as HTMLImageElement,
          maskCanvas: maskCanvas as HTMLCanvasElement,
          compositeCanvas: compositeCanvas as HTMLCanvasElement,
        };
      });
  
      const layers = await Promise.all(layerPromises);
      this._layers = layers
      this._assetImage = await loadImage(data.assetSrc as string);
      this._assetMaskImage = await loadImage(data.assetMaskSrc as string);
      
      this._loading = false
    })
  }

  get redraw() {
    return this._redraw
  }

  get activeLayer() {
    return this._activeLayer as Layer
  }

  @action setActiveLayer(id: string) {
    this._activeLayer = this._layers.find(layer => layer.id === id)
  }

  @action setActiveMask(id: string) {
    this._activeLayer = this._layers.find(layer => layer.id === id)
  }

  get editMode() {
    return this._editMode
  }

  @action setEditMode(mode: 'mask' | 'color' | 'none') {
    this._editMode = mode
  }

  @action setEditMaskMode(mode: 'draw' | 'erase' | 'none') {
    this._editMaskMode = mode
  }

  get dragAction() {
    return this._dragAction
  }

  get editMaskMode() {
    return this._editMaskMode
  }

  get layers() {
    return this._layers
  }

  get loading() {
    return this._loading
  }

  @action setDocumentCanvas(canvas: HTMLCanvasElement) {
    this._documentCanvas = canvas
    this._documentCanvas.width = this._assetMaskImage!.width
    this._documentCanvas.height = this._assetMaskImage!.height
  }

  @action onDragActiveLayer(ev: MouseEvent, action: 'start' | 'drag' | 'stop') {
    if (this._editMode === 'color') this.onDragActiveColor(ev, action)
    if (this._editMode === 'mask' && this._editMaskMode === 'draw') this.onDragMaskDraw(ev, action)
    if (this._editMode === 'mask' && this._editMaskMode === 'erase') this.onDragMaskErase(ev, action)
  }

  @action onDragMaskErase(ev: MouseEvent, action: 'start' | 'drag' | 'stop') {
    if (action === 'start') {
      this._dragAction = 'start'
      const documentCanvasRect = this._documentCanvas?.getBoundingClientRect()
      if (!documentCanvasRect) return
      const { top, left, width } = documentCanvasRect
      this._paintOffsets = {top: top, left: left, scale: this._activeLayer!.maskImage!.width / width}
      return
   }
   if (action === 'stop') {
     this._dragAction = 'stop'
     this._editMaskEraseCanvas = undefined
     this._redraw++
     return
   }
   if (action === 'drag' && this._dragAction !== 'start') return
   if (!this._editMaskEraseCanvas) {
    this._editMaskEraseCanvas = createEmptyCanvas(this._activeLayer!.maskImage!.width, this._activeLayer!.maskImage!.height) as HTMLCanvasElement
   }
   const x = (ev.clientX - this._paintOffsets!.left) * this._paintOffsets!.scale
   const y = (ev.clientY - this._paintOffsets!.top) * this._paintOffsets!.scale
   const ctx = this._activeLayer!.maskCanvas?.getContext('2d')
   const eraseCtx = this._editMaskEraseCanvas?.getContext('2d')
   if (!eraseCtx || !ctx) return
   eraseCtx.beginPath()
   eraseCtx.arc(x, y, 20, 0, 2 * Math.PI, false)
   eraseCtx.fillStyle = 'white'
   eraseCtx.fill()
   eraseCtx.closePath()

   ctx.globalCompositeOperation = 'destination-out'
   ctx.drawImage(this._editMaskEraseCanvas as HTMLCanvasElement, 0, 0)
   this._activeLayer!.compositeCanvas = compositeMaskToCanvas(
    this._activeLayer!.maskCanvas as HTMLCanvasElement,
    this._activeLayer!.colorImage as HTMLImageElement,
    this._activeLayer!.xpos,
    this._activeLayer!.ypos
  )
    this.drawLayersToCanvas()
  }


  @action onDragMaskDraw(ev: MouseEvent, action: 'start' | 'drag' | 'stop') {
    if (action === 'start') {
       this._dragAction = 'start'
       const documentCanvasRect = this._documentCanvas?.getBoundingClientRect()
       if (!documentCanvasRect) return
       const { top, left, width } = documentCanvasRect
       this._paintOffsets = {top: top, left: left, scale: this._activeLayer!.maskImage!.width / width}
       return
    }
    if (action === 'stop') {
      this._dragAction = 'stop'
      this._redraw++
      return
    }
    if (action === 'drag' && this._dragAction !== 'start') return
    const x = (ev.clientX - this._paintOffsets!.left) * this._paintOffsets!.scale
    const y = (ev.clientY - this._paintOffsets!.top) * this._paintOffsets!.scale
    const ctx = this._activeLayer!.maskCanvas?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'black'
    ctx.fill()
   ctx.closePath()
   this._activeLayer!.compositeCanvas = compositeMaskToCanvas(
    this._activeLayer!.maskCanvas as HTMLCanvasElement,
    this._activeLayer!.colorImage as HTMLImageElement,
    this._activeLayer!.xpos,
    this._activeLayer!.ypos
  )
    this.drawLayersToCanvas()
  }


  @action onDragActiveColor(ev: MouseEvent, action: 'start' | 'drag' | 'stop') {
    if (action === 'start') {
      this._dragAction = 'start'
      this._dragFromPoint = {x: ev.clientX, y: ev.clientY}
      return
    }
    if (action === 'stop') {
      this._dragAction = 'stop'
      this._dragFromPoint = undefined
      return
    }
    if (action === 'drag' && this._dragAction !== 'start') return
    const x = ev.clientX - this._dragFromPoint!.x
    const y = ev.clientY - this._dragFromPoint!.y
    this._dragFromPoint = {x: ev.clientX, y: ev.clientY}
    this._activeLayer!.xpos += x
    this._activeLayer!.ypos += y
    this._activeLayer!.compositeCanvas = compositeMaskToCanvas(
      this._activeLayer!.maskCanvas as HTMLCanvasElement,
      this._activeLayer!.colorImage as HTMLImageElement,
      this._activeLayer!.xpos,
      this._activeLayer!.ypos
    )
    this.drawLayersToCanvas()
  }

  @action drawLayersToCanvas() {
    const destinationCtx = this._documentCanvas?.getContext('2d')
    if (!destinationCtx) return
    destinationCtx.clearRect(0, 0, this._documentCanvas!.width, this._documentCanvas!.height)
    destinationCtx.globalCompositeOperation = 'source-over';
    this._layers.forEach(layer => {
      destinationCtx.drawImage(layer.compositeCanvas as HTMLCanvasElement, 0, 0)
    })
    destinationCtx.globalCompositeOperation = 'multiply';
    destinationCtx.drawImage(this._assetImage as HTMLImageElement, 0, 0)
    destinationCtx.globalCompositeOperation = 'destination-in';
    destinationCtx.drawImage(this._assetMaskImage as HTMLImageElement, 0, 0)
  }
}

export const layerStore = new LayerStore(COLOUR_UP_DATA)
