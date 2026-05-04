import { ENNEAGRAM_TYPES } from './enneagram.data'
import { EnneagramProfile } from './enneagram.model'
import { EnneagramType } from '../shared/types'

export class EnneagramService {
  getProfile(type: EnneagramType): EnneagramProfile | undefined {
    return ENNEAGRAM_TYPES.find(profile => profile.type === type)
  }

  getAllProfiles(): EnneagramProfile[] {
    return ENNEAGRAM_TYPES
  }
}