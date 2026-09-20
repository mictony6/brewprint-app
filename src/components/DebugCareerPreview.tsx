import { useState } from 'react'
import careers from "../data/careers.json"
import { type Career } from '../types/quiz'
import QuizResultsCard from './QuizResultsCard'
import InteractiveDesk from './InteractiveDesk'
import { useDeskEditMode } from '../lib/deskPositionsStore'

const typedCareers = new Map(Object.entries(careers)) as Map<string, Career>

function DebugCareerPreview({ careerKey }: { careerKey: string }) {
  const [showDesk, setShowDesk] = useState(false)
  const editMode = useDeskEditMode()
  const career = typedCareers.get(careerKey)!

  return (
    <section className='quiz-section'>
      {showDesk
        ? <InteractiveDesk careerKey={careerKey} onBack={() => setShowDesk(false)} editable={editMode} />
        : <QuizResultsCard career={career} onRestart={() => setShowDesk(false)} onViewDesk={() => setShowDesk(true)} />}
    </section>
  )
}

export default DebugCareerPreview
