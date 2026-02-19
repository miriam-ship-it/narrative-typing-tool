import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Candidates table - stores recruitment form data
 */
export const candidates = mysqlTable("candidates", {
  id: int("id").autoincrement().primaryKey(),
  
  // Personal Information
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }).notNull(),
  
  // Address
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zipCode", { length: 20 }).notNull(),
  
  // Professional Information
  education: varchar("education", { length: 100 }).notNull(),
  experience: text("experience").notNull(),
  languages: text("languages").notNull(),
  availability: varchar("availability", { length: 100 }).notNull(),
  
  // Typing Tool Responses (stored as JSON)
  tt1Responses: json("tt1Responses").notNull(), // Dispositivos de jogo
  tt2Responses: json("tt2Responses").notNull(), // Gêneros favoritos
  tt3Responses: json("tt3Responses").notNull(), // Tipos de jogo
  tt4Responses: json("tt4Responses").notNull(), // Critérios ao começar novo jogo
  tt5Responses: json("tt5Responses").notNull(), // Preferências narrativas
  tt6Responses: json("tt6Responses").notNull(), // Importância em jogos narrativos
  tt7Responses: json("tt7Responses").notNull(), // Preferências visuais/áudio
  
  // Calculated Scores
  empathScore: decimal("empathScore", { precision: 10, scale: 4 }).notNull(),
  pioneerScore: decimal("pioneerScore", { precision: 10, scale: 4 }).notNull(),
  mechanistScore: decimal("mechanistScore", { precision: 10, scale: 4 }).notNull(),
  collaboratorScore: decimal("collaboratorScore", { precision: 10, scale: 4 }).notNull(),
  nesterScore: decimal("nesterScore", { precision: 10, scale: 4 }).notNull(),
  
  // Final Classification
  profileType: mysqlEnum("profileType", ["Empath", "Pioneer", "Mechanist", "Collaborator", "Nester"]).notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = typeof candidates.$inferInsert;
