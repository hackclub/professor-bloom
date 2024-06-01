"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowupTimestamps = exports.addUser = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
async function addUser({ userId, joinReason }) {
    const result = await db_1.db
        .insert(schema_1.users)
        .values({
        externalId: userId,
        initialMessageContent: joinReason,
        initialMessageTimestamp: new Date(),
    })
        .returning();
    if (result.length === 0) {
        throw new Error("User does not exist");
    }
    return result[0];
}
exports.addUser = addUser;
async function getFollowupTimestamps(externalId) {
    const result = await db_1.db
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.externalId, externalId));
    if (result.length === 0) {
        throw new Error("User does not exist");
    }
    const user = result[0];
    const initialTimestamp = user.initialMessageTimestamp;
    const sevenDayTimestamp = new Date(initialTimestamp.getTime() + SEVEN_DAYS);
    const thirtyDayTimestamp = new Date(initialTimestamp.getTime() + THIRTY_DAYS);
    return {
        timestamp0: initialTimestamp,
        timestamp1: sevenDayTimestamp,
        timestamp2: thirtyDayTimestamp,
    };
}
exports.getFollowupTimestamps = getFollowupTimestamps;
//# sourceMappingURL=users.js.map