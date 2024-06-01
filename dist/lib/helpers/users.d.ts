export type User = {
    id: number;
    externalId: string;
    initialMessageContent: string;
    initialMessageTimestamp: Date;
};
export type UserTimestamps = {
    timestamp0: Date;
    timestamp1: Date;
    timestamp2: Date;
};
export declare function addUser({ userId, joinReason }: {
    userId: string;
    joinReason: string;
}): Promise<User>;
export declare function getFollowupTimestamps(externalId: string): Promise<UserTimestamps>;
