import { BrowserProvider, Contract, ContractRunner, JsonRpcProvider } from "ethers";

export class FundRaisingServices{
    // private provider!: BrowserProvider | JsonRpcProvider;
    // private signer!: ContractRunner;
    private governanceContract!: Contract;
    private fundRaisingContract!: Contract;

    constructor( governanceContract: Contract, fundRaisingContract: Contract ) {
        // this.provider = provider;
        // this.signer = signer;
        this.governanceContract = governanceContract;
        this.fundRaisingContract = fundRaisingContract;
    }

    async transferTokens(to: string, amount: string): Promise<void> {
        try {
            const tx = await this.governanceContract.transfer(to, amount);
            await tx.wait();
        } catch (error) {
            console.error("Error transferring tokens:", error);
            throw error;
        }
    }

    async createProject(name: string, recipient: string, fundingGoal: string): Promise<void> {
        try {
            const tx = await this.fundRaisingContract.createProject(name, recipient, fundingGoal);
            await tx.wait();
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    }

    async fundProject(projectId: number, amount: string): Promise<void> {
        try {
            const tx = await this.fundRaisingContract.fundProjectWithPYM(projectId, amount);
            await tx.wait();
        } catch (error) {
            console.error("Error funding project:", error);
            throw error;
        }
    }

    async getProject(projectId: number): Promise<any> {
        try {
            return await this.fundRaisingContract.projects(projectId);
        } catch (error) {
            console.error("Error getting project:", error);
            throw error;
        }
    }
}