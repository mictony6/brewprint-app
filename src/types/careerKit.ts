export interface CareerKitFields {
  name: string
  slug: string
  "career-id"?: string
  "hero-image"?: { url: string; alt: string | null }
  "short-description"?: string
  intro?: string
  "career-overview"?: string
  "what-you-ll-actually-do"?: string
  "skills-you-ll-need"?: string
  "beginner-roadmap"?: string
  "salary-expectations"?: string
  "beginner-portfolio-ideas"?: string
  "first-steps"?: string
  faqs?: string
  "recommended-books"?: string[]
  "recommended-tools"?: string[]
  "recommended-templates"?: string[]
  "recommended-courses"?: string[]
}
