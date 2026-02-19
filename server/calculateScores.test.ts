import { describe, expect, it } from "vitest";
import { calculateProfileScores } from "./calculateScores";

describe("calculateProfileScores", () => {
  it("should calculate scores for all profiles", () => {
    const mockResponses = {
      tt1Responses: {
        playstation5: 7,
        desktopLaptop: 6,
        smartphone: 5,
      },
      tt2Responses: {
        actionAdventure: 5,
        rpg: 5,
        shooter: 4,
      },
      tt3Responses: [0, 1, 2],
      tt4Responses: [0, 1, 4],
      tt5Responses: {
        linear: 0,
        unique: 1,
        updates: 0,
      },
      tt6Responses: [0, 2, 3],
      tt7Responses: [0, 1, 4],
    };

    const result = calculateProfileScores(mockResponses);

    // Should return scores for all 5 profiles
    expect(result.scores).toHaveProperty("Empath");
    expect(result.scores).toHaveProperty("Pioneer");
    expect(result.scores).toHaveProperty("Mechanist");
    expect(result.scores).toHaveProperty("Collaborator");
    expect(result.scores).toHaveProperty("Nester");

    // All scores should be numbers
    expect(typeof result.scores.Empath).toBe("number");
    expect(typeof result.scores.Pioneer).toBe("number");
    expect(typeof result.scores.Mechanist).toBe("number");
    expect(typeof result.scores.Collaborator).toBe("number");
    expect(typeof result.scores.Nester).toBe("number");

    // Should determine a profile type
    expect(result.profileType).toBeDefined();
    expect(["Empath", "Pioneer", "Mechanist", "Collaborator", "Nester"]).toContain(
      result.profileType
    );
  });

  it("should return the profile with highest score", () => {
    const mockResponses = {
      tt1Responses: {
        playstation5: 7,
        playstation4: 7,
        xboxSeriesXS: 7,
      },
      tt2Responses: {
        actionAdventure: 5,
        rpg: 5,
        horror: 5,
        visualNovel: 5,
      },
      tt3Responses: [0, 1], // Linear story preferences
      tt4Responses: [0, 1], // Story and character focused
      tt5Responses: {
        linear: 0,
        unique: 0,
        updates: 0,
        focus: 0,
        change: 0,
        tone: 0,
        gameplay: 0,
        character: 0,
      },
      tt6Responses: [0, 3, 4], // Emotional story, relatable characters
      tt7Responses: [1, 2, 4], // Art style and voice acting
    };

    const result = calculateProfileScores(mockResponses);

    // With story-focused responses, should likely be Empath or similar
    expect(result.profileType).toBeDefined();
    
    // The winning profile should have the highest score
    const winningScore = result.scores[result.profileType];
    const allScores = Object.values(result.scores);
    const maxScore = Math.max(...allScores);
    
    expect(winningScore).toBe(maxScore);
  });

  it("should handle empty responses gracefully", () => {
    const emptyResponses = {
      tt1Responses: {},
      tt2Responses: {},
      tt3Responses: [],
      tt4Responses: [],
      tt5Responses: {},
      tt6Responses: [],
      tt7Responses: [],
    };

    const result = calculateProfileScores(emptyResponses);

    // Should still return valid structure
    expect(result.scores).toBeDefined();
    expect(result.profileType).toBeDefined();
    
    // Scores might be low but should be numbers
    expect(typeof result.scores.Empath).toBe("number");
  });

  it("should round scores to 4 decimal places", () => {
    const mockResponses = {
      tt1Responses: { playstation5: 3 },
      tt2Responses: { rpg: 4 },
      tt3Responses: [1],
      tt4Responses: [2],
      tt5Responses: { linear: 1 },
      tt6Responses: [1],
      tt7Responses: [2],
    };

    const result = calculateProfileScores(mockResponses);

    // Check that scores are rounded properly
    Object.values(result.scores).forEach((score) => {
      const decimalPlaces = score.toString().split(".")[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(4);
    });
  });
});
