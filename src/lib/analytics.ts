import { posthog } from "posthog-js"

export function getAttemptID(): string | null {
  return sessionStorage.getItem("brewprintAttemptID")
}

export function trackCareerKitClickthrough(careerSlug: string, source: "results" | "desk") {
  posthog.capture("career_kit_clickthrough", {
    quiz_attempt_id: getAttemptID(),
    career_slug: careerSlug,
    source,
  }, { transport: "sendBeacon" })
}


export function getSessionClickedItems(): Set<string> {
  const stored = sessionStorage.getItem("deskClickedItems")
  return stored ? new Set(JSON.parse(stored)) : new Set()
}


export function clearSessionClickedItems(){
  sessionStorage.removeItem("deskClickedItems")
}