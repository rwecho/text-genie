import {
  createChatCompletion,
  createChatCompletionWithSearch,
  createRelatedTopics,
  Message,
} from '@/services/llm'
import { QAPrompt } from '@/services/prompt'
import { QA, Thread } from '@/types/thread'
import { AnswerSource, PrismaClient } from '@prisma/client'

export class ThreadService {
  private _lastQa: QA
  private readonly encoder = new TextEncoder()

  constructor(private thread: Thread, private prisma: PrismaClient) {
    ;[this._lastQa] = thread.qaList.slice(-1)
  }

  public async Append(question?: string) {
    if (question) {
      // we have a new question, need to start a new roll dialogue
      const lastQa = await this.prisma.qA.create({
        data: {
          question,
          threadId: this.thread.id,
        },
      })

      this._lastQa = {
        ...lastQa,
        sources: [],
      }
      this.thread.qaList.push(this._lastQa)
      console.log('Append with question:', question)
    }

    return this.iteratorToStream([
      this.makeQaEvent(),
      this.makeSourcesEvent(),
      this.makeAnswerEvent(),
      this.makeRelatedTopicsEvent(),
    ])
  }

  private async *makeRelatedTopicsEvent() {
    const question = this._lastQa.question
    const answer = this._lastQa.answer
    if (!answer) {
      console.warn('No answer for the question:', question)
      return
    }

    const topics = await createRelatedTopics(question, answer)
    console.log('make related topics event:', topics)
    yield* this.makeEvent('related', JSON.stringify(topics))
  }

  private async *makeSourcesEvent() {
    const qaId = this._lastQa.id
    const sources: AnswerSource[] = []

    console.log('make sources event:', sources)
    yield* this.makeEvent('sources', JSON.stringify(sources))
  }

  private async *makeAnswerEvent() {
    const lastQaItems = this.thread.qaList.slice(-4, -1)
    let messages: Message[] = []
    for (let qa of lastQaItems) {
      messages.push({
        role: 'user',
        content: qa.question,
      })

      messages.push({
        role: 'assistant',
        content: qa.question,
      })
    }

    const completionStream = createChatCompletion([
      {
        role: 'system',
        content: QAPrompt,
      },
      ...messages,
      {
        role: 'user',
        content: this._lastQa.question,
      },
    ])

    let answer = ''
    for await (const chunk of completionStream) {
      answer += chunk
      yield* this.makeEvent('answer', chunk)
    }

    // set the answer back to the last qa.
    this._lastQa.answer = answer
    console.log('make answer event:', answer)

    // update the answer to the database.
    await this.prisma.qA.update({
      where: {
        id: this._lastQa.id,
      },
      data: {
        answer,
      },
    })
  }

  private async *makeQaEvent() {
    const qaId = this._lastQa.id
    const question = this._lastQa.question

    console.log('make qa event:', qaId, question)
    yield* this.makeEvent(
      'qa',
      JSON.stringify({
        id: qaId,
        question,
      }),
    )
  }

  private iteratorToStream(iterators: any[]) {
    let currentIterator = iterators.shift()
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await currentIterator.next()

        if (done) {
          if (iterators.length === 0) {
            controller.close()
          } else {
            currentIterator = iterators.shift()
          }
        } else {
          controller.enqueue(value)
        }
      },
    })
  }

  private *makeEvent(event: string, data: string) {
    yield this.encoder.encode(`event: ${event}\n`)
    yield this.encoder.encode(`data: ${data}\n\n`)
  }
}
