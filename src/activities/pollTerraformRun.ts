import { Context } from "@temporalio/activity";
import { mockServiceClient } from "../utils/mock-service-client";

export const pollTerraformRun = async (runId: string): Promise<string> => {
  const { heartbeat } = Context.current();
  const PHASES = ["pending", "planning", "applying", "applied"];

  for (const phase of PHASES) {
    const result = await mockServiceClient.terraform.pollRunStatus(runId, phase);

    heartbeat(result.status)

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return "success";
}
