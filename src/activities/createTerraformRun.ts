import { Context } from "@temporalio/activity";
import { post, get } from "../utils/httpbin-client";

export const createTerraformRun = async (instanceName: string): Promise<string> => {
    const context = Context.current();
    const runId = `run-${instanceName}-${context.info.workflowExecution.workflowId}-${context.info.activityId}`;

    console.log(`[Activity] Creating Terraform Run for ${instanceName} (${runId})`);

    const existingRun = await get(`service=terraform&action=get-run&runId=${runId}`)
        .catch(() => null);

    if (existingRun && existingRun.runId) {
        console.log(`[Activity] Run ${runId} already exists, skipping creation`);
        return existingRun.runId;
    }

    await post("service=terraform&action=create-run", {
        runId
    });

    return runId;
};