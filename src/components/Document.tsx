
import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { layerStore } from '@/stores/LayerStore'

const CANVAS_SIZE = {width: 444, height: 474}
const BRUSH_SIZE = 16


export type LayerProps = {
  id: string
  order: number
  colorImageSrc?: string
  colorHex?: string
  maskImageSrc: string
  type: 'all' | 'area'
  colorImage: HTMLImageElement | undefined
  maskImage: HTMLImageElement | undefined
  compositeCanvas: HTMLCanvasElement | undefined
}


export const Document = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)


  useEffect(() => {
    layerStore.setDocumentCanvas(canvasRef.current as HTMLCanvasElement)
  }, [canvasRef.current])



  useEffect(() => {
    if (layerStore.loading) return
      layerStore.drawLayersToCanvas()
  }, [layerStore.loading])





  return (
  
    <div className="relativeflex h-full flex-1" style={{ backgroundImage: 'repeating-conic-gradient(#dfdfdf 0% 25%, transparent 0% 50%, #dfdfdf 0% 75%, transparent 0% 100%)',backgroundSize: '20px 20px'}}>

      <div 
        className="absolute top-0 left-[500px] w-full h-full"
        onMouseDown={(ev) => layerStore.onDragActiveLayer(ev, 'start')}
        onMouseMove={(ev) => layerStore.onDragActiveLayer(ev, 'drag')}
        onMouseUp={(ev) => layerStore.onDragActiveLayer(ev, 'stop')}
      >
            <canvas ref={canvasRef} className={`flex h-full `} width={CANVAS_SIZE.width} height={CANVAS_SIZE.height} />
      </div>

    </div>
  )
})