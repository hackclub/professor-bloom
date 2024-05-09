import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export type User = {
	id: number;
	externalId: string;
	initialMessageContent: string;
	initialMessageTimestamp: Date;
}

export type UserTimestamps = {
	timestamp0: Date; // initial join timestamp
	timestamp1: Date; // seven day join timestamp
	timestamp2: Date; // thirty day join timestamp
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export async function addUser({ userId, joinReason }: {
	userId: string;
	joinReason: string;
}): Promise<User> {
	const result = await db
		.insert(users)
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

export async function getFollowupTimestamps(externalId: string): Promise<UserTimestamps> {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.externalId, externalId));

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
	}
}
