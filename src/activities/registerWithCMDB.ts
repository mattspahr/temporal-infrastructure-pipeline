import { mockServiceClient } from "../utils/mock-service-client";

export async function registerWithCMDB(instanceId: string): Promise<boolean> {
  const recordId = `INFRA-${instanceId}`;

  await mockServiceClient.cmdb.updateRecord(instanceId, recordId);

  return true;
}
