import { describe, expect, it } from "vitest";
import {
  calculateAge,
  validateAge,
  validateNetflix,
  validateGamingFrequency,
  validateRecentResearch,
  validateStreamer,
  validateSocialMediaActivity,
} from "../client/src/lib/eligibilityCheck";

describe("eligibilityCheck", () => {
  describe("calculateAge", () => {
    it("calcula idade corretamente", () => {
      const birthDate = new Date("2000-01-01");
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(24); // Considerando 2024+
    });

    it("considera mês e dia para cálculo preciso", () => {
      const today = new Date();
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      expect(calculateAge(lastYear)).toBe(1);
    });
  });

  describe("validateAge", () => {
    it("aprova idade entre 18 e 64", () => {
      const birthDate = new Date("1990-01-01"); // ~34 anos
      const result = validateAge(birthDate);
      expect(result.eligible).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("desqualifica idade menor que 18", () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 17);
      const result = validateAge(birthDate);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("age_under");
      expect(result.message).toContain("18 anos");
    });

    it("desqualifica idade maior que 64", () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 65);
      const result = validateAge(birthDate);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("age_over");
      expect(result.message).toContain("64 anos");
    });
  });

  describe("validateNetflix", () => {
    it("aprova assinante atual", () => {
      const result = validateNetflix("Sim, sou assinante atual");
      expect(result.eligible).toBe(true);
    });

    it("aprova ex-assinante recente", () => {
      const result = validateNetflix("Fui assinante nos últimos 6 meses");
      expect(result.eligible).toBe(true);
    });

    it("desqualifica não assinante", () => {
      const result = validateNetflix("Não");
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("no_netflix");
      expect(result.message).toContain("Netflix");
    });
  });

  describe("validateGamingFrequency", () => {
    it("aprova jogador diário", () => {
      const result = validateGamingFrequency("Diariamente");
      expect(result.eligible).toBe(true);
    });

    it("aprova jogador semanal", () => {
      const result = validateGamingFrequency("Semanalmente");
      expect(result.eligible).toBe(true);
    });

    it("aprova jogador mensal", () => {
      const result = validateGamingFrequency("Mensalmente");
      expect(result.eligible).toBe(true);
    });

    it("desqualifica jogador raro", () => {
      const result = validateGamingFrequency("Raramente");
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("low_gaming_frequency");
    });

    it("desqualifica não jogador", () => {
      const result = validateGamingFrequency("Nunca");
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("low_gaming_frequency");
    });
  });

  describe("validateRecentResearch", () => {
    it("aprova quem não participou", () => {
      const result = validateRecentResearch(false);
      expect(result.eligible).toBe(true);
    });

    it("desqualifica quem participou recentemente", () => {
      const result = validateRecentResearch(true);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("recent_research");
      expect(result.message).toContain("6 meses");
    });
  });

  describe("validateStreamer", () => {
    it("aprova não streamer", () => {
      const result = validateStreamer(false);
      expect(result.eligible).toBe(true);
    });

    it("desqualifica streamer ativo", () => {
      const result = validateStreamer(true);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("is_streamer");
      expect(result.message).toContain("Streamer");
    });
  });

  describe("validateSocialMediaActivity", () => {
    it("aprova quem não posta", () => {
      const result = validateSocialMediaActivity("Não");
      expect(result.eligible).toBe(true);
    });

    it("desqualifica quem posta frequentemente", () => {
      const result = validateSocialMediaActivity("Sim, frequentemente");
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("active_social_poster");
    });

    it("desqualifica quem posta ocasionalmente", () => {
      const result = validateSocialMediaActivity("Sim, ocasionalmente");
      expect(result.eligible).toBe(false);
      expect(result.reason).toBe("active_social_poster");
    });
  });
});
