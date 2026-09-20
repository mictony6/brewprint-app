import { useState } from 'react'
import './App.css'
import DebugSwitch from './components/DebugSwitch'
import Quiz from "./components/Quiz"
import DebugCareerPreview from './components/DebugCareerPreview'

function App() {
  const [debugCareer, setDebugCareer] = useState<string | null>(null)

  return (
    <>
     <div className="brewprint-hello">
      <div className="pattern"></div>
      {import.meta.env.DEV && debugCareer ? <DebugCareerPreview careerKey={debugCareer}/> : <Quiz/>}
      {import.meta.env.DEV && <DebugSwitch onCareerSelect={setDebugCareer}/>}
    </div>
    </>
  )
}

export default App
