/**
 * Funções de validação de elegibilidade para a pesquisa
 */

export type DisqualificationReason =
  | "age_under"
  | "age_over"
  | "no_netflix"
  | "low_gaming_frequency"
  | "recent_research"
  | "is_streamer"
  | "active_social_poster"
  | "duplicate_address";

export interface EligibilityResult {
  eligible: boolean;
  reason?: DisqualificationReason;
  message?: string;
}

/**
 * Calcula a idade a partir da data de nascimento
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Valida se a idade está entre 18 e 64 anos
 */
export function validateAge(birthDate: Date): EligibilityResult {
  const age = calculateAge(birthDate);
  
  if (age < 18) {
    return {
      eligible: false,
      reason: "age_under",
      message: "Você precisa ter pelo menos 18 anos para participar desta pesquisa."
    };
  }
  
  if (age > 64) {
    return {
      eligible: false,
      reason: "age_over",
      message: "Infelizmente, esta pesquisa é destinada a pessoas com até 64 anos."
    };
  }
  
  return { eligible: true };
}

/**
 * Valida status de assinatura Netflix
 */
export function validateNetflix(status: string): EligibilityResult {
  const validStatuses = [
    "Sim, sou assinante atual",
    "Fui assinante nos últimos 6 meses"
  ];
  
  if (!validStatuses.includes(status)) {
    return {
      eligible: false,
      reason: "no_netflix",
      message: "É necessário ser assinante atual da Netflix ou ter sido assinante nos últimos 6 meses."
    };
  }
  
  return { eligible: true };
}

/**
 * Valida frequência de jogo
 */
export function validateGamingFrequency(frequency: string): EligibilityResult {
  const invalidFrequencies = ["Raramente", "Nunca"];
  
  if (invalidFrequencies.includes(frequency)) {
    return {
      eligible: false,
      reason: "low_gaming_frequency",
      message: "É necessário jogar pelo menos mensalmente em qualquer dispositivo."
    };
  }
  
  return { eligible: true };
}

/**
 * Valida participação recente em pesquisa
 */
export function validateRecentResearch(participated: boolean): EligibilityResult {
  if (participated) {
    return {
      eligible: false,
      reason: "recent_research",
      message: "Você participou de uma pesquisa similar recentemente. Aguarde 6 meses para participar novamente."
    };
  }
  
  return { eligible: true };
}

/**
 * Valida se é streamer ativo
 */
export function validateStreamer(isStreamer: boolean): EligibilityResult {
  if (isStreamer) {
    return {
      eligible: false,
      reason: "is_streamer",
      message: "Streamers ativos não podem participar desta pesquisa."
    };
  }
  
  return { eligible: true };
}

/**
 * Valida postagem ativa em redes sociais
 */
export function validateSocialMediaActivity(activity: string): EligibilityResult {
  const disqualifyingActivities = ["Sim, frequentemente", "Sim, ocasionalmente"];
  
  if (disqualifyingActivities.includes(activity)) {
    return {
      eligible: false,
      reason: "active_social_poster",
      message: "Pessoas que postam ativamente sobre games não podem participar desta pesquisa."
    };
  }
  
  return { eligible: true };
}

/**
 * Mensagens de desqualificação por motivo
 */
export const disqualificationMessages: Record<DisqualificationReason, { title: string; message: string }> = {
  age_under: {
    title: "Idade Mínima Não Atingida",
    message: "Você precisa ter pelo menos 18 anos para participar desta pesquisa."
  },
  age_over: {
    title: "Idade Máxima Excedida",
    message: "Infelizmente, esta pesquisa é destinada a pessoas com até 64 anos."
  },
  no_netflix: {
    title: "Assinatura Netflix Necessária",
    message: "É necessário ser assinante atual da Netflix ou ter sido assinante nos últimos 6 meses."
  },
  low_gaming_frequency: {
    title: "Frequência de Jogo Insuficiente",
    message: "É necessário jogar pelo menos mensalmente em qualquer dispositivo."
  },
  recent_research: {
    title: "Participação Recente",
    message: "Você participou de uma pesquisa similar recentemente. Aguarde 6 meses para participar novamente."
  },
  is_streamer: {
    title: "Streamers Não Elegíveis",
    message: "Streamers ativos não podem participar desta pesquisa."
  },
  active_social_poster: {
    title: "Atividade em Redes Sociais",
    message: "Pessoas que postam ativamente sobre games não podem participar desta pesquisa."
  },
  duplicate_address: {
    title: "Endereço Já Cadastrado",
    message: "Já existe um participante cadastrado neste endereço. Apenas um participante por domicílio é permitido."
  }
};
