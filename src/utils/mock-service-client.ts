export const mockServiceClient = {
  terraform: {
    createRun: async (runId: string, instanceName: string): Promise<{ runId: string }> => {
      await simulateDelay(500);
      return { runId };
    },

    pollRunStatus: async (runId: string): Promise<{ status: string }> => {
      await simulateDelay(500);
      return { status: getRunStatus() };
    },

    destroyRun: async (runId: string): Promise<void> => {
      await simulateDelay(500);
    },
  },

  ansible: {
    runPlaybook: async (playbookRunId: string, instanceName: string): Promise<{ runId: string }> => {
      await simulateDelay(2000);
      return { runId: playbookRunId };
    }
  },

  slack: {
    sendNotification: async (instanceId: string, message: string): Promise<{ success: boolean }> => {
      await simulateDelay(500);
      return { success: true };
    },
  },

  cmdb: {
    updateRecord: async (instanceId: string, recordId: string): Promise<{ recordId: string }> => {
      await simulateDelay(500);
      return { recordId };
    }
  },
};

let index = 0;
const getRunStatus = (): string => {
  const terraformRunStatuses: string[] = ["pending", "planning", "applying", "applied"];
  return terraformRunStatuses[index++ % terraformRunStatuses.length];
}

const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
