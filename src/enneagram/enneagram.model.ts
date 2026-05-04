import { EnneagramType } from '../shared/types.ts'

export type EnneagramProfile = {
  type: EnneagramType
  name: string
  coreFear: string
  coreDesire: string
  ontologicalSignature: string[]
}