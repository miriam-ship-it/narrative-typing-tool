import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createCandidate, getAllCandidates, getCandidateById, getCandidatesByProfile, getCandidateStats } from "./db";
import { calculateProfileScores } from "./calculateScores";
import { PROFILE_DESCRIPTIONS } from "../shared/formTypes";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  recruitment: router({
    // Submit complete recruitment form
    submit: publicProcedure
      .input(z.object({
        // Personal Info
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        dateOfBirth: z.string().min(1),
        
        // Address
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().min(1),
        
        // Professional
        education: z.string().min(1),
        experience: z.string().min(1),
        languages: z.string().min(1),
        availability: z.string().min(1),
        
        // Typing Tool Responses
        tt1Responses: z.record(z.string(), z.number()),
        tt2Responses: z.record(z.string(), z.number()),
        tt3Responses: z.array(z.number()).min(1),
        tt4Responses: z.array(z.number()).min(1),
        tt5Responses: z.record(z.string(), z.number()),
        tt6Responses: z.array(z.number()).min(1),
        tt7Responses: z.array(z.number()).min(1),
      }))
      .mutation(async ({ input }) => {
        // Calculate scores
        const { scores, profileType } = calculateProfileScores({
          tt1Responses: input.tt1Responses as Record<string, number>,
          tt2Responses: input.tt2Responses as Record<string, number>,
          tt3Responses: input.tt3Responses as number[],
          tt4Responses: input.tt4Responses as number[],
          tt5Responses: input.tt5Responses as Record<string, number>,
          tt6Responses: input.tt6Responses as number[],
          tt7Responses: input.tt7Responses as number[],
        });

        // Save to database
        const candidate = await createCandidate({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          education: input.education,
          experience: input.experience,
          languages: input.languages,
          availability: input.availability,
          tt1Responses: input.tt1Responses,
          tt2Responses: input.tt2Responses,
          tt3Responses: input.tt3Responses,
          tt4Responses: input.tt4Responses,
          tt5Responses: input.tt5Responses,
          tt6Responses: input.tt6Responses,
          tt7Responses: input.tt7Responses,
          empathScore: scores.Empath.toString(),
          pioneerScore: scores.Pioneer.toString(),
          mechanistScore: scores.Mechanist.toString(),
          collaboratorScore: scores.Collaborator.toString(),
          nesterScore: scores.Nester.toString(),
          profileType: profileType,
        });

        // Get profile description
        const profileInfo = PROFILE_DESCRIPTIONS[profileType];

        return {
          candidateId: candidate.id,
          profileType,
          scores,
          description: profileInfo.description,
          characteristics: profileInfo.characteristics,
          careerRecommendations: profileInfo.careerRecommendations,
        };
      }),

    // Admin: Get all candidates
    getAllCandidates: protectedProcedure.query(async () => {
      return await getAllCandidates();
    }),

    // Admin: Get candidate by ID
    getCandidateById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCandidateById(input.id);
      }),

    // Admin: Get candidates by profile
    getCandidatesByProfile: protectedProcedure
      .input(z.object({ profileType: z.string() }))
      .query(async ({ input }) => {
        return await getCandidatesByProfile(input.profileType);
      }),

    // Admin: Get statistics
    getStats: protectedProcedure.query(async () => {
      return await getCandidateStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
