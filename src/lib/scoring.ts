import type { Question, QuestionOption } from '../types/quiz'

export function getCareerList(careers: object): string[] {
  const careerList: string[] = []
  for (const career in careers){
    careerList.push(career)
  }
  return careerList
}

export function computeMaxScores(questions: Question[], careerList: string[]): Map<string, number> {
  const maxScores = new Map<string, number>()
  for (const career of careerList){
    let total = 0
    for (const question of questions){
      let best = 0
      for (const option of question.options){
        const score = option.scores[career] ?? 0
        best = Math.max(score, best)
      }
      total += best
    }
    maxScores.set(career, total)
  }
  return maxScores
}

export function computeScores(answers: QuestionOption[], careerList: string[]): Map<string, number> {
  const scores = new Map<string, number>(careerList.map((c) => [c, 0]))
  for (const answer of answers){
    for (const career of careerList){
      const current = scores.get(career) ?? 0
      scores.set(career, current + (answer.scores[career] ?? 0))
    }
  }
  return scores
}


export function getTopResult(results: Map<string, number>, maxScores: Map<string, number>): [string, number] {
    let best: [string, number] = ["", -Infinity]
    for (const [career, score] of results){
        const normalizedScore = score / maxScores.get(career)!
        if (normalizedScore > best[1]){
            best = [career, normalizedScore]
        }
    }
    return best
}