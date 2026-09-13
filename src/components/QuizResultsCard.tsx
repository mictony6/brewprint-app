import type { Career } from "../types/quiz"
import Button from "./Button"

function QuizResultsCard({career, onBackClick = ()=>{}} : QuizResultsCardPropTypes){
    return(
        <div className="quiz-card">
            <div className="quiz-content">
                {career.name}
                {career.blurb}
            </div>
            <Button onClick = {onBackClick}>Restart</Button>
        </div>
    )
}

interface QuizResultsCardPropTypes {
    career : Career,
    onBackClick: () => void
}

export default QuizResultsCard
