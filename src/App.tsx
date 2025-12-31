import { observer } from 'mobx-react-lite'
import AppStore from './stores/AppStore'

const App = observer(() => {

  const handleIncrement = () => {
    AppStore.increment()
  }

  const handleDecrement = () => {
    AppStore.decrement()
  }

  return (
    <div className="flex flex-col gap-16 items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">Layer Paint</h1>
      <div className="flex gap-12">
        <button 
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" 
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button 
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600" 
          onClick={handleDecrement}
        >
          Decrement
        </button>
      </div>
      <p className="text-2xl">
        Count: {AppStore.count}
      </p>
    </div>
  )
})

export default App