/**
 * Conversor de respostas do formulário para o formato do algoritmo Netflix
 * 
 * O algoritmo usa 58 variáveis binárias (0 ou 1) organizadas em 7 grupos (TT1-TT7)
 * Cada variável é multiplicada por coeficientes específicos para calcular scores dos 5 perfis
 */

import { FormData } from "@shared/formTypes";

export interface AlgorithmInput {
  TT1_Mobile: number;
  TT2_1: number;
  TT2_2: number;
  TT2_3: number;
  TT2_4: number;
  TT2_5: number;
  TT2_6: number;
  TT2_7: number;
  TT2_8: number;
  TT2_9: number;
  TT2_10: number;
  TT2_11: number;
  TT2_12: number;
  TT2_13: number;
  TT2_14: number;
  TT2_15: number;
  TT2_16: number;
  TT2_17: number;
  TT2_18: number;
  TT2_19: number;
  TT2_20: number;
  TT2_21: number;
  TT2_22: number;
  TT3_1: number;
  TT3_2: number;
  TT3_3: number;
  TT3_4: number;
  TT3_5: number;
  TT3_6: number;
  TT3_7: number;
  TT4_1: number;
  TT4_2: number;
  TT4_3: number;
  TT4_4: number;
  TT4_5: number;
  TT4_6: number;
  TT4_7: number;
  TT4_8: number;
  TT5_1: number;
  TT5_2: number;
  TT5_3: number;
  TT5_4: number;
  TT5_5: number;
  TT5_6: number;
  TT5_7: number;
  TT5_8: number;
  TT6_1: number;
  TT6_2: number;
  TT6_3: number;
  TT6_4: number;
  TT6_5: number;
  TT6_6: number;
  TT7_1: number;
  TT7_2: number;
  TT7_3: number;
  TT7_4: number;
  TT7_5: number;
  TT7_6: number;
}

/**
 * TT1 - Dispositivo Favorito
 * Etapa 8 do formulário: "Qual dos dispositivos você considera seu favorito?"
 * 
 * Opções do formulário:
 * - "mobile" → TT1_Mobile = 1
 * - Outros (PC, Console, etc.) → TT1_Mobile = 0
 * 
 * Nota: O algoritmo original tem mais dispositivos, mas o formulário simplifica para uma escolha
 */
function convertTT1(tt1Responses: Record<string, number>): Pick<AlgorithmInput, "TT1_Mobile"> {
  // Verificar se mobile foi selecionado como favorito
  const mobileValue = tt1Responses["mobile"] || 0;
  return {
    TT1_Mobile: mobileValue > 0 ? 1 : 0,
  };
}

/**
 * TT2 - Gêneros Favoritos
 * Etapa 12 do formulário: 22 gêneros com escala de 1-5
 * 
 * Mapeamento:
 * - 5 = "Meu favorito" → valor alto
 * - 4 = "Gosto muito" → valor médio-alto
 * - 3 = "Gosto" → valor médio
 * - 2 = "Não gosto muito" → valor baixo
 * - 1 = "Não conheço" → 0
 * 
 * Normalização: (valor - 1) / 4 para escala 0-1
 */
function convertTT2(tt2Responses: Record<string, number>): Partial<AlgorithmInput> {
  const genreMapping: Record<string, keyof AlgorithmInput> = {
    actionAdventure: "TT2_1",
    actionRPG: "TT2_2",
    battleRoyale: "TT2_3",
    buildingManagement: "TT2_4",
    digitalCardGames: "TT2_5",
    fighting: "TT2_6",
    horror: "TT2_7",
    lifeSimulation: "TT2_8",
    mmo: "TT2_9",
    moba: "TT2_10",
    monsterTaming: "TT2_11",
    openWorldSandbox: "TT2_12",
    partySocial: "TT2_13",
    platformer: "TT2_14",
    puzzleCasualArcade: "TT2_15",
    racing: "TT2_16",
    rpg: "TT2_17",
    shooter: "TT2_18",
    sports: "TT2_19",
    sports2: "TT2_20", // Duplicado no formulário
    survival: "TT2_21",
    visualNovel: "TT2_22",
  };

  const result: Partial<AlgorithmInput> = {};
  
  for (const [formKey, algorithmKey] of Object.entries(genreMapping)) {
    const value = tt2Responses[formKey] || 1;
    // Normalizar: valores 2-5 viram 0.25-1, valor 1 vira 0
    result[algorithmKey] = value === 1 ? 0 : (value - 1) / 4;
  }

  return result;
}

