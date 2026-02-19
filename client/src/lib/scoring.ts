/**
 * Sistema de cálculo de scores para perfis narrativos
 * Usa os coeficientes extraídos da planilha Netflix
 */

import { FormData, ProfileScores, ProfileType } from "@shared/formTypes";
import { convertFormDataToAlgorithmInput, AlgorithmInput } from "./algorithmConverter";
import coefficientsData from "@shared/coefficients.json";

// Mapear nomes dos perfis do JSON para os tipos do TypeScript
const PROFILE_NAME_MAP: Record<string, ProfileType> = {
  "Empaths": "Empath",
  "Pioneers": "Pioneer",
  "Mechanists": "Mechanist",
  "Collaborators": "Collaborator",
  "Nesters": "Nester",
};

/**
 * Calcula o score de um perfil específico
 * @param algorithmInput - Dados convertidos do formulário (58 variáveis)
 * @param profileCoefficients - Coeficientes do perfil
 * @returns Score calculado
 */
function calculateProfileScore(
  algorithmInput: AlgorithmInput,
  profileCoefficients: Record<string, number>
): number {
  let score = 0;
  
  // Multiplicar cada variável pelo seu coeficiente e somar
  for (const [key, coefficient] of Object.entries(profileCoefficients)) {
    const value = algorithmInput[key as keyof AlgorithmInput] || 0;
    score += value * coefficient;
  }
  
  return score;
}

/**
 * Calcula scores para todos os 5 perfis
 * @param formData - Dados do formulário
 * @returns Scores de todos os perfis
 */
export function calculateScores(formData: FormData): ProfileScores {
  // Converter respostas do formulário para formato do algoritmo
  const algorithmInput = convertFormDataToAlgorithmInput(formData);
  
  // Calcular score para cada perfil
  const scores: ProfileScores = {
    Empath: 0,
    Pioneer: 0,
    Mechanist: 0,
    Collaborator: 0,
    Nester: 0,
  };
  
  for (const [jsonProfileName, coefficients] of Object.entries(coefficientsData.coefficients)) {
    const profileType = PROFILE_NAME_MAP[jsonProfileName];
    if (profileType) {
      scores[profileType] = calculateProfileScore(algorithmInput, coefficients as Record<string, number>);
    }
  }
  
  return scores;
}

/**
 * Determina o perfil vencedor (maior score)
 * @param scores - Scores de todos os perfis
 * @returns Tipo do perfil vencedor
 */
export function determineProfile(scores: ProfileScores): ProfileType {
  let maxScore = -Infinity;
  let winnerProfile: ProfileType = "Empath"; // Default
  
  for (const [profile, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      winnerProfile = profile as ProfileType;
    }
  }
  
  return winnerProfile;
}

/**
 * Calcula e retorna o perfil completo com scores
 * @param formData - Dados do formulário
 * @returns Perfil classificado e scores
 */
export function calculateProfileResult(formData: FormData): {
  profileType: ProfileType;
  scores: ProfileScores;
} {
  const scores = calculateScores(formData);
  const profileType = determineProfile(scores);
  
  return {
    profileType,
    scores,
  };
}
