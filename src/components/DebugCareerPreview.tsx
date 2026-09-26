import { useState } from 'react'
import careers from "../data/careers.json"
import { type Career } from '../types/quiz'
import QuizResultsCard from './QuizResultsCard'
import InteractiveDesk from './InteractiveDesk'
import EditableDesk from './EditableDesk'
import { useDeskEditMode } from '../lib/deskPositionsStore'

const typedCareers = new Map(Object.entries(careers)) as Map<string, Career>

function DebugCareerPreview({ careerKey }: { careerKey: string }) {
  const [showDesk, setShowDesk] = useState(false)
  const editMode = useDeskEditMode()
  const career = typedCareers.get(careerKey)!

  return (
    <section className='quiz-section'>
      {showDesk
        ? editMode
          ? <EditableDesk careerKey={careerKey} onBack={() => setShowDesk(false)} />
          : <InteractiveDesk careerKey={careerKey} onBack={() => setShowDesk(false)} />
        : <QuizResultsCard career={career} onRestart={() => setShowDesk(false)} onViewDesk={() => setShowDesk(true)} />}
    </section>
  )
}

export default DebugCareerPreview
