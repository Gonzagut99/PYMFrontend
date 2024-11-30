declare global {
    interface Window {
        ethereum: any;
    }
}

const GOVERNANCE_CONTRACT_ADDRESS="0xB4461D1fA73e340846D0aE973C9E06c062b31925"
const PROJECT_CONTRACT_ADDRESS="0x1BcF48bE6ee9053Db9ea4c8400A96Bc360228eDf"
const LOCAL_PROVIDER_URL="http://localhost:8545"

import { envs } from 'config/envs';
import { BrowserProvider, Contract, parseEther, formatEther, JsonRpcProvider, ContractRunner } from 'ethers'
import governanceABI from '../contracts/Governance_ABI.json'
import projectFundingABI from '../contracts/ProjectFunding_ABI.json'
import { GovernanceServices } from './governanceServices';
import { FundRaisingServices } from './crowdfundServices';

// let provider: BrowserProvider | JsonRpcProvider
// let signer
// let contract: Contract
// const contractAddress = envs.GOVERNANCE_CONTRACT_ADDRESS
// const contractAbi = governanceABI

// const initialize = async () => {
//     //provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
//     if (typeof window.ethereum !== 'undefined') {
//         provider = new BrowserProvider(window.ethereum, 'sepolia')
//         signer = await provider.getSigner()
//         contract = new Contract(contractAddress, contractAbi, signer)
//     } else {
//         console.error('Please install MetaMask!')
//         provider = new JsonRpcProvider(envs.LOCAL_PROVIDER_URL)
//         signer = await provider.getSigner()
//         contract = new Contract(contractAddress, contractAbi, signer)
//     }
// }

// initialize()
export class ContractsService {
    private provider!: BrowserProvider | JsonRpcProvider;
    private signer!: ContractRunner;
    private governanceContract!: Contract;
    private fundRaisingContract!: Contract;
    private governanceContractService!: GovernanceServices;
    private fundsRaisingContractService!: FundRaisingServices;
    private governanceContractAddress = GOVERNANCE_CONTRACT_ADDRESS // envs.GOVERNANCE_CONTRACT_ADDRESS;
    private projectContractAddress = PROJECT_CONTRACT_ADDRESS // envs.PROJECT_CONTRACT_ADDRESS;|
    private governanceContractAbi = governanceABI;
    private projectFundingABI = projectFundingABI
    private account: string | null = null;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new BrowserProvider(window.ethereum, 'sepolia');
            this.signer = await this.provider.getSigner();
            this.governanceContract = new Contract(this.governanceContractAddress, this.governanceContractAbi, this.signer);
            this.fundRaisingContract = new Contract(this.projectContractAddress, this.projectFundingABI, this.signer);
            this.governanceContractService = new GovernanceServices(this.provider, this.governanceContract);
            this.fundsRaisingContractService = new FundRaisingServices(this.governanceContract, this.fundRaisingContract);
            
        } else {
            console.error('Please install MetaMask!');
            // this.provider = new JsonRpcProvider(envs.LOCAL_PROVIDER_URL);
            this.provider = new JsonRpcProvider(LOCAL_PROVIDER_URL);
            this.signer = await this.provider.getSigner();
            this.governanceContract = new Contract(this.governanceContractAddress, this.governanceContractAbi, this.signer);
            this.fundRaisingContract = new Contract(this.projectContractAddress, this.projectFundingABI, this.signer);
        }
    }

    public async requestAccount() {
        try {
            const accounts = await this.provider.send('eth_requestAccounts', [])
            this.account = accounts[0]
            return this.account
            // return accounts[0]
        }
        catch (error) {
            console.error('Error requesting accounts: ', error)
            return null
        }
    }

    public async disconnectAccount() {
        try {
            this.account = null;
            console.log('Account disconnected');
        } catch (error) {
            console.error('Error disconnecting account: ', error);
        }
    }
    public async getAccount() {
        return this.account;
    }

    public getGovernanceContract(): Contract {
        return this.governanceContract;
    }

    public getFundRaisingContract(): Contract {
        return this.fundRaisingContract;
    }

    public getContracts(): { governanceContract: Contract, fundRaisingContract: Contract } {
        return { governanceContract: this.governanceContract, fundRaisingContract: this.fundRaisingContract };
    }

    public getProvider(): BrowserProvider | JsonRpcProvider {
        return this.provider;
    }

    public getGovernanceContractService(): GovernanceServices {
        return this.governanceContractService;
    }

    public getFundRaisingContractService(): FundRaisingServices {
        return this.fundsRaisingContractService;
    }
}

//export const contractsService = new ContractsService(); //Watch this, I think it should be instanciated in the use effect

