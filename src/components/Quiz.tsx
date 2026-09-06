import { useState } from 'react'
import '../styles/Quiz.css'
import QuizIntroCard from './QuizIntroCard'
import questions from "../data/questions.json"
import careers from "../data/careers.json"

const QuizState = {
  INTRO: "INTRO",
  STARTED: "STARTED",
  RESULTS: "RESULTS",
} as const

type QuizState = typeof QuizState[keyof typeof QuizState]

let careerList : Array<string> = []
for (const careerName in careers){
  console.log(careerName)
}

function Quiz() {
  let [quizCurrentState, setQuizCurrentState]  = useState(QuizState.INTRO)
  let [questionIndex, setQuestionIndex] = useState(0)
  let [scores, setScores] = useState({})


  function onStartButtonClick(){
      console.log("clicked")
  }

  return (
    <>
     <div className="brewprint-hello">
      <section className='quiz-section'>
        <QuizIntroCard startButtonHandler ={onStartButtonClick}/>
      </section>
    </div>
    </>
  )
}

export default Quiz
