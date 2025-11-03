# temporal-infrastructure-pipeline

A demo project showing how Temporal orchestrates infrastructure provisioning workflows. This simulates an API-Driven, self-service EC2 provisioning pipeline using Terraform.

## What This Does

The workflow provisions an EC2 instance through these steps:

1. Create a Terraform run
2. Poll the run status of the run with heartbeats
3. If successful, send notifications in parallel
    - Slack Notification
    - Updated ServiceNow Ticket
4. If failed, destroy the Terraform run and fail the workflow

## Temporal Features Demonstrated

- **Idempotent activities** - Uses workflow and activity IDs to prevent duplicate Terraform runs
- **Activity heartbeats** - Long-running poll operation sends progress updates
- **Retry policies** - Different retry strategies for different activity types
- **Parallel execution** - Notifications run simultaneously
- **Error handling** - Automatic cleanup on failure
- **Durable execution** - Workflow survives worker restarts

## Project Structure

```
src/
├── workflows.ts              # Main workflow orchestration
├── client.ts                 # Workflow execution trigger
├── worker.ts                 # Worker process
├── activities/
│   ├── createTerraformRun.ts       # Idempotent run creation
│   ├── pollTerraformRun.ts         # Poll with heartbeats
│   ├── destroyTerraformRun.ts      # Cleanup on failure
│   ├── send-slack-notification.ts  # Send Slack notification
│   └── update-service-now.ts       # Update ServiceNow ticket
└── utils/
    └── httpbin-client.ts     # Mock HTTP client for demo (replaces real APIs)
```

## Setup

Install dependencies:
```bash
npm install
```

Set up environment variables:
```bash
cp .env.example .env
```

Start Temporal server:
```bash
temporal server start-dev
```

## Running the Workflow

Start the worker:
```bash
npm start
```

In another terminal, trigger the workflow:
```bash
npm run workflow
```
