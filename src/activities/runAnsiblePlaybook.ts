import { Context } from "@temporalio/activity";
import { post, get } from "../utils/httpbin-client";

export const runAnsiblePlaybook = async (instanceName: string): Promise<string> => {
    const context = Context.current();
    const playbookRunId = `ansible-${instanceName}-${context.info.workflowExecution.workflowId}-${context.info.activityId}`;

    console.log(`[Activity] Running Ansible playbook for ${instanceName} (${playbookRunId})`);

    const existingRun = await get(`service=ansible&action=get-playbook-run&runId=${playbookRunId}`)
        .catch(() => null);

    if (existingRun && existingRun.runId) {
        console.log(`[Activity] Playbook run ${playbookRunId} already exists, skipping execution`);
        return existingRun.runId;
    }

    await post("service=ansible&action=run-playbook", {
        runId: playbookRunId,
        instanceName,
        playbook: "webserver.yml",
        tasks: ["install_nginx", "configure_firewall", "deploy_app"]
    });

    console.log(`[Activity] Ansible playbook completed for ${instanceName}`);

    return playbookRunId;
};