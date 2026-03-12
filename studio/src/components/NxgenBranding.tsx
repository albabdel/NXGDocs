import {createElement} from 'react'
import {Box, Text, Flex} from '@sanity/ui'

export function NxgenLogo() {
  return createElement(
    Flex,
    {
      align: 'center',
      gap: 2,
      padding: 3,
    },
    createElement(
      Box,
      {
        style: {
          width: 28,
          height: 28,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      createElement(Text, {size: 1, style: {color: 'white', fontWeight: 700}}, 'N')
    ),
    createElement(
      Text,
      {size: 2, weight: 'semibold', style: {letterSpacing: '-0.02em'}},
      'NXGEN Docs'
    )
  )
}

export function NxgenNavbar() {
  return createElement(
    Box,
    {
      padding: 2,
      style: {
        background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      },
    },
    createElement(
      Flex,
      {align: 'center', justify: 'space-between'},
      createElement(NxgenLogo, null)
    )
  )
}
