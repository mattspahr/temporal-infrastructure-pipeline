import { Context, sleep } from "@temporalio/activity";
import { post } from "../utils/httpbin-client";

export const pollTerraformRun = async (runId: string): Promise<string> => {
  const context = Context.current();
  const STATUSES = ["pending", "planning", "applying", "applied"];

  console.log(`[Activity] Polling Terraform run ${runId}`);

  for (const status of STATUSES) {
    if (context.cancellationSignal.aborted) {
      console.log(`[Activity] Poll cancelled for ${runId}`);
      throw new Error("Polling cancelled");
    }

    const result = await post("service=terraform&action=heartbeat", {
      runId,
      status,
    });

    context.heartbeat(result.status);
    console.log(`[Heartbeat] ${runId} -> ${result.status}`);

    await sleep(2000);
  }

  console.log(`[Activity] Terraform run ${runId} completed successfully`);
  return "fail";
}
