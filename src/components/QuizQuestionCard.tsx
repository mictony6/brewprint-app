import Button from "./Button"
import type { Question, QuestionOption } from "../types/quiz"
import { useRef } from "react"

type OptionListItemProps = {
    option: QuestionOption
} & React.ComponentProps<'li'>

function OptionListItem ({option, ...liProps } : OptionListItemProps){
    return(
    <li className="option-item no-select" {...liProps}>
        <div>{option.label}</div> 
    </li>
    )
}


export default function QuizQuestionCard({question, onOptionSelect, OnBack , onRestart} : QuestionCardProps){
    const isTransitiong = useRef(false)

    function optionSelectHandler(label:string){
        if (isTransitiong.current) return
        isTransitiong.current = true
        navigator.vibrate(4)

        setTimeout(() => {
            isTransitiong.current = false
            onOptionSelect(label)
        }, 250)
    }

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
                    <h3 className="question-card-question">
                        {question.text}
                    </h3>
                </div>
                <div className="question-card-content">
                    <ul className="option-list">
                        {question.options.map((o) => (
                            <OptionListItem key ={o.label} option={o} onClick={()=>optionSelectHandler(o.label)}/>
                        ))} 

                    </ul>
                </div>
                <div className="question-card-footer">
                    <Button onClick={OnBack} labelClassName="quiz-start-button-label">Back</Button>
                    <Button onClick={onRestart} variant="secondary" labelClassName="quiz-restart-button-label">Restart</Button>
                </div>
            </div>
        </div>
    )
}

type QuestionCardProps = {
    question : Question | undefined,
    onOptionSelect :(key:string)=> void
    OnBack : () => void,
    onRestart : () => void

}

