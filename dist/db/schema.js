"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.templates = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pgTable = (0, pg_core_1.pgTableCreator)((name) => `bloom_${name}`);
exports.templates = pgTable("templates", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
}, (table) => {
    return {
        nameIdx: (0, pg_core_1.uniqueIndex)("templates_name_idx").on(table.name),
    };
});
exports.users = pgTable("users", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    externalId: (0, pg_core_1.text)("external_id").notNull(),
    initialMessageContent: (0, pg_core_1.text)("initial_message_content").notNull(),
    initialMessageTimestamp: (0, pg_core_1.timestamp)("initial_message_timestamp", {
        precision: 3,
    }).notNull().defaultNow(),
}, (table) => {
    return {
        externalIdIdx: (0, pg_core_1.uniqueIndex)("user_external_id_idx").on(table.externalId),
    };
});
//# sourceMappingURL=schema.js.map