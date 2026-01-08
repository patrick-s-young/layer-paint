import { observer } from 'mobx-react-lite'
import { Document } from './Document'
import { Layers } from './Layers'

const App = observer(() => {

  return (
    <div className="flex w-screen h-screen">
      <Layers />
      <Document />
    </div>
  )
})

export default App