# Project TODO

## Database & Schema
- [ ] Criar tabela de candidatos com campos pessoais
- [ ] Criar tabela de respostas do Typing Tool
- [ ] Criar tabela de scores calculados por perfil
- [ ] Criar tabela de resultados finais com perfil classificado

## Formulário de Cadastro
- [ ] Implementar etapa 1: Dados pessoais (nome, email, telefone, data nascimento)
- [ ] Implementar etapa 2: Endereço completo
- [ ] Implementar etapa 3: Escolaridade e experiência profissional
- [ ] Implementar etapa 4: Idiomas e disponibilidade

## Questionário Typing Tool (7 perguntas)
- [ ] TT1: Dispositivos de jogo (frequência de uso)
- [ ] TT2: Gêneros de jogos favoritos
- [ ] TT3: Tipos de jogo preferidos
- [ ] TT4: Critérios ao começar novo jogo
- [ ] TT5: Preferências de experiência narrativa
- [ ] TT6: Importância em jogos narrativos
- [ ] TT7: Preferências visuais e de áudio

## Sistema de Cálculo
- [ ] Extrair coeficientes da planilha Excel
- [ ] Implementar algoritmo de cálculo de scores
- [ ] Calcular score para cada perfil (Empath, Pioneer, Mechanist, Collaborator, Nester)
- [ ] Determinar perfil vencedor (maior score)

## Tela de Resultado
- [ ] Exibir perfil classificado
- [ ] Mostrar descrição detalhada do perfil
- [ ] Listar características principais
- [ ] Incluir recomendações de carreira

## UI/UX
- [ ] Implementar indicador de progresso visual
- [ ] Adicionar validação de campos obrigatórios
- [ ] Criar navegação entre etapas (próximo/anterior)
- [ ] Aplicar cores da marca Aponto Pesquisa (#2570A7)
- [ ] Adicionar logo Aponto Pesquisa
- [ ] Design responsivo para mobile

## Dashboard Administrativo
- [ ] Criar rota protegida para admin
- [ ] Lista de todos os candidatos
- [ ] Filtros por data de submissão
- [ ] Filtros por perfil classificado
- [ ] Estatísticas de distribuição de perfis
- [ ] Visualização de detalhes do candidato
- [ ] Exportação de dados

## Testes
- [ ] Testar fluxo completo do formulário
- [ ] Validar cálculos de scores
- [ ] Testar responsividade
- [ ] Verificar validações de campos

## Status Atual (Sistema Completo)
- [x] Schema do banco de dados criado
- [x] Coeficientes extraídos da planilha Excel
- [x] Algoritmo de cálculo implementado
- [x] Rotas tRPC criadas
- [x] Página inicial (Home) criada
- [x] Formulário multi-etapas implementado (11 etapas)
- [x] Página de resultado criada
- [x] Design Aponto Pesquisa aplicado
- [x] Logo extraído e adicionado
- [x] Cores da marca aplicadas
- [x] Dashboard administrativo implementado
- [x] Testes unitários criados e passando
- [x] Validação de campos em cada etapa
- [x] Indicador de progresso visual
- [x] Sistema de navegação entre etapas


## Nova Tarefa - Integração do Algoritmo com Formulário
- [x] Analisar formulário atual (RecruitmentForm.tsx)
- [x] Mapear perguntas do formulário com variáveis TT1-TT7
- [x] Criar lógica de conversão de respostas para formato do algoritmo (algorithmConverter.ts)
- [x] Criar sistema de cálculo de scores (scoring.ts)
- [x] Criar testes unitários e validar (scoring.test.ts)
- [ ] Integrar cálculo automático ao finalizar questionário
- [ ] Atualizar rotas tRPC para usar novo sistema
