import quizHero from "../assets/pastelila_id-coffee-7382117_1280.png"
import Button from "./Button"


function QuizIntroCard({startButtonHandler  = () => {}}){



    return (
    <>
    <div className="quiz-card">
          <div className="quiz-content">
            <div className="quiz-intro">
              <div className="quiz-title">
                Find the digital career built for you.
              </div>
              <div className="quiz-subtitle">
                A short, thoughtful quiz — then a starter kit to help you begin. About 5
                minutes, 22 questions.
              </div>
            </div>
            <Button className="quiz-start-button" labelClassName="quiz-start-button__label" onClick={startButtonHandler}>
              Start Quiz
            </Button>
            <img
              className="quiz-hero-image"
              src= {quizHero}
            />
          </div>
        </div>
    </>
    )
}

export default QuizIntroCard