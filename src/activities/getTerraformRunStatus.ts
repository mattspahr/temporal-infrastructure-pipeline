import { mockServiceClient } from "../utils/mock-service-client";

export const getTerraformRunStatus = async (runId: string): Promise<string> => {
    return (await mockServiceClient.terraform.pollRunStatus(runId)).status;
}
