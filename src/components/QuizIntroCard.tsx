import quizHero from "../assets/homebrew-logo-mark-transparent.png"
import Button from "./Button"


function QuizIntroCard({startButtonHandler  = () => {}}){



    return (
    <div className="quiz-card">
          <div className="quiz-content">
            <div className="quiz-hero-wrapper">
              <img
                className="quiz-hero-image no-select"
                src= {quizHero}
              />
            </div>
            <div className="quiz-intro">
              <div className="quiz-title">
                Find the digital career built for you.
              </div>
              <div className="quiz-subtitle">
                A short, thoughtful quiz — then a starter kit to help you begin. About 5
                minutes, 22 questions.
              </div>
            </div>
            <Button className="quiz-start-button" labelClassName="quiz-start-button-label" onClick={startButtonHandler}>
              Start Quiz
            </Button>
          </div>
        </div>
    )
}

export default QuizIntroCard