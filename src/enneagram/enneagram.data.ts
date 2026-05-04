import { EnneagramProfile } from './enneagram.model.ts'

export const ENNEAGRAM_TYPES: EnneagramProfile[] = [
  {
    type: 1,
    name: 'O Reformador',
    coreFear: 'Ser corrupto, mau, perverso',
    coreDesire: 'Ser bom, virtuoso, equilibrado',
    ontologicalSignature: [
      'Busca pela perfeição e melhoria',
      'Senso de dever e responsabilidade',
      'Crítica interna e externa',
    ],
  },
  {
    type: 2,
    name: 'O Ajudante',
    coreFear: 'Ser indigno de amor',
    coreDesire: 'Ser amado e valorizado',
    ontologicalSignature: [
      'Foco nas necessidades dos outros',
      'Generosidade e empatia',
      'Dificuldade em receber ajuda',
    ],
  },
  {
    type: 3,
    name: 'O Realizador',
    coreFear: 'Ser sem valor',
    coreDesire: 'Ser valorizado e admirado',
    ontologicalSignature: [
      'Busca por sucesso e eficiência',
      'Adaptabilidade e charme',
      'Identificação com realizações',
    ],
  },
  {
    type: 4,
    name: 'O Individualista',
    coreFear: 'Ser comum ou ordinário',
    coreDesire: 'Ser único e autêntico',
    ontologicalSignature: [
      'Profundidade emocional e criatividade',
      'Busca por significado e autenticidade',
      'Sensibilidade à beleza e ao sofrimento',
    ],
  },
  {
    type: 5,
    name: 'O Investigador',
    coreFear: 'Ser incapaz ou incompetente',
    coreDesire: 'Ser capaz e competente',
    ontologicalSignature: [
      'Busca por conhecimento e compreensão',
      'Independência e privacidade',
      'Conservação de energia',
    ],
  },
  {
    type: 6,
    name: 'O Leal',
    coreFear: 'Ser sem apoio ou orientação',
    coreDesire: 'Ter segurança e orientação',
    ontologicalSignature: [
      'Lealdade e compromisso',
      'Preocupação com riscos e segurança',
      'Busca por autoridade confiável',
    ],
  },
  {
    type: 7,
    name: 'O Entusiasta',
    coreFear: 'Ser privado ou deprimido',
    coreDesire: 'Ser feliz e satisfeito',
    ontologicalSignature: [
      'Otimismo e busca por experiências',
      'Versatilidade e planejamento futuro',
      'Evitação de dor e limitação',
    ],
  },
  {
    type: 8,
    name: 'O Confrontador',
    coreFear: 'Ser controlado ou vulnerável',
    coreDesire: 'Ser autossuficiente e forte',
    ontologicalSignature: [
      'Proteção e justiça',
      'Força e assertividade',
      'Dificuldade em mostrar vulnerabilidade',
    ],
  },
  {
    type: 9,
    name: 'O Pacificador',
    coreFear: 'Perder a conexão ou conflito',
    coreDesire: 'Ter paz interior e harmonia',
    ontologicalSignature: [
      'Busca por harmonia e aceitação',
      'Mediador e conciliador',
      'Adaptação às necessidades dos outros',
    ],
  },
]