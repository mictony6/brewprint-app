import { useRef, useState } from 'react'
import '../styles/Quiz.css'
import QuizIntroCard from './QuizIntroCard'
import questions from "../data/questions.json"
import careers from "../data/careers.json"
import QuizQuestionCard from './QuizQuestionCard'
import QuizResultsCard from './QuizResultsCard'
import { type QuestionOption, type Question } from '../types/quiz'


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

function Quiz() {
  const [quizCurrentState, setQuizCurrentState]  = useState<QuizState>(QuizState.INTRO)
  const [questionIndex, setQuestionIndex] = useState(0)
  const answers = useRef<Array<QuestionOption>>([])

  function onStartButtonClick(){
    setQuizCurrentState(QuizState.STARTED)
  }

  function selectOption(key:string){
    const question = typedQuestions[questionIndex]
    const option = question.options.find((o) => o.label === key)
    if (option){
      answers.current.push(option)
    }
    console.log(answers.current)
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
    answers.current.pop()

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
    answers.current = []
  }

  function renderResults(){
    return <QuizResultsCard onBackClick={restartQuiz} />
  }

  function renderQuizStep(){
    switch (quizCurrentState){
      case QuizState.INTRO:
        return <QuizIntroCard startButtonHandler={onStartButtonClick}/>
      case QuizState.STARTED:
        return renderQuestions()
      case QuizState.RESULTS:
        return renderResults()
    }
  }

  return (
      <section className='quiz-section'>
        {renderQuizStep()}
      </section>
  )

}

export default Quiz
