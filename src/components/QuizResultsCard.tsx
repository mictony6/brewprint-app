import { useState } from "react"
import { RotateCcw, Mail} from "lucide-react"
import type { Career } from "../types/quiz"
import Button from "./Button"
import DemographicsPanel from "./DemographicsPanel"
import { getAttemptID, trackCareerKitClickthrough } from "../lib/analytics"
import { posthog } from "posthog-js"
const homebrewCareerKitsLoc = "https://homebrew-e62593.webflow.io/career-kits/"
const homebrewNewsletterLoc = "https://homebrew-e62593.webflow.io/subscribe"
function QuizResultsCard({career, onRestart, onViewDesk} : QuizResultsCardPropTypes){
    const [showDemographics, setShowDemographics] = useState(
        sessionStorage.getItem("demographicsPanelDismissed") !== "true"
    )

    function trackNewsLetterClick(careerSlug: string){
        const attemptID = getAttemptID()
        posthog.capture("brewprint_newsletter_clicked", {
            quiz_attempt_id: attemptID,
            career_slug: careerSlug
        }, { transport: "sendBeacon" })
    }

    return(
        <div className="quiz-card">
            <div className="quiz-content">
                <span className="brewprint-eyebrow">Results</span>
                <h1 className="result-career-name">
                {career.name}
                </h1>
                <p className="result-blurb">
                {career.blurb}
                </p>
                <div className="result-links">
                    <a href={homebrewCareerKitsLoc+career.slug+"?ref=brewprint"} target="_self" onClick={()=>trackCareerKitClickthrough(career.slug, "results")} className="read-more-anchor" >Read more...</a>

                    <a href={homebrewNewsletterLoc+"?ref=brewprint"} target="_self" className="read-more-anchor" onClick={()=>trackNewsLetterClick(career.slug)} >Subscribe to Newsletter <Mail size={24}/></a>
                </div>

                {showDemographics && (
                    <DemographicsPanel onDismiss={() => setShowDemographics(false)} />
                )}

            </div>
            <div className="result-buttons">
                <Button onClick = {onRestart} variant="secondary" className="icon-button" aria-label="Restart">
                    <RotateCcw size={24} />
                </Button>
                <Button onClick = {onViewDesk} variant="primary" labelClassName="quiz-restart-button-label">View Interactive Desk</Button>
            </div>
        </div>
    )
}

interface QuizResultsCardPropTypes {
    career : Career,
    onRestart: () => void,
    onViewDesk: () => void
}

export default QuizResultsCard
