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
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	content: text("content").notNull(),
}, (table) => {
	return {
		nameIdx: uniqueIndex("templates_name_idx").on(table.name),
	}
});

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
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
