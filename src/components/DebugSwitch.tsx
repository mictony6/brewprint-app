import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import careers from "../data/careers.json"
import { getCareerList } from "../lib/scoring"
import { deskEditModeStore, deskPositionsStore, useDeskEditMode } from "../lib/deskPositionsStore"

const careerNames = getCareerList(careers)


function kebabToTitleCase(str: string) {
  return str
    .split('-') // Split the string at hyphens into an array
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(' '); // Join the array elements with a space
}

export default function DebugSwitch({ onCareerSelect }: { onCareerSelect: (career: string | null) => void }){
    const divRef = useRef<HTMLDivElement>(null)
    const dragOffset = useRef({ x: 0, y: 0 })

    function handleMouseMove(e: MouseEvent){
        if (divRef.current){
            divRef.current.style.left = `${e.clientX - dragOffset.current.x}px`
            divRef.current.style.top = `${e.clientY - dragOffset.current.y}px`
        }
    }

    function handleMouseUp(){
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        document.body.classList.remove("no-select")
    }

    function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>){
        const rect = e.currentTarget.getBoundingClientRect()
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
        document.body.classList.add("no-select")
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
    }


    const selectRef = useRef<HTMLSelectElement>(null)
    function handleOptionSelect(value: string){
        if (value === "default"){
            onCareerSelect(null)
            return
        }
        onCareerSelect(value)
    }

    const [exportLabel, setExportLabel] = useState("Save positions")
    const editMode = useDeskEditMode()

    async function handleExportPositions(){
        try {
            await deskPositionsStore.saveToDisk()
            setExportLabel("Saved!")
        } catch (err) {
            console.error("Failed to save desk positions", err)
            setExportLabel("Save failed")
        }
        setTimeout(() => setExportLabel("Save positions"), 1500)
    }

    const careerOptions = careerNames.map(c => <option key={c} value={c}>{kebabToTitleCase(c)}</option>)
    return(
        <div ref={divRef} id="debug-switch" onMouseDown={handleMouseDown}>
            <select ref={selectRef} name="careers-dev-selector" id="careers-dev-selector" onChange={() => {if (selectRef.current) handleOptionSelect(selectRef.current.value)}}>
                <option value="default">None</option>
                {careerOptions}
            </select>
            <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => deskEditModeStore.toggle()}>
                Edit mode: {editMode ? "On" : "Off"}
            </button>
            <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={handleExportPositions}>
                {exportLabel}
            </button>
        </div>
    )
}
