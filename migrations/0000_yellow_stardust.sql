CREATE TABLE IF NOT EXISTS "bloom_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bloom_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" text NOT NULL,
	"initial_message_content" text NOT NULL,
	"initial_message_timestamp" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "templates_name_idx" ON "bloom_templates" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_external_id_idx" ON "bloom_user" ("external_id");