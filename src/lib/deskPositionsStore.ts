import { useSyncExternalStore } from "react"
import savedPositions from "../data/deskPositions.json"

export type DeskItemPosition = { top: number; left: number; width: number; height: number }
export type DeskPositions = Record<string, DeskItemPosition>

const STORAGE_KEY = "deskPositions"
const SAVE_ENDPOINT = "/api/desk-positions"

const defaultPositions: DeskPositions = savedPositions

function loadInitial(): DeskPositions {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultPositions, ...JSON.parse(saved) } : defaultPositions
  } catch {
    return defaultPositions
  }
}

let positions = loadInitial()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export const deskPositionsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return positions
  },
  setItemPosition(key: string, pos: DeskItemPosition) {
    positions = { ...positions, [key]: pos }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    emit()
  },
  reset() {
    positions = defaultPositions
    sessionStorage.removeItem(STORAGE_KEY)
    emit()
  },
  async saveToDisk() {
    const res = await fetch(SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(positions, null, 2),
    })
    if (!res.ok) throw new Error(await res.text())
  },
}

export function useDeskPositions() {
  return useSyncExternalStore(deskPositionsStore.subscribe, deskPositionsStore.getSnapshot)
}

let editMode = false
const editModeListeners = new Set<() => void>()

export const deskEditModeStore = {
  subscribe(listener: () => void) {
    editModeListeners.add(listener)
    return () => editModeListeners.delete(listener)
  },
  getSnapshot() {
    return editMode
  },
  toggle() {
    editMode = !editMode
    editModeListeners.forEach((l) => l())
  },
}

export function useDeskEditMode() {
  return useSyncExternalStore(deskEditModeStore.subscribe, deskEditModeStore.getSnapshot)
}
