// Profile types
export type ProfileType = "Empath" | "Pioneer" | "Mechanist" | "Collaborator" | "Nester";

// Form step types
export interface PersonalInfoStep {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface AddressStep {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProfessionalStep {
  education: string;
  experience: string;
  languages: string;
  availability: string;
}

// Typing Tool response types
export interface TT1Responses {
  playstation5: number;
  playstation4: number;
  xboxSeriesXS: number;
  xboxOne: number;
  nintendoSwitch: number;
  desktopLaptop: number;
  smartphone: number;
  tablet: number;
  vrHeadset: number;
}

export interface TT2Responses {
  actionAdventure: number;
  actionRPG: number;
  battleRoyale: number;
  construction: number;
  cardGames: number;
  fighting: number;
  horror: number;
  lifeSimulation: number;
  mmo: number;
  moba: number;
  monsterTaming: number;
  openWorldSandbox: number;
  partySocial: number;
  platformer: number;
  puzzleCasual: number;
  racing: number;
  rpg: number;
  shooter: number;
  sports: number;
  strategy: number;
  survival: number;
  visualNovel: number;
}

export interface FormData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Step 2: Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 3: Professional
  education: string;
  experience: string;
  languages: string;
  availability: string;
  
  // Typing Tool Questions
  tt1Responses: Record<string, number>;
  tt2Responses: Record<string, number>;
  tt3Responses: number[];
  tt4Responses: number[];
  tt5Responses: Record<string, number>;
  tt6Responses: number[];
  tt7Responses: number[];
}

export interface ProfileScores {
  Empath: number;
  Pioneer: number;
  Mechanist: number;
  Collaborator: number;
  Nester: number;
}

export interface ProfileResult {
  profileType: ProfileType;
  scores: ProfileScores;
  description: string;
  characteristics: string[];
  careerRecommendations: string[];
}

// Profile descriptions
export const PROFILE_DESCRIPTIONS: Record<ProfileType, {
  name: string;
  description: string;
  characteristics: string[];
  careerRecommendations: string[];
}> = {
  Empath: {
    name: "Empath (Empático)",
    description: "Jogadores que valorizam profundamente a conexão emocional com personagens e narrativas. Buscam experiências que despertem emoções fortes e histórias envolventes que os façam refletir sobre a condição humana.",
    characteristics: [
      "Alta valorização de histórias que despertam emoções fortes",
      "Preferência por personagens bem desenvolvidos e relacionáveis",
      "Interesse em narrativas com consequências emocionais",
      "Apreciação por momentos icônicos e memoráveis",
      "Foco em experiências narrativas imersivas"
    ],
    careerRecommendations: [
      "Roteirista de jogos narrativos",
      "Designer de personagens e narrativa",
      "Diretor criativo de experiências emocionais",
      "Consultor de narrativa para jogos story-driven",
      "Desenvolvedor de jogos indie com foco em história"
    ]
  },
  Pioneer: {
    name: "Pioneer (Pioneiro)",
    description: "Exploradores natos que buscam constantemente novas experiências e desafios. Valorizam a inovação, a descoberta e a liberdade para explorar mundos vastos e sistemas complexos.",
    characteristics: [
      "Forte interesse em exploração e descoberta",
      "Preferência por mundos abertos e não-lineares",
      "Valorização de inovação e mecânicas únicas",
      "Busca por experiências que oferecem liberdade",
      "Interesse em sistemas complexos e experimentação"
    ],
    careerRecommendations: [
      "Designer de mundo aberto",
      "Arquiteto de sistemas de jogo",
      "Designer de exploração e progressão",
      "Desenvolvedor de mecânicas inovadoras",
      "Consultor de design de experiência de usuário"
    ]
  },
  Mechanist: {
    name: "Mechanist (Mecanicista)",
    description: "Jogadores focados em dominar mecânicas e sistemas de jogo. Apreciam desafios técnicos, otimização e a satisfação de melhorar suas habilidades através da prática e estratégia.",
    characteristics: [
      "Foco em mecânicas de jogo e sistemas",
      "Valorização de desafio e skill ceiling",
      "Interesse em otimização e eficiência",
      "Preferência por feedback claro de progressão",
      "Apreciação por sistemas de jogo profundos"
    ],
    careerRecommendations: [
      "Designer de mecânicas de gameplay",
      "Balanceador de sistemas de jogo",
      "Designer de progressão e recompensas",
      "Desenvolvedor de sistemas de combate",
      "QA especializado em gameplay"
    ]
  },
  Collaborator: {
    name: "Collaborator (Colaborador)",
    description: "Jogadores que encontram maior satisfação em experiências compartilhadas e cooperação. Valorizam a construção de comunidades, trabalho em equipe e interações sociais significativas.",
    characteristics: [
      "Forte valorização de experiências cooperativas",
      "Interesse em construir e manter comunidades",
      "Preferência por jogos com componentes sociais",
      "Apreciação por trabalho em equipe e coordenação",
      "Foco em interações multiplayer positivas"
    ],
    careerRecommendations: [
      "Designer de sistemas multiplayer",
      "Community manager",
      "Designer de experiências sociais",
      "Desenvolvedor de features cooperativas",
      "Especialista em engajamento de comunidade"
    ]
  },
  Nester: {
    name: "Nester (Aninhador)",
    description: "Jogadores que buscam conforto, familiaridade e experiências relaxantes. Preferem ambientes acolhedores onde podem se expressar criativamente e construir seu próprio espaço seguro.",
    characteristics: [
      "Preferência por experiências confortáveis e relaxantes",
      "Interesse em customização e expressão pessoal",
      "Valorização de ambientes acolhedores",
      "Foco em criatividade e construção",
      "Apreciação por jogos com ritmo mais tranquilo"
    ],
    careerRecommendations: [
      "Designer de sistemas de customização",
      "Desenvolvedor de jogos casuais",
      "Designer de experiências relaxantes",
      "Especialista em sistemas de crafting/building",
      "Designer de ambientes e atmosfera"
    ]
  }
};
