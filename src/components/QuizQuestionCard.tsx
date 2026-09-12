import Button from "./Button"
import type { Question, QuestionOption } from "../types/quiz"

type OptionListItemProps = {
    option: QuestionOption
} & React.ComponentProps<'li'>

function OptionListItem ({option, ...liProps } : OptionListItemProps){
    return(
    <li className="option-item" {...liProps}>
        <div>{option.label}</div> 
    </li>
    )
}
export default function QuizQuestionCard({question, onOptionSelect, OnBack} : QuestionCardProps){
    
    if (!question){
        return(
            <>
            No questions found.
            </>
        )
    }
    return(
        <div className="quiz-card">
            <div className="question-card">
                <div className="question-card-header">
                    <div className="question-card-question">
                        {question.text}
                    </div>
                </div>
                <div className="question-card-content">
                    <ul className="option-list">
                        {question.options.map((o) => (
                                <OptionListItem key ={o.label} option={o} onClick={()=>{
                                    setTimeout(() => onOptionSelect(o.label), 250)
                                }}/>
                            ))}

                    </ul>
                </div>
                <div className="question-card-footer">
                    <Button onClick={OnBack}>Back</Button>
                </div>
            </div>
        </div>
    )
}

type QuestionCardProps = {
    question : Question | undefined,
    onOptionSelect :(key:string)=> void
    OnBack : () => void

}

