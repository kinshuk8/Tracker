import { pgTable, serial, text, timestamp, integer, boolean, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "intern", "admin"]);
export const planEnum = pgEnum("plan", ["1_month", "3_months", "6_months"]);
export const contentTypeEnum = pgEnum("content_type", ["text", "video", "test"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: roleEnum("role").default("user").notNull(),
  college: text("college"),
  phoneNumber: text("phone_number"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
}));

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  courseIdIdx: index("modules_course_id_idx").on(table.courseId),
  orderIdx: index("modules_order_idx").on(table.order),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  days: many(days),
  content: many(content),
}));

export const days = pgTable("days", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const daysRelations = relations(days, ({ one, many }) => ({
  module: one(modules, {
    fields: [days.moduleId],
    references: [modules.id],
  }),
  content: many(content),
}));

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id), // Made optional for backward compatibility or direct module content
  dayId: integer("day_id").references(() => days.id), // New field
  title: text("title").notNull(),
  type: contentTypeEnum("type").notNull(),
  data: text("data").notNull(), // Markdown for text, URL for video, JSON for test
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  moduleIdIdx: index("content_module_id_idx").on(table.moduleId),
  orderIdx: index("content_order_idx").on(table.order),
}));

export const contentRelations = relations(content, ({ one }) => ({
  module: one(modules, {
    fields: [content.moduleId],
    references: [modules.id],
  }),
  day: one(days, {
    fields: [content.dayId],
    references: [days.id],
  }),
}));

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  plan: planEnum("plan").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_progress_user_id_idx").on(table.userId),
  contentIdIdx: index("user_progress_content_id_idx").on(table.contentId),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userProgress.contentId],
    references: [content.id],
  }),
}));

export const internshipRegistrations = pgTable("internship_registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  college: text("college").notNull(),
  year: text("year").notNull(),
  internshipDuration: text("internship_duration").notNull(),
  courses: text("courses").array().notNull(), // using text array as it's simpler for array of strings in PG
  areaOfInterest: text("area_of_interest"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentId: text("payment_id").notNull(),
  orderId: text("order_id").notNull(),
  signature: text("signature").notNull(),
  amount: integer("amount").notNull(), // Amount in paise
  currency: text("currency").default("INR").notNull(),
  status: text("status").notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [payments.courseId],
    references: [courses.id],
  }),
}));
