import { observer } from 'mobx-react-lite'
import { Document } from './Document'
import { Layers } from './Layers'

const App = observer(() => {

  return (
    <div className="flex w-screen h-screen">
      <div className="w-[300px] h-full">
        <Layers />
      </div>
      <div className="flex-1 h-full">
        <Document />
      </div>
    </div>
  )
})

export default App