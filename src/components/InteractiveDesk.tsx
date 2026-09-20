import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import Button from "./Button";
import bg from "../assets/desk_assets_light/All.png"
import books from "../assets/desk_assets_light/books.png"
import coffee from "../assets/desk_assets_light/coffee.png"
import lamp from "../assets/desk_assets_light/lamp.png"
import notebook from "../assets/desk_assets_light/notebook.png"
import contract from "../assets/desk_assets_light/contract.png"
import laptop from "../assets/desk_assets_light/laptop.png"
import { useDeskPositions, deskPositionsStore, type DeskItemPosition } from "../lib/deskPositionsStore"

const items = [
  { name: "books", src: books },
  { name: "coffee", src: coffee },
  { name: "lamp", src: lamp },
  { name: "notebook", src: notebook },
  { name: "contract", src: contract },
  {name: "laptop", src: laptop}
]

const MIN_SIZE_PERCENT = 3

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function InteractiveDesk({ careerKey, onBack, editable = false }: { careerKey: string, onBack: () => void, editable?: boolean }) {
  // Positioning controls must never be reachable outside local dev, no matter what a caller passes in.
  const isEditable = editable && import.meta.env.DEV
  const backgroundRef = useRef<HTMLDivElement>(null)
  const positions = useDeskPositions()
  const dragState = useRef<{ name: string, offsetX: number, offsetY: number } | null>(null)
  const resizeState = useRef<{ name: string, startX: number, startY: number, start: DeskItemPosition } | null>(null)

  function getContainerRect() {
    return backgroundRef.current?.getBoundingClientRect()
  }

  function handleDragMove(e: MouseEvent) {
    const drag = dragState.current
    const rect = getContainerRect()
    if (!drag || !rect) return
    const current = positions[drag.name]
    const leftPercent = clamp(((e.clientX - drag.offsetX - rect.left) / rect.width) * 100, 0, 100 - current.width)
    const topPercent = clamp(((e.clientY - drag.offsetY - rect.top) / rect.height) * 100, 0, 100 - current.height)
    deskPositionsStore.setItemPosition(drag.name, { ...current, top: topPercent, left: leftPercent })
  }

  function handleDragEnd() {
    dragState.current = null
    window.removeEventListener("mousemove", handleDragMove)
    window.removeEventListener("mouseup", handleDragEnd)
    document.body.classList.remove("no-select")
  }

  function handleDragStart(e: ReactMouseEvent<HTMLImageElement>, name: string) {
    if (!isEditable) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragState.current = { name, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top }
    document.body.classList.add("no-select")
    window.addEventListener("mousemove", handleDragMove)
    window.addEventListener("mouseup", handleDragEnd)
  }

  function handleResizeMove(e: MouseEvent) {
    const resize = resizeState.current
    const rect = getContainerRect()
    if (!resize || !rect) return
    const deltaXPercent = ((e.clientX - resize.startX) / rect.width) * 100
    const deltaYPercent = ((e.clientY - resize.startY) / rect.height) * 100
    const width = clamp(resize.start.width + deltaXPercent, MIN_SIZE_PERCENT, 100 - resize.start.left)
    const height = clamp(resize.start.height + deltaYPercent, MIN_SIZE_PERCENT, 100 - resize.start.top)
    deskPositionsStore.setItemPosition(resize.name, { ...resize.start, width, height })
  }

  function handleResizeEnd() {
    resizeState.current = null
    window.removeEventListener("mousemove", handleResizeMove)
    window.removeEventListener("mouseup", handleResizeEnd)
    document.body.classList.remove("no-select")
  }

  function handleResizeStart(e: ReactMouseEvent<HTMLDivElement>, name: string) {
    if (!isEditable) return
    e.preventDefault()
    e.stopPropagation()
    resizeState.current = { name, startX: e.clientX, startY: e.clientY, start: positions[name] }
    document.body.classList.add("no-select")
    window.addEventListener("mousemove", handleResizeMove)
    window.addEventListener("mouseup", handleResizeEnd)
  }

  return (
    <div className="interactive-desk-wrapper">
      <div className="indesk-background" ref={backgroundRef}>
        <img id="desk-bg" src={bg} alt="background" />

        {items.map((item) => {
          const pos = positions[item.name]
          return (
            <div
              key={item.name}
              className={isEditable ? "desk-item-editable" : undefined}
              style={{ position: "absolute", top: `${pos.top}%`, left: `${pos.left}%`, width: `${pos.width}%`, height: `${pos.height}%` }}
            >
              <img
                src={item.src}
                className="desk-item"
                data-item={item.name}
                style={{ width: "100%", height: "100%", cursor: isEditable ? "move" : "pointer" }}
                onMouseDown={(e) => handleDragStart(e, item.name)}
              />
              {isEditable && (
                <div className="desk-item-resize-handle" onMouseDown={(e) => handleResizeStart(e, item.name)} />
              )}
            </div>
          )
        })}
      </div>
      <Button onClick={onBack} labelClassName="">Back</Button>
    </div>
  )
}
