import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, connection } from "../src/db";

async function main() {
  await migrate(db, { migrationsFolder: "./migrations" });
  await connection.end();
}

main();
