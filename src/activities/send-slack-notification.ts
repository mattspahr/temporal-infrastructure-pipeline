import { post } from "../utils/httpbin-client";

export async function sendSlackNotification(instanceId: string): Promise<string> {
    try {
        const result = await post("service=slack&action=notify", {
            instanceId,
            channel: "#infrastructure",
            message: `EC2 instance ${instanceId} has been successfully provisioned and configured`,
            priority: "normal",
            timestamp: new Date().toISOString(),
        });

        console.log(`[Activity] Slack notification sent for ${instanceId}`);
        return `Notification sent for instance ${result.instanceId}`;
    } catch (err) {
        console.error(`[Activity] Slack notification failed for ${instanceId}:`, err);
        throw err;
    }
}
