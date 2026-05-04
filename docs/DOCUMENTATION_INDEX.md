# Índice de Documentação do Diário do Ser

Bem-vindo à documentação completa do Diário do Ser. Este índice ajuda você a navegar por todos os documentos disponíveis.

## 📚 Documentação Principal

### [README.md](../README.md)
**Ponto de entrada do projeto**
- Visão geral e descrição do projeto
- Stack tecnológica
- Comandos úteis
- Configuração rápida
- Links para recursos externos

### [AGENTS.md](../AGENTS.md)
**Guia de referência para desenvolvedores**
- Stack tecnológica detalhada
- Bounded contexts (domínios)
- Estrutura de arquivos
- Convenções de código
- Comandos por categoria

## 🏗️ Documentação Técnica

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Arquitetura do Sistema**
- Visão geral da arquitetura
- Fluxo de dados
- Componentes principais
- Padrões de design
- Decisões arquiteturais

### [API.md](./API.md)
**Documentação da API REST**
- Endpoints disponíveis
- Métodos HTTP
- Parâmetros e respostas
- Códigos de erro
- Exemplos de uso

### [DEVELOPMENT.md](./DEVELOPMENT.md)
**Guia de Desenvolvimento**
- Setup do ambiente
- Fluxo de trabalho
- Padrões de código
- Testes
- Debugging

### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Guia de Deploy**
- Preparação para produção
- Deploy do backend
- Deploy do frontend
- Variáveis de ambiente
- Troubleshooting

## 🤖 Documentação de IA

### [AI_PROVIDERS_GUIDE.md](./AI_PROVIDERS_GUIDE.md)
**Configuração de Provedores de IA**
- Google Gemini (grátis)
- Anthropic Claude (premium)
- OpenAI GPT-4 mini (pago)
- Fallback automático
- Troubleshooting

## 📋 Especificações

### [spdd-bootstrap-diario-eneagrama.md](../spdd-bootstrap-diario-eneagrama.md)
**Especificação da Feature Inicial**
- Contexto do sistema
- Stack técnica
- Estrutura do código
- Requisitos
- Canvas de decisões
- Checklist de implementação

## 🗺️ Navegação por Tópico

### Para Desenvolvedores Iniciantes
1. Comece pelo [README.md](../README.md)
2. Leia [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Consulte [AGENTS.md](../AGENTS.md) para convenções

### Para Arquitetos/DevOps
1. [ARCHITECTURE.md](./ARCHITECTURE.md)
2. [DEPLOYMENT.md](./DEPLOYMENT.md)
3. [API.md](./API.md)

### Para Configurar IA
1. [AI_PROVIDERS_GUIDE.md](./AI_PROVIDERS_GUIDE.md)
2. Seção de Configuração no [README.md](../README.md)

### Para Entender Funcionalidades
1. [spdd-bootstrap-diario-eneagrama.md](../spdd-bootstrap-diario-eneagrama.md)
2. [API.md](./API.md)

## 📁 Estrutura de Arquivos

```
ontoapp/
├── README.md                      # Ponto de entrada
├── AGENTS.md                      # Guia de referência
├── spdd-bootstrap-diario-eneagrama.md  # Especificação
│
├── docs/                          # Documentação técnica
│   ├── DOCUMENTATION_INDEX.md    # Este arquivo
│   ├── ARCHITECTURE.md           # Arquitetura do sistema
│   ├── API.md                    # Documentação da API
│   ├── DEVELOPMENT.md            # Guia de desenvolvimento
│   ├── DEPLOYMENT.md             # Guia de deploy
│   └── AI_PROVIDERS_GUIDE.md     # Configuração de IA
│
├── src/                          # Código fonte
│   ├── journal/                  # Domínio: entradas do diário
│   ├── insight/                  # Domínio: geração de insights
│   ├── enneagram/                # Domínio: tipos do Eneagrama
│   ├── web/                      # Frontend React
│   ├── shared/                   # Tipos, validação, clientes IA
│   └── server.ts                 # API Express
│
├── prisma/                       # Schema e migrations
└── package.json                  # Dependências e scripts
```

## 🔗 Links Externos Importantes

- [Repositório GitHub](https://github.com/DodonisHC/ontoapp)
- [Google AI Studio](https://aistudio.google.com/app/apikey) - Chave Gemini
- [Anthropic Console](https://console.anthropic.com/) - Console Claude
- [OpenAI Platform](https://platform.openai.com/) - Console OpenAI

## 📝 Convenções de Documentação

- **README.md**: Visão geral, instalação rápida, comandos
- **AGENTS.md**: Referência técnica, convenções, stack
- **docs/*.md**: Documentação detalhada por tópico
- **spdd-*.md**: Especificações de features (SPDD)

## 🔄 Atualização da Documentação

Ao adicionar novas features:
1. Atualize o README.md com overview
2. Crie/atualize documentos em `docs/`
3. Atualize este índice se necessário
4. Mantenha links funcionando

## ❓ Precisa de Ajuda?

- **Erro comum?** Consulte o [AI_PROVIDERS_GUIDE.md](./AI_PROVIDERS_GUIDE.md#troubleshooting)
- **Dúvida de arquitetura?** Veja [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Problema de deploy?** Confira [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Configurando ambiente?** Leia [DEVELOPMENT.md](./DEVELOPMENT.md)

---

*Última atualização: Maio 2026*
*Versão da documentação: 1.0*
