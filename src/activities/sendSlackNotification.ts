import { mockServiceClient } from "../utils/mock-service-client";

export async function sendSlackNotification(instanceId: string): Promise<boolean> {
    const message = `EC2 instance ${instanceId} has been successfully provisioned and configured`;
    await mockServiceClient.slack.sendNotification(instanceId, message);

    return true;
}
