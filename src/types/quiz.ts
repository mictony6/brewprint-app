export interface QuestionOption {
  label: string
  icon: string
  scores: { [career: string]: number }
}

export interface Question {
  id: string
  type: string
  text: string
  options: QuestionOption[]
}

export interface Career {
    name:string,
    slug:string,
    blurb:string
}
