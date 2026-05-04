import React from 'react'
import { Box, Text } from 'ink'

type Props = {
  message: string
}

export function StatusBar({ message }: Props) {
  return (
    <Box borderStyle="single" borderColor="blue" paddingX={1}>
      <Text>{message}</Text>
    </Box>
  )
}