import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isDeaf: boolean("is_deaf").default(false),
  preferASL: boolean("prefer_asl").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isDeaf: true,
  preferASL: true,
});

// Business Lifecycle Phase
export const lifecyclePhases = pgTable("lifecycle_phases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
});

export const insertLifecyclePhaseSchema = createInsertSchema(lifecyclePhases).pick({
  name: true,
  slug: true,
  description: true,
  order: true,
});

// Tasks in each phase
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  hasASLVideo: boolean("has_asl_video").default(false),
  aslVideoUrl: text("asl_video_url"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  phaseId: true,
  name: true,
  description: true,
  order: true,
  hasASLVideo: true,
  aslVideoUrl: true,
});

// Subtasks
export const subtasks = pgTable("subtasks", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const insertSubtaskSchema = createInsertSchema(subtasks).pick({
  taskId: true,
  name: true,
  order: true,
});

// Business Tools
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phaseId: integer("phase_id").notNull(),
  toolType: text("tool_type").notNull(), // AI, API, etc.
  actionText: text("action_text").notNull(),
  actionUrl: text("action_url").notNull(),
});

export const insertToolSchema = createInsertSchema(tools).pick({
  name: true,
  description: true,
  phaseId: true,
  toolType: true,
  actionText: true,
  actionUrl: true,
});

// ASL Videos
export const aslVideos = pgTable("asl_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  phaseId: integer("phase_id"),
  taskId: integer("task_id"),
  thumbnail: text("thumbnail"),
});

export const insertASLVideoSchema = createInsertSchema(aslVideos).pick({
  title: true,
  description: true,
  videoUrl: true,
  phaseId: true,
  taskId: true,
  thumbnail: true,
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subtaskId: integer("subtask_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  subtaskId: true,
  completed: true,
  completedAt: true,
});

// Business Records
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  businessType: text("business_type"),
  formationState: text("formation_state"),
  formationStatus: text("formation_status"),
  createdAt: timestamp("created_at").defaultNow(),
  apiData: json("api_data"),
});

export const insertBusinessSchema = createInsertSchema(businesses).pick({
  userId: true,
  name: true,
  description: true,
  businessType: true,
  formationState: true,
  formationStatus: true,
  apiData: true,
});

// VR Counselor Integration
export const vrCounselors = pgTable("vr_counselors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  organization: text("organization").notNull(),
});

export const insertVRCounselorSchema = createInsertSchema(vrCounselors).pick({
  name: true,
  email: true,
  phone: true,
  organization: true,
});

// User-Counselor Relationship
export const userCounselors = pgTable("user_counselors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  counselorId: integer("counselor_id").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").default("active"),
});

export const insertUserCounselorSchema = createInsertSchema(userCounselors).pick({
  userId: true,
  counselorId: true,
  endDate: true,
  status: true,
});

