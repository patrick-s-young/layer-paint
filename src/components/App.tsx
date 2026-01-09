import { observer } from 'mobx-react-lite'
import { Document } from './Document'
import { LayerRail } from './LayerRail'

const App = observer(() => {

  return (
    <div className="flex w-screen h-screen">
      <LayerRail />
      <Document />
    </div>
  )
})

export default App