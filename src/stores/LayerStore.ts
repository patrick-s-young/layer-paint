import { makeAutoObservable, observable, autorun, action, computed, runInAction } from 'mobx'
import { loadImage } from '@/lib/canvas.ts'
import { type LayerData } from './LayerStore.data.ts'
import { LAYER_DATA } from './LayerStore.data.ts'
import { compositeMaskToCanvas } from '@/lib/canvas.ts'



export type Layer = {
  id: string
  order: number
  colorImageSrc?: string
  colorHex?: string
  maskImageSrc: string
  type: 'all' | 'area'
  colorImage: HTMLImageElement | undefined
  maskImage: HTMLImageElement | undefined
  compositeCanvas: HTMLCanvasElement | undefined
  xpos: number
  ypos: number
}



export default class LayerStore {

  @observable protected _layers: Layer[] = []
  @observable protected _loading: boolean = true
  @observable protected _sketchImage: HTMLImageElement | undefined = undefined
  @observable protected _allMaskImage: HTMLImageElement | undefined = undefined
  @observable protected _documentCanvas: HTMLCanvasElement | undefined = undefined
  @observable protected _activeLayer: Layer | undefined = undefined
  @observable protected _editMode: 'mask' | 'color' | 'none' = 'color'
  @observable protected _dragAction: 'start' | 'drag' | 'stop' | 'none' = 'none'
  @observable protected _dragFromPoint: {x: number, y: number} | undefined = undefined

  constructor(data: LayerData[]) {
    makeAutoObservable(this)
    data.forEach(layer => {
      this._layers.push({
        id: layer.id,
        order: layer.order,
        colorImageSrc: layer?.colorImageSrc ?? undefined,
        colorHex: layer?.colorHex ?? undefined,
        maskImageSrc: layer.maskImageSrc,
        type: layer.type,
        colorImage: undefined as Layer["colorImage"],
        maskImage: undefined as Layer["maskImage"],
        compositeCanvas: undefined as Layer["compositeCanvas"],
        xpos: layer.xpos,
        ypos: layer.ypos,
      })
    })

    autorun(async() => {
      const layerPromises = LAYER_DATA.map(async (data) => {
        const colorImage = await loadImage(data.colorImageSrc as string);
        const maskImage = await loadImage(data.maskImageSrc);
        const compositeCanvas = compositeMaskToCanvas(
          maskImage as HTMLImageElement,
          colorImage as HTMLImageElement,
          data.xpos,
          data.ypos
        );
  
        return {
          ...data,
          colorImage: colorImage as HTMLImageElement,
          maskImage: maskImage as HTMLImageElement,
          compositeCanvas: compositeCanvas as HTMLCanvasElement,
        };
      });
  
      // 2. Wait for ALL promises to finish
      const allLayers = await Promise.all(layerPromises);
      const allMaskLayer = allLayers.filter(layer => layer.type === 'all')[0];
      this._sketchImage = await loadImage(allMaskLayer?.colorImageSrc as string);
      this._allMaskImage = await loadImage(allMaskLayer?.maskImageSrc as string);

      this._layers = allLayers.filter(layer => layer.type !== 'all');
      this.setActiveLayer = 1

      this._loading = false
    })
  }

  set setActiveLayer(number: number) {
    this._activeLayer = this._layers.find(layer => layer.order === number)
  }

  get layers() {
    return this._layers
  }

  get loading() {
    return this._loading
  }

  set documentCanvas(canvas: HTMLCanvasElement) {
    this._documentCanvas = canvas
  }

  @action onDragActiveLayer(ev: MouseEvent, action: 'start' | 'drag' | 'stop') {
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
      this._activeLayer!.maskImage as HTMLImageElement,
      this._activeLayer!.colorImage as HTMLImageElement,
      this._activeLayer!.xpos,
      this._activeLayer!.ypos
    )
    this.drawLayersToCanvas()
    // this._activeLayer.xpos = ev.clientX
    // this._activeLayer.ypos = ev.clientY
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
    destinationCtx.drawImage(this._sketchImage as HTMLImageElement, 0, 0)
    destinationCtx.globalCompositeOperation = 'destination-in';
    destinationCtx.drawImage(this._allMaskImage as HTMLImageElement, 0, 0)
  }
}

export const layerStore = new LayerStore(LAYER_DATA)
