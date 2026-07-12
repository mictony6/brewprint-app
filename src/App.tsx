import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="brewprint-hello">
      <h2>🔥 Brewprint lives here</h2>
      <button onClick={() => setCount(c => c + 1)}>
        Clicked {count} times
      </button>
    </div>
    </>
  )
}

export default App
