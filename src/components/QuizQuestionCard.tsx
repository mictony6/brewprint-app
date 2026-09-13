import Button from "./Button"
import type { Question, QuestionOption } from "../types/quiz"
import { useRef } from "react"

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
    const isTransitiong = useRef(false)

    function optionSelectHandler(label:string){
        console.log(isTransitiong.current)
        if (isTransitiong.current) return
        isTransitiong.current = true
        navigator.vibrate(4)

        setTimeout(() => {
            isTransitiong.current = false
            onOptionSelect(label)
            navigator.vibrate(4)
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
                    <div className="question-card-question">
                        {question.text}
                    </div>
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