// Partner Agencies for LGBTQIA and Disability Services
export const partnerAgencies = pgTable("partner_agencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  agencyType: text("agency_type").notNull(), // lgbtqia, disability, workforce, mixed
  description: text("description"),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull().unique(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  website: text("website"),
  servicesOffered: text("services_offered").array(),
  specializations: text("specializations").array(), // e.g., ["deaf", "lgbtqia", "veteran", "disabled"]
  isActive: boolean("is_active").default(true),
  partnershipLevel: text("partnership_level").default("standard"), // standard, premium, enterprise
  partnerSince: timestamp("partner_since").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPartnerAgencySchema = createInsertSchema(partnerAgencies).pick({
  name: true,
  agencyType: true,
  description: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  website: true,
  servicesOffered: true,
  specializations: true,
  isActive: true,
  partnershipLevel: true,
});

// Agency Clients - clients referred by partner agencies
export const agencyClients = pgTable("agency_clients", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull().references(() => partnerAgencies.id),
  userId: integer("user_id").notNull().references(() => users.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  specialNeeds: text("special_needs").array(), // specific accessibility or support requirements
  referralReason: text("referral_reason"),
  referralDate: timestamp("referral_date").defaultNow(),
  status: text("status").default("active"), // active, completed, inactive, transferred
  assignedCounselorId: integer("assigned_counselor_id").references(() => vrCounselors.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAgencyClientSchema = createInsertSchema(agencyClients).pick({
  agencyId: true,
  userId: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  specialNeeds: true,
  referralReason: true,
  status: true,
  assignedCounselorId: true,
  notes: true,
});

// Agency Services - track services provided to agency clients
export const agencyServices = pgTable("agency_services", {
  id: serial("id").primaryKey(),
  agencyClientId: integer("agency_client_id").notNull().references(() => agencyClients.id),
  serviceType: text("service_type").notNull(), // vr, workforce, business_formation, etc.
  serviceName: text("service_name").notNull(),
  serviceDescription: text("service_description"),
  status: text("status").default("pending"), // pending, in_progress, completed, cancelled
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  outcome: text("outcome"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAgencyServiceSchema = createInsertSchema(agencyServices).pick({
  agencyClientId: true,
  serviceType: true,
  serviceName: true,
  serviceDescription: true,
  status: true,
  startDate: true,
  completionDate: true,
  outcome: true,
  feedback: true,
});

// Update schemas - only allow specific fields to be updated
export const updatePartnerAgencySchema = insertPartnerAgencySchema.partial().omit({
  // Omit fields that should never be updated by clients
});

export const updateAgencyClientSchema = insertAgencyClientSchema.partial().omit({
  agencyId: true, // Agency cannot be changed after creation
  userId: true, // User cannot be changed after creation
});

export const updateAgencyServiceSchema = insertAgencyServiceSchema.partial().omit({
  agencyClientId: true, // Client cannot be changed after creation
});

// Schema for assigning counselor to client
export const assignCounselorSchema = z.object({
  counselorId: z.number().int().positive()
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PartnerAgency = typeof partnerAgencies.$inferSelect;
export type InsertPartnerAgency = z.infer<typeof insertPartnerAgencySchema>;

export type AgencyClient = typeof agencyClients.$inferSelect;
export type InsertAgencyClient = z.infer<typeof insertAgencyClientSchema>;

export type AgencyService = typeof agencyServices.$inferSelect;
export type InsertAgencyService = z.infer<typeof insertAgencyServiceSchema>;

export type LifecyclePhase = typeof lifecyclePhases.$inferSelect;
export type InsertLifecyclePhase = z.infer<typeof insertLifecyclePhaseSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Subtask = typeof subtasks.$inferSelect;
export type InsertSubtask = z.infer<typeof insertSubtaskSchema>;

export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;

export type ASLVideo = typeof aslVideos.$inferSelect;
export type InsertASLVideo = z.infer<typeof insertASLVideoSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type VRCounselor = typeof vrCounselors.$inferSelect;
export type InsertVRCounselor = z.infer<typeof insertVRCounselorSchema>;

export type UserCounselor = typeof userCounselors.$inferSelect;
export type InsertUserCounselor = z.infer<typeof insertUserCounselorSchema>;

// Resource Library
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  source: text("source").notNull(),
  url: text("url"),
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array(),
  sbaRelated: boolean("sba_related").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  category: true,
  subcategory: true,
  source: true,
  url: true,
  fileUrl: true,
  thumbnailUrl: true,
  tags: true,
  sbaRelated: true,
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

// Business Formation tables

// Formation Providers
export const formationProviders = pgTable("formation_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFormationProviderSchema = createInsertSchema(formationProviders).pick({
  name: true,
  displayName: true,
  description: true,
  logoUrl: true,
  website: true,
  apiEndpoint: true,
  isActive: true,
});

export type FormationProvider = typeof formationProviders.$inferSelect;
export type InsertFormationProvider = z.infer<typeof insertFormationProviderSchema>;

// Business Formation Records
export const businessFormations = pgTable("business_formations", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").notNull(),
  providerOrderId: varchar("provider_order_id", { length: 100 }).notNull(),
  businessName: varchar("business_name", { length: 200 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // pending, processing, completed, failed
  submittedDate: timestamp("submitted_date").defaultNow(),
  estimatedCompletionDate: date("estimated_completion_date"),
  completedDate: timestamp("completed_date"),
  trackingUrl: text("tracking_url"),
  formationData: json("formation_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBusinessFormationSchema = createInsertSchema(businessFormations).pick({
  businessId: true,
  userId: true,
  providerId: true,
  providerOrderId: true,
  businessName: true,
  entityType: true,
  state: true,
  status: true,
  estimatedCompletionDate: true,
  trackingUrl: true,
  formationData: true,
});

export type BusinessFormation = typeof businessFormations.$inferSelect;
export type InsertBusinessFormation = z.infer<typeof insertBusinessFormationSchema>;

// Business Formation Documents
export const formationDocuments = pgTable("formation_documents", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  documentUrl: text("document_url").notNull(),
  documentType: varchar("document_type", { length: 50 }), // articles, operating agreement, EIN, etc.
  dateIssued: date("date_issued"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFormationDocumentSchema = createInsertSchema(formationDocuments).pick({
  formationId: true,
  name: true,
  documentUrl: true,
  documentType: true,
  dateIssued: true,
});

export type FormationDocument = typeof formationDocuments.$inferSelect;
export type InsertFormationDocument = z.infer<typeof insertFormationDocumentSchema>;

// Formation Provider API Keys
export const providerApiKeys = pgTable("provider_api_keys", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  keyName: varchar("key_name", { length: 100 }).notNull(),
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProviderApiKeySchema = createInsertSchema(providerApiKeys).pick({
  providerId: true,
  keyName: true,
  keyValue: true,
  isActive: true,
});

export type ProviderApiKey = typeof providerApiKeys.$inferSelect;
export type InsertProviderApiKey = z.infer<typeof insertProviderApiKeySchema>;

// ASL Business Dictionary
export const aslDictionaryTerms = pgTable("asl_dictionary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull().unique(),
  definition: text("definition").notNull(),
  category: text("category").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  signHints: text("sign_hints"),
  importance: text("importance").default("medium"), // beginner, intermediate, advanced
  tags: text("tags").array(),
  relatedTerms: text("related_terms").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAslDictionaryTermSchema = createInsertSchema(aslDictionaryTerms).pick({
  term: true,
  definition: true,
  category: true,
  videoUrl: true,
  thumbnailUrl: true,
  signHints: true,
  importance: true,
  tags: true,
  relatedTerms: true,
});

export type AslDictionaryTerm = typeof aslDictionaryTerms.$inferSelect;
export type InsertAslDictionaryTerm = z.infer<typeof insertAslDictionaryTermSchema>;

// Fibonrose Reputation System
export const fibonroseScores = pgTable("fibonrose_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  totalScore: integer("total_score").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFibonroseScoreSchema = createInsertSchema(fibonroseScores).pick({
  userId: true,
  totalScore: true,
  level: true,
});

export const fibonroseActivities = pgTable("fibonrose_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  pointsChange: integer("points_change").notNull(),
  newTotal: integer("new_total").notNull(),
  source: text("source").notNull(),
  details: json("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertFibonroseActivitySchema = createInsertSchema(fibonroseActivities).pick({
  userId: true,
  action: true,
  pointsChange: true,
  newTotal: true,
  source: true,
  details: true,
});

export const fibonroseBadges = pgTable("fibonrose_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertFibonroseBadgeSchema = createInsertSchema(fibonroseBadges).pick({
  userId: true,
  badgeId: true,
});

// Magician Actions Log
export const magicianActions = pgTable("magician_actions", {
  id: serial("id").primaryKey(),
  magicianId: text("magician_id").notNull(),
  userId: integer("user_id"),
  actionType: text("action_type").notNull(),
  action: text("action").notNull(),
  details: json("details"),
  success: boolean("success").notNull(),
  error: text("error"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMagicianActionSchema = createInsertSchema(magicianActions).pick({
  magicianId: true,
  userId: true,
  actionType: true,
  action: true,
  details: true,
  success: true,
  error: true,
});

// Workflow Recipes
export const workflowRecipes = pgTable("workflow_recipes", {
  id: serial("id").primaryKey(),
  recipeId: text("recipe_id").notNull().unique(),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(),
  triggerConfig: json("trigger_config").notNull(),
  actions: json("actions").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkflowRecipeSchema = createInsertSchema(workflowRecipes).pick({
  recipeId: true,
  name: true,
  triggerType: true,
  triggerConfig: true,
  actions: true,
  enabled: true,
  createdBy: true,
});

export type FibonroseScore = typeof fibonroseScores.$inferSelect;
export type InsertFibonroseScore = z.infer<typeof insertFibonroseScoreSchema>;
export type FibonroseActivity = typeof fibonroseActivities.$inferSelect;
export type InsertFibonroseActivity = z.infer<typeof insertFibonroseActivitySchema>;
export type FibonroseBadge = typeof fibonroseBadges.$inferSelect;
export type InsertFibonroseBadge = z.infer<typeof insertFibonroseBadgeSchema>;
export type MagicianAction = typeof magicianActions.$inferSelect;
export type InsertMagicianAction = z.infer<typeof insertMagicianActionSchema>;
export type WorkflowRecipe = typeof workflowRecipes.$inferSelect;
export type InsertWorkflowRecipe = z.infer<typeof insertWorkflowRecipeSchema>;

// ============================================================================
// Vocational Rehabilitation Compliance Tables
// ============================================================================

// VR Program Enrollment
export const vrEnrollment = pgTable("vr_enrollment", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  vrAgency: text("vr_agency").notNull(),
  vrCounselorId: integer("vr_counselor_id"),
  vrCounselorName: text("vr_counselor_name"),
  vrCounselorContact: text("vr_counselor_contact"),
  enrollmentDate: date("enrollment_date").notNull(),
  programType: text("program_type").notNull(), // self_employment, job_placement, training, supported_employment
  ipeApproved: boolean("ipe_approved").default(false),
  ipeApprovalDate: date("ipe_approval_date"),
  currentPhase: text("current_phase"), // assessment, planning, training, placement, stabilization
  caseStatus: text("case_status").notNull().default("active"), // active, completed, withdrawn, on_hold
  closureDate: date("closure_date"),
  successfulOutcome: boolean("successful_outcome"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVREnrollmentSchema = createInsertSchema(vrEnrollment).pick({
  userId: true,
  vrAgency: true,
  vrCounselorId: true,
  vrCounselorName: true,
  vrCounselorContact: true,
  enrollmentDate: true,
  programType: true,
  ipeApproved: true,
  ipeApprovalDate: true,
  currentPhase: true,
  caseStatus: true,
});

// VR Service Records
export const vrServiceRecords = pgTable("vr_service_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  serviceDate: date("service_date").notNull(),
  serviceType: text("service_type").notNull(), // assessment, counseling, training, job_coaching, equipment, accommodation
  serviceCost: integer("service_cost").default(0),
  serviceProvider: text("service_provider"),
  serviceDescription: text("service_description").notNull(),
  outcome: text("outcome"),
  notes: text("notes"),
  complianceStatus: text("compliance_status").notNull().default("compliant"), // compliant, pending_review, non_compliant
  regulationsCited: json("regulations_cited"), // Array of regulation references
  vrCounselorApproved: boolean("vr_counselor_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVRServiceRecordSchema = createInsertSchema(vrServiceRecords).pick({
  userId: true,
  serviceDate: true,
  serviceType: true,
  serviceCost: true,
  serviceProvider: true,
  serviceDescription: true,
  outcome: true,
  notes: true,
  complianceStatus: true,
  regulationsCited: true,
  vrCounselorApproved: true,
});

// VR Milestones and Progress Tracking
export const vrMilestones = pgTable("vr_milestones", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  milestoneName: text("milestone_name").notNull(),
  milestoneType: text("milestone_type").notNull(), // ipe_approval, training_completion, job_placement, stabilization
  targetDate: date("target_date"),
  completedDate: date("completed_date"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, overdue
  description: text("description"),
  verification: text("verification"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVRMilestoneSchema = createInsertSchema(vrMilestones).pick({
  userId: true,
  milestoneName: true,
  milestoneType: true,
  targetDate: true,
  completedDate: true,
  status: true,
  description: true,
  verification: true,
});

// ============================================================================
// Workforce Solutions and Compliance Tables
// ============================================================================

// Workforce Development Programs
export const workforceProgramEnrollment = pgTable("workforce_program_enrollment", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  programId: text("program_id").notNull(),
  programName: text("program_name").notNull(),
  programProvider: text("program_provider"),
  fundingSource: text("funding_source"), // WIOA, TAA, state, federal, private
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  expectedCompletionDate: date("expected_completion_date"),
  status: text("status").notNull().default("active"), // active, completed, withdrawn, on_hold
  programType: text("program_type").notNull(), // job_training, apprenticeship, certification, education
  industry: text("industry"),
  occupation: text("occupation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkforceProgramEnrollmentSchema = createInsertSchema(workforceProgramEnrollment).pick({
  userId: true,
  programId: true,
  programName: true,
  programProvider: true,
  fundingSource: true,
  startDate: true,
  endDate: true,
  expectedCompletionDate: true,
  status: true,
  programType: true,
  industry: true,
  occupation: true,
});

// Workforce Compliance Checks
export const workforceComplianceChecks = pgTable("workforce_compliance_checks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  programId: text("program_id").notNull(),
  checkType: text("check_type").notNull(), // attendance, performance, eligibility, progress
  checkDate: date("check_date").notNull(),
  passed: boolean("passed").notNull(),
  findings: text("findings"),
  correctiveActions: text("corrective_actions"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: date("follow_up_date"),
  regulationReference: text("regulation_reference"),
  auditorName: text("auditor_name"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkforceComplianceCheckSchema = createInsertSchema(workforceComplianceChecks).pick({
  userId: true,
  programId: true,
  checkType: true,
  checkDate: true,
  passed: true,
  findings: true,
  correctiveActions: true,
  followUpRequired: true,
  followUpDate: true,
  regulationReference: true,
  auditorName: true,
  notes: true,
});

// Employment Outcomes Tracking
export const employmentOutcomes = pgTable("employment_outcomes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  programId: text("program_id"),
  vrEnrollmentId: integer("vr_enrollment_id"),
  employerName: text("employer_name").notNull(),
  jobTitle: text("job_title").notNull(),
  industry: text("industry"),
  occupation: text("occupation"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  employmentType: text("employment_type").notNull(), // full_time, part_time, temporary, self_employment
  wage: integer("wage"),
  wageType: text("wage_type"), // hourly, salary, commission
  deafFriendlyWorkplace: boolean("deaf_friendly_workplace"),
  accommodationsProvided: boolean("accommodations_provided").default(false),
  accommodationDetails: text("accommodation_details"),
  retentionDays: integer("retention_days"), // Days employed for compliance
  successful90Day: boolean("successful_90_day"), // VR success metric
  successful180Day: boolean("successful_180_day"), // Workforce success metric
  outcomeStatus: text("outcome_status").notNull().default("active"), // active, retained, separated, layoff
  separationReason: text("separation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmploymentOutcomeSchema = createInsertSchema(employmentOutcomes).pick({
  userId: true,
  programId: true,
  vrEnrollmentId: true,
  employerName: true,
  jobTitle: true,
  industry: true,
  occupation: true,
  startDate: true,
  endDate: true,
  employmentType: true,
  wage: true,
  wageType: true,
  deafFriendlyWorkplace: true,
  accommodationsProvided: true,
  accommodationDetails: true,
  retentionDays: true,
  successful90Day: true,
  successful180Day: true,
  outcomeStatus: true,
  separationReason: true,
});

// Compliance Audit Trail
export const complianceAuditTrail = pgTable("compliance_audit_trail", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // vr_service, workforce_program, employment_outcome, magician_action
  entityId: integer("entity_id").notNull(),
  userId: integer("user_id"),
  auditType: text("audit_type").notNull(), // creation, modification, deletion, review, approval
  performedBy: text("performed_by").notNull(),
  performedAt: timestamp("performed_at").defaultNow(),
  changes: json("changes"),
  complianceImpact: text("compliance_impact"),
  regulationsAffected: json("regulations_affected"),
  notes: text("notes"),
});

export const insertComplianceAuditTrailSchema = createInsertSchema(complianceAuditTrail).pick({
  entityType: true,
  entityId: true,
  userId: true,
  auditType: true,
  performedBy: true,
  changes: true,
  complianceImpact: true,
  regulationsAffected: true,
  notes: true,
});

// ============================================================================
// Type Exports for VR and Workforce Compliance
// ============================================================================

export type VREnrollment = typeof vrEnrollment.$inferSelect;
export type InsertVREnrollment = z.infer<typeof insertVREnrollmentSchema>;
export type VRServiceRecord = typeof vrServiceRecords.$inferSelect;
export type InsertVRServiceRecord = z.infer<typeof insertVRServiceRecordSchema>;
export type VRMilestone = typeof vrMilestones.$inferSelect;
export type InsertVRMilestone = z.infer<typeof insertVRMilestoneSchema>;
export type WorkforceProgramEnrollment = typeof workforceProgramEnrollment.$inferSelect;
export type InsertWorkforceProgramEnrollment = z.infer<typeof insertWorkforceProgramEnrollmentSchema>;
export type WorkforceComplianceCheck = typeof workforceComplianceChecks.$inferSelect;
export type InsertWorkforceComplianceCheck = z.infer<typeof insertWorkforceComplianceCheckSchema>;
export type EmploymentOutcome = typeof employmentOutcomes.$inferSelect;
export type InsertEmploymentOutcome = z.infer<typeof insertEmploymentOutcomeSchema>;
export type ComplianceAuditTrail = typeof complianceAuditTrail.$inferSelect;
export type InsertComplianceAuditTrail = z.infer<typeof insertComplianceAuditTrailSchema>;

// ============================================================================
// Community Opportunities
// ============================================================================

// Opportunities table for personalized opportunity matching
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // gig, collaboration, grant, training, event, mentorship
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"), // business, accessibility, technology, community, education
  tags: text("tags").array(),
  requiredFibonrose: integer("required_fibonrose").notNull().default(0),
  targetAudience: text("target_audience").array(), // deaf, hard_of_hearing, asl_user, business_owner, entrepreneur
  budget: text("budget"),
  deadline: date("deadline"),
  location: text("location"), // remote, in_person, hybrid, specific location
  externalUrl: text("external_url"),
  contactEmail: text("contact_email"),
  contactName: text("contact_name"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // Higher priority = shown first
  postedBy: integer("posted_by"), // user id who posted
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).pick({
  type: true,
  title: true,
  description: true,
  category: true,
  tags: true,
  requiredFibonrose: true,
  targetAudience: true,
  budget: true,
  deadline: true,
  location: true,
  externalUrl: true,
  contactEmail: true,
  contactName: true,
  isActive: true,
  priority: true,
  postedBy: true,
  expiresAt: true,
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

// User interests for personalized opportunity matching
export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // business, accessibility, technology, community, education
  subcategories: text("subcategories").array(),
  skillLevel: text("skill_level"), // beginner, intermediate, advanced, expert
  lookingFor: text("looking_for").array(), // gigs, grants, collaborations, training, events, mentorship
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserInterestSchema = createInsertSchema(userInterests).pick({
  userId: true,
  category: true,
  subcategories: true,
  skillLevel: true,
  lookingFor: true,
});

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;
