import {
	index,
	uniqueIndex,
	pgTableCreator,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `bloom_${name}`);

export const templates = pgTable("templates", {
	id: serial("id").notNull().primaryKey(),
	name: text("name").notNull(),
	content: text("content").notNull(),
}, (table) => {
	return {
		nameIdx: uniqueIndex("templates_name_idx").on(table.name),
	}
});

export const users = pgTable("users", {
	id: serial("id").notNull().primaryKey(),
	externalId: text("external_id").notNull(), // Slack ID
	initialMessageContent: text("initial_message_content").notNull(),
	initialMessageTimestamp: timestamp("initial_message_timestamp", {
		precision: 3,
	}).notNull().defaultNow(),
}, (table) => {
	return {
		externalIdIdx: uniqueIndex("user_external_id_idx").on(table.externalId),
	}
});
