import { post } from "../utils/httpbin-client";

export async function updateServiceNow(instanceId: string): Promise<string> {
  try {
    const result = await post("service=servicenow&action=update", {
      instanceId,
      ticketId: "INFRA-1234",
      status: "Done",
      comment: `EC2 instance ${instanceId} provisioned successfully`,
      assignee: "devops-team",
      timestamp: new Date().toISOString(),
    });

    console.log(`[Activity] ServiceNow ticket updated for ${instanceId}`);
    return `ServiceNow ticket updated for instance ${result.instanceId}`;
  } catch (err) {
    console.error(`[Activity] ServiceNow update failed for ${instanceId}:`, err);
    throw err;
  }
}
