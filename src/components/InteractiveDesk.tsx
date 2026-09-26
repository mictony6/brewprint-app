import Button from "./Button";
import Modal from "./Modal";
import { deskBackground, deskItems } from "../lib/deskItems"
import { useDeskPositions } from "../lib/deskPositionsStore"
import { useEffect, useState } from "react";
import type { CollectionItem } from "webflow-api/api/types/CollectionItem"
import type { CareerKitFields } from "../types/careerKit"
const homebrewLoc = "https://homebrew-e62593.webflow.io/career-kits/"

type CareerKitItem = CollectionItem & { fieldData: CareerKitFields }

export default function InteractiveDesk({ careerKey, onBack }: { careerKey: string, onBack: () => void }) {
  const positions = useDeskPositions()
  const [items, setItems] = useState<CareerKitItem[]>([])
  const [isFirstStepsOpen, setIsFirstStepsOpen] = useState(false)
  const itemsUrl = import.meta.env.DEV
    ? '/api/career-kits'
    : new URL('api/career-kits', import.meta.env.BASE_URL).toString()

  useEffect(() => {
    fetch(itemsUrl).then(res => res.json()).then(data => {
      setItems(data.items)
    })
  }, [])

  const currentItem = items.find(item => item.fieldData.slug === careerKey)
  console.log(currentItem)
  return (
    <>

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
                onClick={item.name === "lamp" ? () => setIsFirstStepsOpen(true) : undefined}
              />
            </div>
          )
        })}

        {isFirstStepsOpen && (
          <Modal>
            <Modal.Header>First Steps</Modal.Header>
            <Modal.Content>
              {currentItem
                ? <div dangerouslySetInnerHTML={{ __html: currentItem.fieldData["first-steps"] ?? "" }} />
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
