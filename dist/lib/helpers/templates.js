"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.editTemplate = exports.addTemplate = exports.getAllTemplates = exports.getTemplate = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const DEV = process.env.NODE_ENV === "development";
async function getTemplate(name) {
    const result = await db_1.db
        .select()
        .from(schema_1.templates)
        .where((0, drizzle_orm_1.eq)(schema_1.templates.name, name));
    if (DEV)
        console.log(`DEBUG - Retrieved template ${name} from database.`);
    return result[0];
}
exports.getTemplate = getTemplate;
async function getAllTemplates() {
    const results = await db_1.db.select().from(schema_1.templates);
    if (DEV)
        console.log(`DEBUG - Retrieved all templates from database.`);
    return results;
}
exports.getAllTemplates = getAllTemplates;
async function addTemplate(name, content) {
    const result = await db_1.db.insert(schema_1.templates).values({ name, content }).returning();
    if (result.length === 0) {
        throw new Error("Could not add template");
    }
    if (DEV)
        console.log(`DEBUG - Added template ${name} to database.`);
    return result[0];
}
exports.addTemplate = addTemplate;
async function editTemplate(name, content) {
    const result = await db_1.db.select({
        id: schema_1.templates.id,
    }).from(schema_1.templates).where((0, drizzle_orm_1.eq)(schema_1.templates.name, name));
    if (result.length === 0) {
        throw new Error("Template does not exist");
    }
    await db_1.db.update(schema_1.templates).set({
        content,
    }).where((0, drizzle_orm_1.eq)(schema_1.templates.id, result[0].id));
    if (DEV)
        console.log(`DEBUG - Edited template ${name} in database. New content: ${content}`);
}
exports.editTemplate = editTemplate;
async function deleteTemplate(name) {
    await db_1.db.delete(schema_1.templates).where((0, drizzle_orm_1.eq)(schema_1.templates.name, name));
    if (DEV)
        console.log(`DEBUG - Deleted template ${name} from database.`);
}
exports.deleteTemplate = deleteTemplate;
//# sourceMappingURL=templates.js.map