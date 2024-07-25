export interface LLM {
  name: string
  description: string
  group: 'openai' | 'google' | 'claude' | string
}

export const llms: LLM[] = [
  {
    name: 'GPT-4o',
    description: 'GPT-4o',
    group: 'openai',
  },
  {
    name: 'GPT-4',
    description: 'GPT-4',
    group: 'openai',
  },
  {
    name: 'Gemini 1.5 Flash',
    description: 'Gemini 1.5 Flash',
    group: 'google',
  },
  {
    name: 'Gemini 1.5 Pro',
    description: 'Gemini 1.5 Pro',
    group: 'google',
  },
  {
    name: 'Claude 3 Haiku',
    description: 'Claude 3 Haiku',
    group: 'claude',
  },
  {
    name: 'Claude 3.5 Sonnet',
    description: 'Claude 3.5 Sonnet',
    group: 'claude',
  },
]
