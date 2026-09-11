import Button from "./Button"

function QuizQuestionCard({question = "Failed to get question", onOptionSelect = ()=>{}, onNextPressed = () =>{}} : QuestionCardProps){
    return(
        <>
        <div className="question-card-header">
            <div className="question-card-question">
                {question}
            </div>
        </div>
        <div className="question-card-content">

        </div>
        <div className="question-card-footer">
            <Button onClick={onNextPressed}>Next</Button>
        </div>
        </>
    )
}

type QuestionCardProps = {
    question : string,
    onOptionSelect :()=> void
    onNextPressed : () => void

}
export default QuizQuestionCard
