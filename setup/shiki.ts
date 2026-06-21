import { defineShikiSetup } from '@slidev/types'
import type { ThemeRegistrationRaw } from 'shiki'

const cyanTheme: ThemeRegistrationRaw = {
  name: 'presentation-accessible',
  type: 'dark',
  colors: {
    'editor.background': '#101418',
    'editor.foreground': '#f4f7fb',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#8b949e', fontStyle: 'italic' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#f2c14e' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#ffb86c' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#8db3ff' },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#c792ea' },
    },
    {
      scope: ['variable', 'variable.other', 'variable.parameter'],
      settings: { foreground: '#f4f7fb' },
    },
    {
      scope: ['entity.name.type', 'support.type', 'support.class'],
      settings: { foreground: '#7dd3fc' },
    },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: '#d8dee9' },
    },
    {
      scope: ['keyword.operator', 'keyword.operator.assignment'],
      settings: { foreground: '#ff8fa3' },
    },
    {
      scope: ['meta.tag', 'entity.name.tag'],
      settings: { foreground: '#8db3ff' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#f2c14e' },
    },
    {
      scope: ['support.constant', 'constant.other'],
      settings: { foreground: '#ffb86c' },
    },
    {
      scope: ['meta.property-name', 'support.type.property-name'],
      settings: { foreground: '#c792ea' },
    },
  ],
}

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: cyanTheme,
      light: cyanTheme,
    },
  }
})
