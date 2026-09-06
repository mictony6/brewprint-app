import { useState } from 'react'
import '../styles/Quiz.css'
import QuizIntroCard from './QuizIntroCard'
import questions from "../data/questions.json"
import careers from "../data/careers.json"

type quizState = "INTRO" | "STARTED" | "RESULTS"

let careerList : Array<string> = []
for (const careerName in careers){
  console.log(careerName)
}

function Quiz() {
  let [quizCurrentState, setQuizCurrentState]  = useState(quizState.INTRO)
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
