import Button from "./Button";
import { deskBackground, deskItems } from "../lib/deskItems"
import { useDeskPositions } from "../lib/deskPositionsStore"
const homebrewLoc = "https://homebrew-e62593.webflow.io/career-kits/"

export default function InteractiveDesk({ careerKey, onBack }: { careerKey: string, onBack: () => void }) {
  const positions = useDeskPositions()

  return (
    <>
    {/* <div className="desk-controls">
      <Button onClick={onBack} labelClassName="quiz-start-button-label">Back</Button>
    </div> */}
    <div className="interactive-desk-wrapper">

      <div className="indesk-background">
        <img id="desk-bg" src={deskBackground} alt="background" />

        {deskItems.map((item) => {
          const pos = positions[item.name]
          return (
            <div
              key={item.name}
              style={{ position: "absolute", top: `${pos.top}%`, left: `${pos.left}%`, width: `${pos.width}%`, height: `${pos.height}%` }}
            >
              <img
                src={item.src}
                className="desk-item"
                data-item={item.name}
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
              />
            </div>
          )
        })}
      </div>

    </div>
    <div className="desk-panel">
      <Button onClick={onBack} labelClassName="quiz-start-button-label">Back</Button>
        <div className="panel-group">
      <h2>Interactive Desk</h2>
      <p>Welcome to your personal desk! <br/> Try clicking on an object.</p>

        </div>
      <a href={homebrewLoc+careerKey} target="_blank" className="read-more-anchor" >Read more...</a>

    </div>

    </>
  )
}
