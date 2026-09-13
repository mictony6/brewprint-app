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
            <Button onClick = {onRestart} labelClassName="quiz-restart-button-label">Restart</Button>
            <Button onClick={() => window.location.href = homebrewLoc + career.slug} variant= "secondary" labelClassName="quiz-restart-button-label" > Read More</Button>
        </div>
    )
}

interface QuizResultsCardPropTypes {
    career : Career,
    onRestart: () => void,
}

export default QuizResultsCard
