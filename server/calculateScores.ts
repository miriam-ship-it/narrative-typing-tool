import coefficientsData from "../shared/coefficients.json";
import { ProfileScores, ProfileType } from "../shared/formTypes";

interface CandidateResponses {
  tt1Responses: Record<string, number>;
  tt2Responses: Record<string, number>;
  tt3Responses: number[];
  tt4Responses: number[];
  tt5Responses: Record<string, number>;
  tt6Responses: number[];
  tt7Responses: number[];
}

/**
 * Calculate profile scores based on candidate responses and coefficients
 */
export function calculateProfileScores(responses: CandidateResponses): {
  scores: ProfileScores;
  profileType: ProfileType;
} {
  const scores: ProfileScores = {
    Empath: 0,
    Pioneer: 0,
    Mechanist: 0,
    Collaborator: 0,
    Nester: 0,
  };

  const profiles: ProfileType[] = ["Empath", "Pioneer", "Mechanist", "Collaborator", "Nester"];

  // Calculate score for each profile
  profiles.forEach((profile) => {
    const profileCoeffs = coefficientsData.coefficients[profile === "Empath" ? "Empaths" : profile === "Pioneer" ? "Pioneers" : profile === "Mechanist" ? "Mechanists" : profile === "Collaborator" ? "Collaborators" : "Nesters"];
    
    let score = 0;

    // TT1: Mobile/Device usage (TT1_Mobile)
    // Sum all device usage frequencies
    const tt1Total = Object.values(responses.tt1Responses).reduce((sum, val) => sum + val, 0);
    score += profileCoeffs.TT1_Mobile * tt1Total;

    // TT2: Game genres (TT2_1 to TT2_22)
    const tt2Keys = Object.keys(responses.tt2Responses);
    tt2Keys.forEach((key, index) => {
      const coeffKey = `TT2_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * responses.tt2Responses[key];
      }
    });

    // TT3: Game types (TT3_1 to TT3_7)
    responses.tt3Responses.forEach((value, index) => {
      const coeffKey = `TT3_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * value;
      }
    });

    // TT4: Criteria for starting new game (TT4_1 to TT4_8)
    responses.tt4Responses.forEach((value, index) => {
      const coeffKey = `TT4_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * value;
      }
    });

    // TT5: Narrative preferences (TT5_1 to TT5_8)
    const tt5Keys = Object.keys(responses.tt5Responses);
    tt5Keys.forEach((key, index) => {
      const coeffKey = `TT5_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * responses.tt5Responses[key];
      }
    });

    // TT6: Importance in narrative games (TT6_1 to TT6_6)
    responses.tt6Responses.forEach((value, index) => {
      const coeffKey = `TT6_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * value;
      }
    });

    // TT7: Visual/audio preferences (TT7_1 to TT7_6)
    responses.tt7Responses.forEach((value, index) => {
      const coeffKey = `TT7_${index + 1}` as keyof typeof profileCoeffs;
      if (profileCoeffs[coeffKey] !== undefined) {
        score += (profileCoeffs[coeffKey] as number) * value;
      }
    });

    scores[profile] = Math.round(score * 10000) / 10000; // Round to 4 decimal places
  });

  // Determine the profile with highest score
  let maxScore = -Infinity;
  let profileType: ProfileType = "Empath";

  profiles.forEach((profile) => {
    if (scores[profile] > maxScore) {
      maxScore = scores[profile];
      profileType = profile;
    }
  });

  return {
    scores,
    profileType,
  };
}
