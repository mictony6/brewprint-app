export interface ResourceFields {
  name: string
  slug: string
  "resource-type"?: string
  "short-description"?: string
  "best-for"?: string
  link?: string
  image?: { url: string; alt: string | null }
  "free-or-paid"?: string
  difficulty?: string
}
