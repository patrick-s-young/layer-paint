import { observer } from 'mobx-react-lite'
import { layerStore } from '@/stores/LayerStore'


export const LayerRail = observer(() => {


  const handleColorClick = (id: string) => {
    layerStore.setEditMode('color')
    layerStore.setActiveLayer(id)
  }
  
  const handleMaskClick = (id: string) => {
    layerStore.setEditMode('mask')
    layerStore.setActiveLayer(id)
  }

  return (
    <>
    {!layerStore.loading && layerStore.redraw > 0 && (
    <div className="box-border flex-1 flex flex-col h-full bg-gray-100 border-4 border-gray-400 max-w-[250px] gap-4 p-4 overflow-y-auto">
      {[...layerStore.layers].reverse().map(layer => (
        
        <div key={layer.id} className={`box-border flex gap-4 bg-gray-200 p-4 rounded-lg ${layerStore.activeLayer?.id === layer.id ? 'border-4 border-gray-400' : ''}`}>
          <div className="text-xs text-gray-500 font-weight-800 text-[24px] content-center">{layer.order}</div>
          <button
            className={`rounded-lg cursor-pointer bg-white ${layerStore.activeLayer?.id === layer.id && layerStore.editMode === 'mask' ? 'border-4 border-blue-400' : ''}`}
            onClick={() => handleMaskClick(layer.id)}
          >
            <img src={layer.maskCanvas?.toDataURL()} className="size-16 border border-gray-400" />
          </button>
          <button
            className={`rounded-lg cursor-pointer ${layerStore.activeLayer?.id === layer.id && layerStore.editMode === 'color' ? 'border-4 border-blue-400' : ''}`}
            onClick={() => handleColorClick(layer.id)}
          >
              <img src={layer.colorImageSrc} className="size-16" />
            </button>
            
        </div>
      ))}
    </div>
    )}
    </>
)}
)