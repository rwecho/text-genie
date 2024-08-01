export type Thread = {
  id: string
  createdAt: Date
  updatedAt: Date
  qaList: QA[]
}

export type QA = {
  id: string
  question: string
  questionAt: Date
  answer?: string | null
  answerAt?: Date | null
  duration?: number | null
  sources: AnswerSource[]
  dislike: boolean
}

export type AnswerSource = {
  id: string
  link: string
  title?: string | null
  description?: string | null
}
