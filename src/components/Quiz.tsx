import { useEffect, useRef, useState } from 'react'
import '../styles/Quiz.css'
import QuizIntroCard from './QuizIntroCard'
import questions from "../data/questions.json"
import careers from "../data/careers.json"
import QuizQuestionCard from './QuizQuestionCard'
import QuizResultsCard from './QuizResultsCard'
import { type Career, type QuestionOption, type Question } from '../types/quiz'
import { getCareerList, computeMaxScores, computeScores, getTopResult } from '../lib/scoring'
import { fetchCareerKitBySlug, type CareerKitItem } from '../lib/careerKits'
import ProgressBar from './ProgressBar'
import InteractiveDesk from './InteractiveDesk'
import { posthog } from 'posthog-js'


const typedQuestions = questions as Question[]
const typedCareers = new Map(Object.entries(careers)) as Map<string, Career>
const QuizState = {
  INTRO: "INTRO",
  STARTED: "STARTED",
  RESULTS: "RESULTS",
  DESK: "DESK",
} as const

type QuizState = typeof QuizState[keyof typeof QuizState]

const careerList = getCareerList(careers)
const maxScores = computeMaxScores(typedQuestions, careerList)

function getInitialQuizState(): QuizState {
  const saved = sessionStorage.getItem("quizState") as QuizState | null
  return saved ?? QuizState.INTRO
}

function getInitialQuestionIndex(): number {
  const saved = sessionStorage.getItem("questionIndex")
  return saved ? Number(saved) : 0
}

function getInitialAnswers(): QuestionOption[] {
  const saved = sessionStorage.getItem("answers")
  return saved ? JSON.parse(saved) : []
}

function getInitialResults(): Map<string, number> | null {
  const state = getInitialQuizState()
  if (state !== QuizState.RESULTS && state !== QuizState.DESK) return null
  return computeScores(getInitialAnswers(), careerList)
}

function getInitialAttemptID(): string | null {
  return sessionStorage.getItem("brewprintAttemptID")
}

function Quiz() {
  const [quizCurrentState, setQuizCurrentState]  = useState<QuizState>(getInitialQuizState)
  const [questionIndex, setQuestionIndex] = useState(getInitialQuestionIndex)
  const [results, setResults] = useState<Map<string, number> | null>(getInitialResults)
  const [careerKitItem, setCareerKitItem] = useState<CareerKitItem | undefined>(undefined)
  const answers = useRef<Array<QuestionOption>>(getInitialAnswers())
  const attemptID = useRef<string | null>(getInitialAttemptID())

  useEffect(()=>{
    sessionStorage.setItem("quizState", quizCurrentState)
    sessionStorage.setItem("questionIndex", questionIndex.toString())
    sessionStorage.setItem("answers", JSON.stringify(answers.current))
  },[quizCurrentState, questionIndex])

  useEffect(() => {
    if (!results) return
    const topResult = getTopResult(results, maxScores)
    const topCareer = typedCareers.get(topResult[0])!
    fetchCareerKitBySlug(topCareer.slug).then(setCareerKitItem)
  }, [results])

  function onStartButtonClick(){
    const isRestart = sessionStorage.getItem("hasStartedQuiz") === "true"
    attemptID.current = crypto.randomUUID()
    sessionStorage.setItem("brewprintAttemptID", attemptID.current)
    sessionStorage.setItem("hasStartedQuiz", "true")

    posthog.capture("quiz_started", {
      quiz_attempt_id: attemptID.current,
      is_restart: isRestart,
    })
    setQuizCurrentState(QuizState.STARTED)
  }

  function selectOption(key:string){
    const question = typedQuestions[questionIndex]
    const option = question.options.find((o) => o.label === key)
    if (option){
      answers.current.push(option)
    }
    posthog.capture("quiz_question_answered", {
      quiz_attempt_id: attemptID.current,
      question_index: questionIndex,
      question_id: question.id,
    })
    nextQuestion()
  }

  function viewDesk(){
    posthog.capture("desk_viewed", {
      quiz_attempt_id: attemptID.current,
    })
    setQuizCurrentState(QuizState.DESK)
  }

  function leaveDesk(){
    setQuizCurrentState(QuizState.RESULTS)
  } 

  function nextQuestion(){
    const nextIndex = questionIndex + 1
    if (nextIndex >= typedQuestions.length){
      const finalResults = computeScores(answers.current, careerList)
      const topResult:[string, number] = getTopResult(finalResults, maxScores)

      posthog.capture("quiz_completed", {
        quiz_attempt_id: attemptID.current,
        top_career: topResult[0],
      })

      setResults(finalResults)
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
    return (

      <>
      <ProgressBar steps={typedQuestions.length} currentIndex ={questionIndex} />
      <QuizQuestionCard 
      question={question} 
      onOptionSelect={selectOption} 
      OnBack={lastQuestion}
      onRestart={restartQuiz}
      />
      </>
    )
  }

  function restartQuiz(){
    setQuizCurrentState(QuizState.INTRO)
    setQuestionIndex(0)
    setResults(null)
    answers.current = []
  }

  function renderResults(){
    if (!results) return null
    const topResult:[string, number] = getTopResult(results, maxScores)
    const careerResult = typedCareers.get(topResult[0])!
    return <QuizResultsCard career ={careerResult} onRestart={restartQuiz} onViewDesk={viewDesk} />
  }

  function renderDesk(){
    if (!results) return null
    const topResult:[string, number] = getTopResult(results, maxScores)
    const topCareer : Career = typedCareers.get(topResult[0])!
    return <InteractiveDesk careerKey = {topCareer.slug} careerKitItem={careerKitItem} onBack={leaveDesk}></InteractiveDesk>
  }

  function renderQuizStep(){
    switch (quizCurrentState){
      case QuizState.INTRO:
        return <QuizIntroCard startButtonHandler={onStartButtonClick}/>
      case QuizState.STARTED:
        return renderQuestions()
      case QuizState.RESULTS:
        return renderResults()
      case QuizState.DESK:
        return renderDesk()
    }
  }

  return (
      <section className='quiz-section'>
        {renderQuizStep()}
      </section>
  )

}

export default Quiz
