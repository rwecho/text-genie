import { DetailedHTMLProps, HTMLAttributes, memo } from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import CodeBlock from './CodeBlock'
import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import { Flex } from 'antd'

type ContentViewProps = {
  content: string
}

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
]

const ContentView = memo(function ContentView({ content }: ContentViewProps) {
  console.log('ContentView', content)

  const inlineLatex = true
  const components = {
    code,
    p,
  }
  return (
    <Flex vertical gap={'middle'} className="markdown-view">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: inlineLatex }],
        ]}
        rehypePlugins={[
          rehypeKatex,
          [
            rehypeHighlight,
            {
              detect: true,
              ignoreMissing: true,
              subset: codeLanguageSubset,
            },
          ],
        ]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </Flex>
  )
})

const code = memo(function Code(props: {
  inline: boolean
  className: string
  children: React.ReactNode & React.ReactNode[]
}) {
  const { inline, className, children } = props
  const match = /language-(\w+)/.exec(className || '')
  const lang = match && match[1]

  if (inline) {
    return <code className={className}>{children}</code>
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />
  }
})

const p = memo(function Paragraph(
  props?: Omit<
    DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
    'ref'
  >,
) {
  return <div className="whitespace-pre-wrap">{props?.children}</div>
})

export default ContentView
