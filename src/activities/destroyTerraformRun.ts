import { mockServiceClient } from "../utils/mock-service-client";

export const destroyTerraformRun = async (runId: string): Promise<void> => {
    await mockServiceClient.terraform.destroyRun(runId);
}
    