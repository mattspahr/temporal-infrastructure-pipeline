import { Context } from "@temporalio/activity";
import { mockServiceClient } from "../utils/mock-service-client";

export const createTerraformRun = async (instanceName: string): Promise<string> => {
    const context = Context.current();
    const runId = `run-${instanceName}-${context.info.workflowExecution.workflowId}-${context.info.activityId}`;

    await mockServiceClient.terraform.createRun(runId, instanceName);

    return runId;
};