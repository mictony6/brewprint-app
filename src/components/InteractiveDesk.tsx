import Button from "./Button";
import Modal from "./Modal";
import { deskBackground, deskItems } from "../lib/deskItems"
import { useDeskPositions } from "../lib/deskPositionsStore"
import { useEffect, useMemo, useState } from "react";
import type { CareerKitItem } from "../lib/careerKits"
import { fetchResources, type ResourceItem } from "../lib/resources"
import { parseFaqs } from "../lib/parseFaqs"
const homebrewLoc = "https://homebrew-e62593.webflow.io/career-kits/"

const DUST_PARTICLE_COUNT = 14
const DUST_PARTICLE_NEAR_COUNT = 5
const EMPTY_STATE = <p>Nothing here yet — check back soon.</p>

function kebabToTitleCase(slug: string): string {
  return slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")
}

function FaqList({ entries }: { entries: ReturnType<typeof parseFaqs> }) {
  if (entries.length === 0) return EMPTY_STATE
  return entries.map((faq) => (
    <div key={faq.question}>
      <h3>{faq.question}</h3>
      <p>{faq.answer}</p>
    </div>
  ))
}

function ResourceLinkList({ resources }: { resources: ResourceItem[] }) {
  if (resources.length === 0) return EMPTY_STATE
  return (
    <ul>
      {resources.map((resource) => <ResourceLink key={resource.id} resource={resource} />)}
    </ul>
  )
}

function ResourceLink({ resource }: { resource: ResourceItem }) {
  if (!resource.fieldData.link) return <li>{resource.fieldData.name}</li>
  return <li><a href={resource.fieldData.link} target="_blank" rel="noreferrer">{resource.fieldData.name}</a></li>
}

export default function InteractiveDesk({ careerKey, careerKitItem, onBack }: { careerKey: string, careerKitItem: CareerKitItem | undefined, onBack: () => void }) {
  const positions = useDeskPositions()
  const [openItemName, setOpenItemName] = useState<string | null>(null)
  const [resources, setResources] = useState<ResourceItem[]>([])

  useEffect(() => {
    fetchResources().then(setResources)
  }, [])

  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources]
  )

  const openItem = deskItems.find((item) => item.name === openItemName)
  const openItemValue = openItem ? careerKitItem?.fieldData[openItem.opensField] : undefined
  const faqEntries = openItem?.opensField === "faqs" ? parseFaqs(openItemValue as string) : []
  const resourceEntries = Array.isArray(openItemValue)
    ? openItemValue.map((id) => resourcesById.get(id)).filter((resource): resource is ResourceItem => !!resource)
    : []

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
                onClick={() => setOpenItemName(item.name)}
              />
            </div>
          )
        })}

        {openItem && (
          <Modal>
            <Modal.Header>{openItem.modalTitle}</Modal.Header>
            <Modal.Content>
              {!careerKitItem ? (
                <p>Loading…</p>
              ) : openItem.opensField === "faqs" ? (
                <FaqList entries={faqEntries} />
              ) : resourceEntries.length > 0 ? (
                <ResourceLinkList resources={resourceEntries} />
              ) : typeof openItemValue === "string" && openItemValue ? (
                <div dangerouslySetInnerHTML={{ __html: openItemValue }} />
              ) : (
                EMPTY_STATE
              )}
            </Modal.Content>
            <Modal.Footer>
              <Button onClick={() => setOpenItemName(null)} labelClassName="modal-close-button-label">Okay</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>

    </div>
    <div className="desk-panel">
      <Button onClick={onBack} labelClassName="quiz-start-button-label">Back</Button>
      <div className="panel-group">
        <h2>{kebabToTitleCase(careerKey)}</h2>
        <p>Welcome to your personal desk! <br/> Try clicking on an object.</p>

      </div>
      <a href={homebrewLoc+careerKey} target="_self" className="read-more-anchor" >Read more...</a>
    </div>
    <div className="desk-controls">
      <Button onClick={onBack} labelClassName="quiz-start-button-label">Back</Button>
    </div>
    </>
  )
}
