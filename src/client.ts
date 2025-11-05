import { Client } from '@temporalio/client';
import { ec2SelfServiceWorkflow } from './workflows';

const RunEC2SelfServiceWorkflow = async (instanceName: string) => {
  const client = new Client();

  const workflowId = `vm-provision-${instanceName}-${crypto.randomUUID()}-${Date.now()}`;

  let result = await client.workflow.execute(ec2SelfServiceWorkflow, {
    staticSummary: `Self-Service EC2 Provisioning for ${instanceName}`,
    taskQueue: `${process.env.TASK_QUEUE_NAME}`,
    workflowId,
    args: [{ instanceName: instanceName }],
  });
  console.log(result);
}

const instanceName = process.argv[2] || 'INSTANCE_NAME';

RunEC2SelfServiceWorkflow(instanceName).catch((err) => {
  console.error(err);
  process.exit(1);
});