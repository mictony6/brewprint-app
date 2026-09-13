import { useState } from 'react'
import '../styles/Quiz.css'
import QuizIntroCard from './QuizIntroCard'
import questions from "../data/questions.json"
import careers from "../data/careers.json"
import QuizQuestionCard from './QuizQuestionCard'
import QuizResultsCard from './QuizResultsCard'
import type { Question } from '../types/quiz'


const typedQuestions = questions as Question[]

const QuizState = {
  INTRO: "INTRO",
  STARTED: "STARTED",
  RESULTS: "RESULTS",
} as const

type QuizState = typeof QuizState[keyof typeof QuizState]

const careerList : Array<string> = []
for (const cN in careers){
  careerList.push(cN)
}

const maxScores : Map<string, number> = new Map()
for (const career of careerList){
  let total = 0
  for (const question of typedQuestions){
    let best = 0
    for (const option of question.options){
      const score = option.scores[career] ?? 0
      best = Math.max(score, best)
    }
    total += best
  }
  maxScores.set(career, total)

}

// const initialScores : Array<object> = careerList.map((career) => ({ careerName: career, score: 0 }))

function Quiz() {
  const [quizCurrentState, setQuizCurrentState]  = useState<QuizState>(QuizState.INTRO)
  const [questionIndex, setQuestionIndex] = useState(0)
  // const [scores, setScores] = useState<Array<object>>(initialScores)
  
  function onStartButtonClick(){
    setQuizCurrentState(QuizState.STARTED)
  }

  function selectOption(key:string){
    nextQuestion()
  }

  function nextQuestion(){
    
    const nextIndex = questionIndex + 1
    if (nextIndex >= typedQuestions.length){
      setQuizCurrentState(QuizState.RESULTS)
      return
    }
    setQuestionIndex(nextIndex)
  }
  
  function lastQuestion(){
      const lastIndex = questionIndex - 1
    if (lastIndex < 0){
      setQuizCurrentState(QuizState.INTRO)
      return
    }
    setQuestionIndex(lastIndex)
  }
  
  function renderQuestions() {
    const question = typedQuestions[questionIndex]
    return <QuizQuestionCard 
    question={question} 
    onOptionSelect={selectOption} 
    OnBack={lastQuestion}
    />
  }

  function restartQuiz(){
    setQuizCurrentState(QuizState.INTRO)
    setQuestionIndex(0)
  }

  function renderQuizStep(){
    switch (quizCurrentState){
      case QuizState.INTRO:
        return <QuizIntroCard startButtonHandler={onStartButtonClick}/>
      case QuizState.STARTED:
        return renderQuestions()
      case QuizState.RESULTS:
        return <QuizResultsCard onBackClick={restartQuiz} />
    }
  }

  return (
      <section className='quiz-section'>
        {/* <div>
          ProgressBarHere
        </div> */}
        {renderQuizStep()}
      </section>
  )

}

export default Quiz
