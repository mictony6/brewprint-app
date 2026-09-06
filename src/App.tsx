import './App.css'
import quizHero from "./assets/pastelila_id-coffee-7382117_1280.png"

function App() {

  function handleDroplet(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const originX = e.clientX - rect.left
    const originY = e.clientY - rect.top
    const distX = Math.max(originX, rect.width - originX)
    const distY = Math.max(originY, rect.height - originY)
    const size = Math.sqrt(distX * distX + distY * distY) * 2
    const droplet = document.createElement('span')
    droplet.className = 'droplet'
    droplet.style.width = droplet.style.height = `${size}px`
    droplet.style.left = `${originX - size / 2}px`
    droplet.style.top = `${originY - size / 2}px`
    button.appendChild(droplet)
    droplet.addEventListener('animationend', () => droplet.remove())
  }

  return (
    <>
     <div className="brewprint-hello">
      <section className='quiz-section'>
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
            <button className="btn-primary quiz-start-button" type="button" onClick={handleDroplet}>
              <span className="quiz-start-button__label">Start Quiz</span>
            </button>
            <img
              className="quiz-hero-image"
              src= {quizHero}
            />
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default App
