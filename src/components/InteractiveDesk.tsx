import Button from "./Button";
import Modal from "./Modal";
import { deskBackground, deskItems } from "../lib/deskItems"
import { useDeskPositions } from "../lib/deskPositionsStore"
import { useState } from "react";
import type { CareerKitItem } from "../lib/careerKits"
const homebrewLoc = "https://homebrew-e62593.webflow.io/career-kits/"

const DUST_PARTICLE_COUNT = 14
const DUST_PARTICLE_NEAR_COUNT = 5

export default function InteractiveDesk({ careerKey, careerKitItem, onBack }: { careerKey: string, careerKitItem: CareerKitItem | undefined, onBack: () => void }) {
  const positions = useDeskPositions()
  const [isFirstStepsOpen, setIsFirstStepsOpen] = useState(false)

  return (
    <>

    <div className="interactive-desk-wrapper">

      <div className="indesk-background">
        <img id="desk-bg" src={deskBackground} alt="background" />

        <div className="desk-particles" aria-hidden="true">
          {Array.from({ length: DUST_PARTICLE_COUNT }).map((_, i) => (
            <span key={i} className="desk-particle" />
          ))}
        </div>

        <div className="desk-particles-near" aria-hidden="true">
          {Array.from({ length: DUST_PARTICLE_NEAR_COUNT }).map((_, i) => (
            <span key={i} className="desk-particle-near" />
          ))}
        </div>

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
                onClick={item.name === "lamp" ? () => setIsFirstStepsOpen(true) : undefined}
              />
            </div>
          )
        })}

        {isFirstStepsOpen && (
          <Modal>
            <Modal.Header>First Steps</Modal.Header>
            <Modal.Content>
              {careerKitItem
                ? <div dangerouslySetInnerHTML={{ __html: careerKitItem.fieldData["first-steps"] ?? "" }} />
                : <p>Loading…</p>}
            </Modal.Content>
            <Modal.Footer>
              <Button onClick={() => setIsFirstStepsOpen(false)} labelClassName="modal-close-button-label">Close</Button>
            </Modal.Footer>
          </Modal>
        )}
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
    <div className="desk-controls">
      <Button onClick={onBack} labelClassName="quiz-start-button-label">Back</Button>
    </div>
    </>
  )
}
