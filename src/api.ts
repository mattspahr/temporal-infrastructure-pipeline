import express from 'express';
import { Client } from '@temporalio/client';
import { ec2SelfServiceWorkflow } from './workflows';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/provision', async (req, res) => {
  try {
    const { instanceName } = req.body;

    if (!instanceName) {
      return res.status(400).json({ 
        error: 'instanceName is required' 
      });
    }

    const client = new Client();
    const workflowId = `vm-provision-${instanceName}-${crypto.randomUUID()}-${Date.now()}`;

    const handle = await client.workflow.start(ec2SelfServiceWorkflow, {
      staticSummary: `Self-Service EC2 Provisioning for ${instanceName}`,
      taskQueue: `${process.env.TASK_QUEUE_NAME}`,
      workflowId,
      args: [{ instanceName }],
    });

    res.json({
      message: 'Workflow started',
      workflowId,
      runId: handle.firstExecutionRunId,
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ 
      error: 'Failed to start workflow',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
  console.log(`\nTrigger workflow with:`);
  console.log(`curl -X POST http://localhost:${PORT}/provision \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"instanceName": "my-instance"}'`);
});
