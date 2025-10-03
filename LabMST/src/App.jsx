import React from 'react'
import Todo from './components/todo'
import { ShowCard } from './components/showcard'
const App = () => {
  const [isTodoVisible, setIsTodoVisible] = React.useState(true);
  return (
    <div className='min-h-screen w-full flex flex-col items-center py-10 px-4 bg-gray-100'>
      <button onClick={() => setIsTodoVisible(!isTodoVisible)} className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
        Toggle View
      </button>
      {isTodoVisible ? (
        <Todo />
      ) : (
        <ShowCard />
      )}
    </div>
  )
}

export default App;