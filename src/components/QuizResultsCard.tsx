import Button from "./Button"

function QuizResultsCard({onBackClick = ()=>{}}){
    return(
        <div className="quiz-card">
            <div className="quiz-content">
                This is the result
            </div>
            <Button onClick = {onBackClick}>Restart</Button>
        </div>
    )
}

export default QuizResultsCard
