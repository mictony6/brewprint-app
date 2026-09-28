import bg from "../assets/desk_assets_light/All.png"
import books from "../assets/desk_assets_light/books.png"
import coffee from "../assets/desk_assets_light/coffee.png"
import lamp from "../assets/desk_assets_light/lamp.png"
import notebook from "../assets/desk_assets_light/notebook.png"
import contract from "../assets/desk_assets_light/contract.png"
import laptop from "../assets/desk_assets_light/laptop.png"
import type { CareerKitFields } from "../types/careerKit"

export const deskBackground = bg

export const deskItems: { name: string, src: string, modalTitle: string, opensField: keyof CareerKitFields }[] = [
  { name: "books", src: books, modalTitle: "Reading Recommendations", opensField: "recommended-books" },
  { name: "coffee", src: coffee, modalTitle: "Productivity Tips", opensField: "faqs" },
  { name: "lamp", src: lamp, modalTitle: "First Steps", opensField: "first-steps" },
  { name: "notebook", src: notebook, modalTitle: "Beginner Roadmap", opensField: "beginner-roadmap" },
  { name: "contract", src: contract, modalTitle: "Templates & Resources", opensField: "recommended-templates" },
  { name: "laptop", src: laptop, modalTitle: "Recommended Tools", opensField: "recommended-tools" }
]
