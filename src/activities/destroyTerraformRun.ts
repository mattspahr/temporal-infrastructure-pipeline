import { mockServiceClient } from "../utils/mock-service-client";

export const destroyTerraformRun = async (runId: string): Promise<void> => {
    console.log(`Destroying Terraform run ${runId}`)
    await mockServiceClient.terraform.destroyRun(runId);
}
    