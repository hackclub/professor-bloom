import postgres from "postgres";
import * as schema from './schema';
export declare const connection: postgres.Sql<{}>;
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema>;