/**
 * TT3 - Tipos de Jogo
 * Etapa 13 do formulário: 4 tipos (múltipla escolha)
 * 
 * Opções:
 * 1. Jogos para um jogador → TT3_1
 * 2. Jogos multijogador competitivos → TT3_2
 * 3. Jogos multijogador cooperativos → TT3_3
 * 4. Jogos multijogador sociais → TT3_4
 * 
 * Nota: O algoritmo tem 7 variáveis TT3, mas o formulário tem apenas 4
 * TT3_5, TT3_6, TT3_7 serão sempre 0 (não coletados)
 */
function convertTT3(tt3Responses: number[]): Partial<AlgorithmInput> {
  const typeMapping: Record<string, keyof AlgorithmInput> = {
    singlePlayer: "TT3_1",
    multiplayerCompetitive: "TT3_2",
    multiplayerCooperative: "TT3_3",
    multiplayerSocial: "TT3_4",
  };

  const result: Partial<AlgorithmInput> = {
    TT3_1: 0,
    TT3_2: 0,
    TT3_3: 0,
    TT3_4: 0,
    TT3_5: 0,
    TT3_6: 0,
    TT3_7: 0,
  };

  for (const response of tt3Responses) {
    const algorithmKey = typeMapping[response];
    if (algorithmKey) {
      result[algorithmKey] = 1;
    }
  }

  return result;
}

/**
 * TT4 - Critérios ao Começar Novo Jogo
 * Etapa 14 do formulário: 15 critérios (múltipla escolha)
 * 
 * Mapeamento direto: se selecionado = 1, caso contrário = 0
 * 
 * Nota: O algoritmo tem 8 variáveis TT4, mas o formulário tem 15 opções
 * Precisamos mapear as 15 opções para as 8 variáveis do algoritmo
 */
function convertTT4(tt4Responses: number[]): Partial<AlgorithmInput> {
  const criteriaMapping: Record<string, keyof AlgorithmInput> = {
    interestingMechanics: "TT4_1",
    engagingStory: "TT4_2",
    interestingCharacters: "TT4_3",
    interestingWorld: "TT4_4",
    impressiveGraphics: "TT4_5",
    soundtrack: "TT4_6",
    friendRecommendation: "TT4_7",
    positiveReviews: "TT4_8",
    // Outras opções do formulário não têm correspondência direta no algoritmo
  };

  const result: Partial<AlgorithmInput> = {
    TT4_1: 0,
    TT4_2: 0,
    TT4_3: 0,
    TT4_4: 0,
    TT4_5: 0,
    TT4_6: 0,
    TT4_7: 0,
    TT4_8: 0,
  };

  for (const response of tt4Responses) {
    const algorithmKey = criteriaMapping[response];
    if (algorithmKey) {
      result[algorithmKey] = 1;
    }
  }

  return result;
}

/**
 * TT5 - Preferências de Experiência Narrativa
 * Etapa 15 do formulário: 7 pares de opostos com escala 1-5
 * 
 * Escala:
 * - 1 = Totalmente à esquerda
 * - 3 = Neutro
 * - 5 = Totalmente à direita
 * 
 * Normalização: (valor - 1) / 4 para escala 0-1
 * 
 * Nota: O algoritmo tem 8 variáveis TT5, mas o formulário tem 7 pares
 */
