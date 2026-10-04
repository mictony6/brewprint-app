import { useState } from 'react'
import { X } from 'lucide-react'
import { posthog } from 'posthog-js'
import { getAttemptID } from '../lib/analytics'

const AGE_BRACKETS = ["13-17", "18-24", "25-34", "35-44", "45+"]
const EMPLOYMENT_STATUSES = ["Student", "Employed", "Unemployed", "Career Changer"]
const REGIONS = ["Luzon", "Visayas", "Mindanao", "Outside PH"]

function DemographicsPanel({ onDismiss }: DemographicsPanelProps) {
  const [ageBracket, setAgeBracket] = useState<string | null>(null)
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null)
  const [region, setRegion] = useState<string | null>(null)

  function handleDismiss() {
    const attemptID = getAttemptID()
    posthog.capture("demographics_provided", {
      quiz_attempt_id: attemptID,
      age_bracket: ageBracket ?? null,
      employment_status: employmentStatus ?? null,
      region: region ?? null,
    })
    sessionStorage.setItem("demographicsPanelDismissed", "true")
    onDismiss()
  }

  function renderPillGroup(options: string[], selected: string | null, onSelect: (value: string | null) => void) {
    return (
      <div className="demographics-pill-group">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`demographics-pill${selected === option ? ' demographics-pill-selected' : ''}`}
            onClick={() => onSelect(selected === option ? null : option)}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  function renderSelect(options: string[], selected: string | null, onSelect: (value: string | null) => void, placeholder: string) {
    return (
      <select
        className="demographics-select"
        value={selected ?? ""}
        onChange={(e) => onSelect(e.target.value === "" ? null : e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    )
  }

  return (
    <div className="demographics-panel">
      <div className="demographics-panel-header">
        <span>Help us improve Brewprint (optional)</span>
        <button type="button" className="demographics-dismiss-button" onClick={handleDismiss} aria-label="Dismiss">
          <X size={18} />
        </button>
      </div>

      <div className="demographics-field">
        <span className="demographics-field-label">Age</span>
        {renderPillGroup(AGE_BRACKETS, ageBracket, setAgeBracket)}
      </div>

      <div className="demographics-field-row">
        <div className="demographics-field">
          <span className="demographics-field-label">Status</span>
          {renderSelect(EMPLOYMENT_STATUSES, employmentStatus, setEmploymentStatus, "Select status")}
        </div>

        <div className="demographics-field">
          <span className="demographics-field-label">Region</span>
          {renderSelect(REGIONS, region, setRegion, "Select region")}
        </div>
      </div>
    </div>
  )
}

interface DemographicsPanelProps {
  onDismiss: () => void
}

export default DemographicsPanel
