import type MarkdownIt from 'markdown-it'
import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin'

export function setupMarkdown(md: MarkdownIt) {
  md.use(containerPreview)
  md.use(componentPreview)
}
