# temporal-infrastructure-pipeline

A demo project showing how Temporal orchestrates infrastructure provisioning workflows. This simulates an API-Driven, self-service EC2 provisioning pipeline using Terraform.

## What This Does

The workflow provisions an EC2 instance through these steps:

1. Create a Terraform run
2. Poll the run status of the run
3. Run Ansible playbook
    - If successful, send notifications in parallel
        - Slack Notification
        - Update CMDB Record
    - If failed, destroy the Terraform run and fail the workflow

![Workflow Diagram](./diagrams/workflow-text.png)

## Project Structure

```
src/
├── workflows.ts              # Main workflow orchestration
├── client.ts                 # Workflow execution trigger
├── worker.ts                 # Worker process
├── activities/
│   ├── createTerraformRun.ts       # Terraform run creation
│   ├── pollTerraformRun.ts         # Poll status of run
│   ├── destroyTerraformRun.ts      # Cleanup on failure
│   ├── run-ansible-playbook.ts     # Run Ansible playbook on new instance
│   ├── send-slack-notification.ts  # Send Slack notification
│   └── update-cmdb.ts              # Update CMDB record
└── utils/
    └── mock-service-client.ts      # Mock HTTP client for demo (replaces real APIs)
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
npm run start.watch
```

In another terminal, trigger the workflow:
```bash
npm run workflow
```
