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
  answer?: string
  answerAt?: Date
  duration?: number
  sources: AnswerSource[]
}

export type AnswerSource = {
  id: string
  link: string
  title?: string
  description?: string
}
