import { eq } from "drizzle-orm";
import { db } from "../../db";
import { templates } from "../../db/schema";

export type Template = {
	id: number;
	name: string;
	content: string;
};

const DEV = process.env.NODE_ENV === "development";

export async function getTemplate(name: string): Promise<Template> {
	const result = await db
		.select()
		.from(templates)
		.where(eq(templates.name, name));

	if(DEV) console.log(`DEBUG - Retrieved template ${name} from database.`);

	return result[0];
}

export async function getAllTemplates(): Promise<Template[]> {
	const results = await db.select().from(templates);

	if(DEV) console.log(`DEBUG - Retrieved all templates from database.`);
	
	return results;
}

export async function addTemplate(name: string, content: string): Promise<Template> {
	const result = await db.insert(templates).values({ name, content }).returning();
	
	if (result.length === 0) {
		throw new Error("Could not add template");
	}

	if(DEV) console.log(`DEBUG - Added template ${name} to database.`);
	return result[0];
}

export async function editTemplate(name: string, content: string): Promise<void> {
	const result = await db.select({
		id: templates.id,
	}).from(templates).where(eq(templates.name, name));

	if (result.length === 0) {
		throw new Error("Template does not exist");
	}

	await db.update(templates).set({
		content,
	}).where(eq(templates.id, result[0].id));

	if(DEV) console.log(`DEBUG - Edited template ${name} in database. New content: ${content}`);
}

export async function deleteTemplate(name: string): Promise<void> {
	await db.delete(templates).where(eq(templates.name, name));

	if(DEV) console.log(`DEBUG - Deleted template ${name} from database.`);
}
