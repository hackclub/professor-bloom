import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from './schema';

export const connection = postgres(process.env.DATABASE_URL!);
export const db = drizzle(connection, { schema });
