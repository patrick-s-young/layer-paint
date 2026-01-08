import { observer } from 'mobx-react-lite'
import { layerStore } from '@/stores/LayerStore'


export const Layers = observer(() => {

  const handleColorClick = (id: string) => {
    layerStore.editMode = 'color'
    layerStore.setActiveLayer(id)
  }
  


  return (
    <div className="box-border flex-1 flex flex-col h-full bg-gray-100 border-4 border-gray-400 max-w-[300px] gap-8 p-8 overflow-y-auto">
      {layerStore.layers.map(layer => (
        <div key={layer.id} className={`box-border flex gap-4 bg-gray-200 p-4 rounded-lg ${layerStore.activeLayer?.id === layer.id ? 'border-4 border-gray-400' : ''}`}>
          <button
            className="bg-white cursor-pointer"
          >
            <img src={layer.maskImageSrc} className="size-24" />
          </button>
          <button
            className={`rounded-lg cursor-pointer ${layerStore.activeLayer?.id === layer.id && layerStore.editMode === 'color' ? 'border-4 border-blue-400' : ''}`}
            onClick={() => handleColorClick(layer.id)}
          >
              <img src={layer.colorImageSrc} className="size-24" />
            </button>
        </div>
      ))}
    </div>
  )
})