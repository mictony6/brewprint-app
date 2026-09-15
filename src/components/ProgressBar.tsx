import { useRef } from "react"

export default function ProgressBar({steps= 0, currentIndex = 0}){
    const numOfSteps = useRef(steps)

    const segments = []

    for (let i = 0; i < numOfSteps.current; i++){
        segments.push(<Segment key={i} active={i === currentIndex} done={i < currentIndex}/>)

    }
    function Segment({active, done}: {active: boolean, done: boolean}){
        const state = active ? " progress-segment-active" : done ? " progress-segment-done" : ""
        return(
            <div className={`progress-segment ${state}`}></div>
        )
    }


    return (
        <div className="progres-bar">
        {segments}
        </div>
    )
}