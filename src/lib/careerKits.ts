import type { CollectionItem } from "webflow-api/api/types/CollectionItem"
import type { CareerKitFields } from "../types/careerKit"

export type CareerKitItem = CollectionItem & { fieldData: CareerKitFields }

function getCareerKitsUrl() {
  return import.meta.env.DEV
    ? '/api/career-kits'
    : new URL('api/career-kits', import.meta.env.BASE_URL).toString()
}

export async function fetchCareerKits(): Promise<CareerKitItem[]> {
  const res = await fetch(getCareerKitsUrl())
  const data = await res.json()
  return data.items
}

export async function fetchCareerKitBySlug(slug: string): Promise<CareerKitItem | undefined> {
  const items = await fetchCareerKits()
  return items.find(item => item.fieldData.slug === slug)
}
