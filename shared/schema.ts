import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Property categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  slug: text("slug").notNull().unique(),
  listingCount: integer("listing_count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  listingCount: true,
});

// Property listings
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: doublePrecision("price").notNull(),
  securityDeposit: doublePrecision("security_deposit").notNull(),
  location: text("location").notNull(),
  ownerId: integer("owner_id").notNull(),
  categoryId: integer("category_id").notNull(),
  rating: doublePrecision("rating").default(0),
  rentalCount: integer("rental_count").default(0),
  features: text("features").array(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  rating: true,
  rentalCount: true,
  createdAt: true,
});

// Rental transactions
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  renterId: integer("renter_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  securityDeposit: doublePrecision("security_deposit").notNull(),
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"), // pending, active, completed, canceled
  contractAddress: text("contract_address"),
  smartContractId: text("smart_contract_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRentalSchema = createInsertSchema(rentals).omit({
  id: true,
  transactionHash: true,
  status: true,
  contractAddress: true,
  smartContractId: true,
  createdAt: true,
});

// Smart contracts (mock)
export const smartContracts = pgTable("smart_contracts", {
  id: serial("id").primaryKey(),
  contractAddress: text("contract_address").notNull(),
  rentalId: integer("rental_id").notNull(),
  depositAmount: doublePrecision("deposit_amount").notNull(),
  rentalAmount: doublePrecision("rental_amount").notNull(),
  isDeployed: boolean("is_deployed").default(false),
  deploymentHash: text("deployment_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSmartContractSchema = createInsertSchema(smartContracts).omit({
  id: true,
  isDeployed: true,
  deploymentHash: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Rental = typeof rentals.$inferSelect;
export type InsertRental = z.infer<typeof insertRentalSchema>;

export type SmartContract = typeof smartContracts.$inferSelect;
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
