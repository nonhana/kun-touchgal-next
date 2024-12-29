'use client'

import { $command, $inputRule, $node, $remark } from '@milkdown/utils'
import { Node } from '@milkdown/prose/model'
import { InputRule } from '@milkdown/prose/inputrules'
import { createRoot } from 'react-dom/client'
import directive from 'remark-directive'
import dynamic from 'next/dynamic'

const KunPlyr = dynamic(() => import('./Plyr').then((mod) => mod.KunPlyr), {
  ssr: false
})

export const remarkDirective = $remark('remarkDirective', () => directive)

export const videoNode = $node('video', () => ({
  content: 'block+',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  isolating: true,
  defining: true,
  marks: '',
  attrs: {
    src: { default: '' }
  },
  parseDOM: [
    {
      tag: 'div[data-video-player]',
      getAttrs: (dom) => ({
        src: (dom as HTMLElement).getAttribute('data-src')
      })
    }
  ],
  toDOM: (node: Node) => {
    const container = document.createElement('div')
    container.setAttribute('data-video-player', '')
    container.setAttribute('data-src', node.attrs.src)
    container.setAttribute('contenteditable', 'false')
    container.className = 'w-full my-4 overflow-hidden shadow-lg rounded-xl'

    const root = createRoot(container)
    root.render(<KunPlyr src={node.attrs.src} />)

    return container
  },
  parseMarkdown: {
    match: (node) => node.type === 'leafDirective' && node.name === 'kun-video',
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src })
    }
  },
  toMarkdown: {
    match: (node) => node.type.name === 'video',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'kun-video',
        attributes: { src: node.attrs.src }
      })
    }
  }
}))

interface InsertKunVideoCommandPayload {
  src: string
}

export const insertKunVideoCommand = $command(
  'InsertKunVideo',
  (ctx) =>
    (payload: InsertKunVideoCommandPayload = { src: '' }) =>
    (state, dispatch) => {
      if (!dispatch) {
        return true
      }
      const { src = '' } = payload
      const node = videoNode.type(ctx).create({ src })
      if (!node) {
        return true
      }
      dispatch(state.tr.replaceSelectionWith(node).scrollIntoView())
      return true
    }
)

export const videoInputRule = $inputRule(
  (ctx) =>
    new InputRule(
      /{{kun-video="(?<src>[^"]+)?"?\}}/,
      (state, match, start, end) => {
        const [matched, src = ''] = match
        const { tr } = state
        if (matched) {
          return tr.replaceWith(
            start - 1,
            end,
            videoNode.type(ctx).create({ src })
          )
        }
        return null
      }
    )
)
