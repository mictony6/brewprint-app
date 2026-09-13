import { RotateCcw } from "lucide-react"
import type { Career } from "../types/quiz"
import Button from "./Button"
const homebrewLoc = "https://homebrew-e62593.webflow.io/career-kits/"
function QuizResultsCard({career, onRestart} : QuizResultsCardPropTypes){

    return(
        <div className="quiz-card">
            <div className="quiz-content">
                <h1 className="result-career-name">
                {career.name}
                </h1>
                <p className="result-blurb">
                {career.blurb}
                </p>
            </div>
            <div className="result-buttons">

                <Button onClick={() => window.location.href = homebrewLoc + career.slug} variant= "secondary" labelClassName="quiz-restart-button-label" > Read More</Button>
                <Button onClick = {onRestart} variant="secondary" className="icon-button" aria-label="Restart">
                    <RotateCcw size={20} />
                </Button>
                <Button onClick = {()=>{}} variant="primary" labelClassName="quiz-restart-button-label">View Interactive Desk</Button>

            </div>
        </div>
    )
}

interface QuizResultsCardPropTypes {
    career : Career,
    onRestart: () => void,
}

export default QuizResultsCard
