import "dotenv/config";
import { z } from "zod";

// GOVERNANCE_CONTRACT_ADDRESS=
// PROJECT_CONTRACT_ADDRESS=
//LOCAL_PROVIDER_URL =

interface EnvVars {
    GOVERNANCE_CONTRACT_ADDRESS: string;
    PROJECT_CONTRACT_ADDRESS: string;
    LOCAL_PROVIDER_URL?: string;
}

const envsSchema = z.object({
    GOVERNANCE_CONTRACT_ADDRESS: z.string(),
    PROJECT_CONTRACT_ADDRESS: z.string(),
    LOCAL_PROVIDER_URL: z.string().optional(),
}).passthrough(); // Allows additional environment variables

const parsed = envsSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Config validation error: ${parsed.error.message}`);
}

export const envVars: EnvVars = parsed.data;

export const envs = {
    GOVERNANCE_CONTRACT_ADDRESS: envVars.GOVERNANCE_CONTRACT_ADDRESS,
    PROJECT_CONTRACT_ADDRESS: envVars.PROJECT_CONTRACT_ADDRESS,
    LOCAL_PROVIDER_URL: envVars.LOCAL_PROVIDER_URL,
};
