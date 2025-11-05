import { Context } from "@temporalio/activity";
import { mockServiceClient } from "../utils/mock-service-client";

export const runAnsiblePlaybook = async (instanceName: string): Promise<string> => {
    const context = Context.current();
    const playbookRunId = `ansible-${instanceName}-${context.info.workflowExecution.workflowId}-${context.info.activityId}`;

    await mockServiceClient.ansible.runPlaybook(playbookRunId, instanceName);
    return playbookRunId;
};