import { ApplicationFailure, CancellationScope, proxyActivities, sleep } from '@temporalio/workflow';
import * as activities from './activities';
import { WorkflowResponse } from './types/WorkflowResponse';

const { createTerraformRun } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

const { getTerraformRunStatus } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 minutes',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

const { runAnsiblePlaybook } = proxyActivities<typeof activities>({
  startToCloseTimeout: '3 minutes',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

const { sendSlackNotification, registerWithCMDB } = proxyActivities<typeof activities>({
  startToCloseTimeout: "10 seconds",
  retry: { initialInterval: "10 seconds", maximumAttempts: 2, backoffCoefficient: 2.0 },
});

const { destroyTerraformRun } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

export const ec2SelfServiceWorkflow = async (params: { instanceName: string }): Promise<WorkflowResponse> => {
  const { instanceName } = params;

  const terraformRunId = await createTerraformRun(instanceName);

  while (true) {
    const result = await getTerraformRunStatus(terraformRunId);

    if (result === "applied") {
      break;
    } else if (result === "failed") {
      throw ApplicationFailure.create({
        message: `Terraform run ${terraformRunId} failed`,
        type: "TerraformRunFailed",
      });
    }

    await sleep('5 seconds');
  }

  try {
    await sleep('10 seconds');

    await runAnsiblePlaybook(instanceName);
  } catch (error) {
    await CancellationScope.nonCancellable(async () => {
      await destroyTerraformRun(terraformRunId);
    });
    
    throw ApplicationFailure.create({
      message: `Ansible playbook failed for instance ${instanceName}`,
      type: "AnsiblePlaybookFailed",
    });
  }

  await Promise.all([
    registerWithCMDB(instanceName),
    sendSlackNotification(instanceName),
  ]);

  return {
    terraformRunId,
    instanceName,
    status: "success",
  };

}