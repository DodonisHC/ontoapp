import { ENNEAGRAM_TYPES } from './enneagram.data.ts'
import { EnneagramProfile } from './enneagram.model.ts'
import { EnneagramType } from '../shared/types.ts'

export class EnneagramService {
  getProfile(type: EnneagramType): EnneagramProfile | undefined {
    return ENNEAGRAM_TYPES.find(profile => profile.type === type)
  }

  getAllProfiles(): EnneagramProfile[] {
    return ENNEAGRAM_TYPES
  }
}