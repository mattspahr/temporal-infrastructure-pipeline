import { ApplicationFailure, proxyActivities } from '@temporalio/workflow';
import * as activities from './activities';

const { createTerraformRun } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

const { pollTerraformRun } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 minutes',
  heartbeatTimeout: '10 seconds',
  retry: {
    initialInterval: '10 seconds',
    maximumAttempts: 3,
    backoffCoefficient: 2.0,
  },
});

const { sendSlackNotification, updateServiceNow } = proxyActivities<typeof activities>({
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

export const ec2SelfServiceWorkflow = async (params: { instanceName: string }): Promise<{ terraformRunId: string, instanceName: string, status: string }> => {
  const { instanceName } = params;

  const terraformRunId = await createTerraformRun(instanceName);

  const result = await pollTerraformRun(terraformRunId);

  if (result !== "success") {
    await destroyTerraformRun(terraformRunId);
    throw ApplicationFailure.create({
      message: `Terraform run ${terraformRunId} failed`,
      type: "TerraformRunFailed",
    });
  }

  console.log(`[Workflow] Provisioned instance ${instanceName} (${terraformRunId}) successfully.`);

  await Promise.all([
    sendSlackNotification(instanceName),
    updateServiceNow(instanceName),
  ]);

  return {
    terraformRunId,
    instanceName,
    status: "success",
  };
}