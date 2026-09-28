import type { CollectionItem } from "webflow-api/api/types/CollectionItem"
import type { ResourceFields } from "../types/resource"

export type ResourceItem = CollectionItem & { fieldData: ResourceFields }

function getResourcesUrl() {
  return import.meta.env.DEV
    ? '/api/resources'
    : new URL('api/resources', import.meta.env.BASE_URL).toString()
}

export async function fetchResources(): Promise<ResourceItem[]> {
  const res = await fetch(getResourcesUrl())
  const data = await res.json()
  return data.items
}