function convertTT5(tt5Responses: Record<string, number>): Partial<AlgorithmInput> {
  const narrativeMapping: Record<string, keyof AlgorithmInput> = {
    linearVsBranching: "TT5_1",
    guidedVsFreeExploration: "TT5_2",
    dialogueVsAction: "TT5_3",
    realismVsFantasy: "TT5_4",
    seriousVsHumorous: "TT5_5",
    definedVsCustomizable: "TT5_6",
    storyVsGameplay: "TT5_7",
  };

  const result: Partial<AlgorithmInput> = {
    TT5_8: 0, // Não coletado no formulário
  };

  for (const [formKey, algorithmKey] of Object.entries(narrativeMapping)) {
    const value = tt5Responses[formKey] || 3; // Default neutro
    result[algorithmKey] = (value - 1) / 4; // Normalizar para 0-1
  }

  return result;
}

/**
 * TT6 - Importância em Jogos Narrativos
 * Etapa 16 do formulário: 12 aspectos (múltipla escolha)
 * 
 * Mapeamento direto: se selecionado = 1, caso contrário = 0
 * 
 * Nota: O algoritmo tem 6 variáveis TT6, mas o formulário tem 12 opções
 */
function convertTT6(tt6Responses: number[]): Partial<AlgorithmInput> {
  const importanceMapping: Record<string, keyof AlgorithmInput> = {
    characterDevelopment: "TT6_1",
    plotTwists: "TT6_2",
    meaningfulChoices: "TT6_3",
    consequences: "TT6_4",
    wellWrittenDialogue: "TT6_5",
    worldbuilding: "TT6_6",
    // Outras opções do formulário não têm correspondência direta
  };

  const result: Partial<AlgorithmInput> = {
    TT6_1: 0,
    TT6_2: 0,
    TT6_3: 0,
    TT6_4: 0,
    TT6_5: 0,
    TT6_6: 0,
  };

  for (const response of tt6Responses) {
    const algorithmKey = importanceMapping[response];
    if (algorithmKey) {
      result[algorithmKey] = 1;
    }
  }

  return result;
}

/**
 * TT7 - Preferências Visuais e de Áudio
 * Etapa 17 do formulário: 10 preferências (múltipla escolha)
 * 
 * Mapeamento direto: se selecionado = 1, caso contrário = 0
 * 
 * Nota: O algoritmo tem 6 variáveis TT7, mas o formulário tem 10 opções
 */
function convertTT7(tt7Responses: number[]): Partial<AlgorithmInput> {
  const visualAudioMapping: Record<string, keyof AlgorithmInput> = {
    realisticGraphics: "TT7_1",
    uniqueArtStyle: "TT7_2",
    fluidAnimations: "TT7_3",
    impressiveVisualEffects: "TT7_4",
    memorableCharacterDesign: "TT7_5",
    orchestralSoundtrack: "TT7_6",
    // Outras opções do formulário não têm correspondência direta
  };

  const result: Partial<AlgorithmInput> = {
    TT7_1: 0,
    TT7_2: 0,
    TT7_3: 0,
    TT7_4: 0,
    TT7_5: 0,
    TT7_6: 0,
  };

  for (const response of tt7Responses) {
    const algorithmKey = visualAudioMapping[response];
    if (algorithmKey) {
      result[algorithmKey] = 1;
    }
  }

  return result;
}

/**
 * Função principal de conversão
 * Converte todas as respostas do formulário para o formato do algoritmo
 */
export function convertFormDataToAlgorithmInput(formData: FormData): AlgorithmInput {
  const tt1 = convertTT1(formData.tt1Responses);
  const tt2 = convertTT2(formData.tt2Responses);
  const tt3 = convertTT3(formData.tt3Responses);
  const tt4 = convertTT4(formData.tt4Responses);
  const tt5 = convertTT5(formData.tt5Responses);
  const tt6 = convertTT6(formData.tt6Responses);
  const tt7 = convertTT7(formData.tt7Responses);

  // Combinar todos os resultados
  return {
    ...tt1,
    ...(tt2 as any),
    ...(tt3 as any),
    ...(tt4 as any),
    ...(tt5 as any),
    ...(tt6 as any),
    ...(tt7 as any),
  } as AlgorithmInput;
}
