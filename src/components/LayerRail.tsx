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

  const handleEditMaskMode = (ev: MouseEvent, mode: 'draw' | 'erase') => {
    ev.preventDefault()
    ev.stopPropagation()
    layerStore.setEditMaskMode(mode)
  }

  return (
    <>
    {!layerStore.loading && layerStore.redraw > 0 && (
      
      <div className="box-border flex-1 flex flex-col h-full bg-gray-100 border-4 border-gray-400 max-w-[250px] gap-4 p-4 overflow-y-auto">
        <div className="box-border flex flex-col gap-4 bg-gray-200 p-2 rounded-lg min-h-[100px]">
          <button 
            onClick={(ev) => handleEditMaskMode(ev,'draw')} 
            className={`border-4 
              ${layerStore.editMaskMode === 'draw' ? 'border-4 border-blue-400 bg-white' : 'border-gray-300'} 
              ${layerStore.editMode !== 'mask' ? 'opacity-20' : 'opacity-100'}`}
            disabled={layerStore.editMode !== 'mask'}
          >
            Paint Mask          
          </button>
          <button 
            onClick={(ev) => handleEditMaskMode(ev, 'erase')} 
            className={`border-4 
              ${layerStore.editMaskMode === 'erase' ? 'border-4 border-blue-400 bg-white' : 'border-gray-300'} 
              ${layerStore.editMode !== 'mask' ? 'opacity-20' : 'opacity-100'}`}
            disabled={layerStore.editMode !== 'mask'}
          >
            Erase Mask
          </button>
      </div>
      
      {[...layerStore.layers].reverse().map(layer => (
        
        <div key={layer.id} className={`box-border flex gap-4 bg-gray-200 p-4 rounded-lg ${layerStore.activeLayer?.id === layer.id ? 'border-4 border-gray-400' : ''}`}>
          <div className="text-xs text-gray-500 font-weight-800 text-[24px] content-center w-8 text-end">{layer.order}</div>
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