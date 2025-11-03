import { post } from "../utils/httpbin-client";

export const destroyTerraformRun = async (runId: string) => {
    await post("service=terraform&action=destroy-run", {
        runId
    });
    console.log(`[Activity] Destroying Terraform run ${runId}`);
}
    