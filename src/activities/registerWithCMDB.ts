import { mockServiceClient } from "../utils/mock-service-client";

export const registerWithCMDB = async (instanceId: string): Promise<boolean> => {
  const recordId = `INFRA-${instanceId}`;

  await mockServiceClient.cmdb.updateRecord(instanceId, recordId);

  return true;
}
