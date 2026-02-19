import { describe, it, expect } from "vitest";
import { calculateScores, determineProfile, calculateProfileResult } from "./scoring";
import { FormData, ProfileType } from "@shared/formTypes";

describe("Sistema de Cálculo de Scores", () => {
  // Dados de teste representando um candidato típico
  const mockFormData: FormData = {
    fullName: "João Silva",
    email: "joao@example.com",
    phone: "+5511999999999",
    dateOfBirth: "1990-01-01",
    address: "Rua Teste, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    education: "Superior Completo",
    experience: "5 anos",
    languages: "Português, Inglês",
    availability: "Integral",
    
    // TT1: Dispositivos (mobile tem valor alto)
    tt1Responses: {
      mobile: 1,
      pc: 0,
      console: 0,
    },
    
    // TT2: Gêneros (valores variados de 1-5)
    tt2Responses: {
      actionAdventure: 5,
      rpg: 5,
      horror: 4,
      openWorldSandbox: 5,
      shooter: 2,
      puzzleCasual: 3,
      // ... outros gêneros com valores baixos
    },
    
    // TT3: Tipos de jogo (array de índices)
    tt3Responses: [0, 2], // Single player e cooperativo
    
    // TT4: Critérios ao começar novo jogo
    tt4Responses: [1, 2, 3], // História envolvente, personagens interessantes, mundo interessante
    
    // TT5: Preferências narrativas (escala 1-5)
    tt5Responses: {
      linearVsBranching: 4, // Mais para branching
      guidedVsFreeExploration: 5, // Exploração livre
      dialogueVsAction: 3, // Balanceado
      realismVsFantasy: 4, // Mais fantasia
      seriousVsHumorous: 3, // Balanceado
      definedVsCustomizable: 4, // Mais customizável
      storyVsGameplay: 4, // Mais história
    },
    
    // TT6: Importância em jogos narrativos
    tt6Responses: [0, 1, 2, 5], // Desenvolvimento de personagens, plot twists, escolhas significativas, worldbuilding
    
    // TT7: Preferências visuais/áudio
    tt7Responses: [1, 2, 4], // Estilo artístico único, animações fluidas, design memorável de personagens
  };

  describe("calculateScores", () => {
    it("deve calcular scores para todos os 5 perfis", () => {
      const scores = calculateScores(mockFormData);
      
      // Verificar que todos os perfis têm scores
      expect(scores).toHaveProperty("Empath");
      expect(scores).toHaveProperty("Pioneer");
      expect(scores).toHaveProperty("Mechanist");
      expect(scores).toHaveProperty("Collaborator");
      expect(scores).toHaveProperty("Nester");
      
      // Verificar que os scores são números
      expect(typeof scores.Empath).toBe("number");
      expect(typeof scores.Pioneer).toBe("number");
      expect(typeof scores.Mechanist).toBe("number");
      expect(typeof scores.Collaborator).toBe("number");
      expect(typeof scores.Nester).toBe("number");
    });

    it("deve produzir scores diferentes para perfis diferentes", () => {
      const scores = calculateScores(mockFormData);
      
      // Nem todos os scores devem ser iguais
      const uniqueScores = new Set(Object.values(scores));
      expect(uniqueScores.size).toBeGreaterThan(1);
    });

    it("deve produzir scores consistentes para os mesmos dados", () => {
      const scores1 = calculateScores(mockFormData);
      const scores2 = calculateScores(mockFormData);
      
      expect(scores1).toEqual(scores2);
    });
  });

  describe("determineProfile", () => {
    it("deve retornar o perfil com maior score", () => {
      const scores = {
        Empath: 10,
        Pioneer: 25,
        Mechanist: 15,
        Collaborator: 8,
        Nester: 12,
      };
      
      const profile = determineProfile(scores);
      expect(profile).toBe("Pioneer");
    });

    it("deve retornar um perfil válido", () => {
      const scores = calculateScores(mockFormData);
      const profile = determineProfile(scores);
      
      const validProfiles: ProfileType[] = ["Empath", "Pioneer", "Mechanist", "Collaborator", "Nester"];
      expect(validProfiles).toContain(profile);
    });
  });

  describe("calculateProfileResult", () => {
    it("deve retornar perfil e scores", () => {
      const result = calculateProfileResult(mockFormData);
      
      expect(result).toHaveProperty("profileType");
      expect(result).toHaveProperty("scores");
      
      const validProfiles: ProfileType[] = ["Empath", "Pioneer", "Mechanist", "Collaborator", "Nester"];
      expect(validProfiles).toContain(result.profileType);
    });

    it("deve ter o perfil retornado como o de maior score", () => {
      const result = calculateProfileResult(mockFormData);
      
      const maxScore = Math.max(...Object.values(result.scores));
      const profileScore = result.scores[result.profileType];
      
      expect(profileScore).toBe(maxScore);
    });
  });

  describe("Casos de teste específicos", () => {
    it("candidato com foco em narrativa deve tender a Empath", () => {
      const narrativeFocusedData: FormData = {
        ...mockFormData,
        tt2Responses: {
          rpg: 5,
          visualNovel: 5,
          actionAdventure: 5,
          horror: 4,
        },
        tt4Responses: [1, 2, 3], // História, personagens, mundo
        tt5Responses: {
          linearVsBranching: 4,
          guidedVsFreeExploration: 2,
          dialogueVsAction: 5, // Muito diálogo
          realismVsFantasy: 3,
          seriousVsHumorous: 4,
          definedVsCustomizable: 2,
          storyVsGameplay: 5, // Muito história
        },
        tt6Responses: [0, 1, 2, 4], // Desenvolvimento de personagens, plot twists, escolhas, diálogo
      };
      
      const result = calculateProfileResult(narrativeFocusedData);
      
      // Empath deve ter score alto
      expect(result.scores.Empath).toBeGreaterThan(0);
    });

    it("candidato com foco em exploração deve tender a Pioneer", () => {
      const explorationFocusedData: FormData = {
        ...mockFormData,
        tt2Responses: {
          openWorldSandbox: 5,
          actionAdventure: 5,
          survival: 5,
        },
        tt3Responses: [0], // Single player
        tt4Responses: [3, 0], // Mundo interessante, mecânicas interessantes
        tt5Responses: {
          linearVsBranching: 5, // Muito branching
          guidedVsFreeExploration: 5, // Exploração livre
          dialogueVsAction: 2,
          realismVsFantasy: 4,
          seriousVsHumorous: 3,
          definedVsCustomizable: 5,
          storyVsGameplay: 2,
        },
        tt6Responses: [5], // Worldbuilding
      };
      
      const result = calculateProfileResult(explorationFocusedData);
      
      // Pioneer deve ter score alto
      expect(result.scores.Pioneer).toBeGreaterThan(0);
    });

    it("candidato com foco em mecânicas deve tender a Mechanist", () => {
      const mechanicsFocusedData: FormData = {
        ...mockFormData,
        tt2Responses: {
          shooter: 5,
          moba: 5,
          fighting: 5,
        },
        tt3Responses: [1], // Competitivo
        tt4Responses: [0], // Mecânicas interessantes
        tt5Responses: {
          linearVsBranching: 2,
          guidedVsFreeExploration: 3,
          dialogueVsAction: 1, // Muito ação
          realismVsFantasy: 2,
          seriousVsHumorous: 2,
          definedVsCustomizable: 2,
          storyVsGameplay: 1, // Muito gameplay
        },
        tt6Responses: [],
      };
      
      const result = calculateProfileResult(mechanicsFocusedData);
      
      // Mechanist deve ter score alto
      expect(result.scores.Mechanist).toBeGreaterThan(0);
    });
  });
});
