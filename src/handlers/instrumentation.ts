interface UserTelData {
    slack_id: string;
    timestamp?: string; // RFC 3339 style datetime
    timezone: string;
    JoinOrigin: "unknown"; //TODO
    is_restricted: boolean;
}

export async function instrumentationRecordUser(u:UserTelData) {
    const ORCHID_API_KEY = process.env.ORCHID_API_KEY;
    if (!ORCHID_API_KEY) return;

    console.log("Trying to dispatch user to instrumentation")
    const res = await fetch("https://orchid.professorbloom.hackclub.com/instrumentation/user", {
        headers: {
            "Content-Type":"application/json",
            "X-API-Key":ORCHID_API_KEY
        },
        method: "POST",
        body: JSON.stringify(u)
    });

    if (!res.ok) {
        console.log("Failed to dispatch welcomeable to instrumentation", res.statusText)
    }

}