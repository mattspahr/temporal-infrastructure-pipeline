import { Worker } from '@temporalio/worker';
import * as activities from './activities';

export const run = async () => {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: `${process.env.TASK_QUEUE_NAME}`,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
