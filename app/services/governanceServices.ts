import { BrowserProvider, Contract, ContractRunner, formatEther, JsonRpcProvider } from "ethers";

export type Proposal = {
    id: number;
    description: string;
    votesFor: number;
    votesAgainst: number;
    startTime: number;
    snapshotBlock: number;
    executed: boolean;
}

export class GovernanceServices {
    private provider!: BrowserProvider | JsonRpcProvider;
    private governanceContract!: Contract;
    // private signer!: ContractRunner;
    // private fundRaisingContract!: Contract;

    constructor( provider: BrowserProvider | JsonRpcProvider, governanceContract: Contract) {
        this.provider = provider;
        this.governanceContract = governanceContract;
        // this.signer = signer;
        // this.fundRaisingContract = fundRaisingContract;
    }

    public async getBalance(address: string) {
        try {
            const balance = await this.provider.getBalance(address)
            return formatEther(balance)
        }
        catch (error) {
            console.error('Error getting balance: ', error)
            return null
        }
    }
    public async getPYMBalance(address: string) {
        try {
            const [ balance, symbol, decimals, totalSupply ] = await Promise.all([
                this.governanceContract.balanceOf(address),
                this.governanceContract.symbol(),
                this.governanceContract.decimals(),
                this.governanceContract.totalSupply()
            ])
            console.log('PYM balance: ', balance)
            console.log('PYM balance formatted: ', formatEther(balance))
            console.log('Symbol: ', symbol)
            console.log('Decimals: ', decimals)
            console.log('Total supply: ', totalSupply)
            return {
                balance,
                formattedBalance: formatEther(balance),
                symbol,
                decimals,
                formattedTotalSupply: formatEther(totalSupply),
                totalSupply: totalSupply
            }
        }
        catch (error) {
            console.error('Error getting PYM balance: ', error)
            return null
        }
    }

    public async createProposal(description: string) {
        try {
            const tx = await this.governanceContract.createProposal(description)
            await tx.wait()
            console.log('Proposal created successfully')
        } catch (error) {
            console.error('Error creating proposal: ', error)
        }
    }

    public async voteOnProposal(proposalId: number, vote: number) {
        try {
            const tx = await this.governanceContract.vote(proposalId, vote)
            await tx.wait()
            console.log('Voted successfully')
        } catch (error) {
            console.error('Error voting on proposal: ', error)
        }
    }

    public async delegateVote(delegatee: string) {
        try {
            const tx = await this.governanceContract.delegateVote(delegatee)
            await tx.wait()
            console.log('Vote delegated successfully')
        } catch (error) {
            console.error('Error delegating vote: ', error)
        }
    }

    public async getProposal(proposalId: number): Promise<Proposal | null> {
        try {
            const proposal = await this.governanceContract.proposals(proposalId)
            console.log(proposal)
            return proposal.wait()
        } catch (error) {
            console.error('Error getting proposal: ', error)
            return null
        }
    }

    public async getProposals() {
        // [
        //     Result(7) [ 0n, 'Test Proposal 1', 0n, 0n, 1732844147n, 52n, false ],
        //     Result(7) [ 1n, 'Test Proposal 2', 0n, 0n, 1732844148n, 53n, false ],
        //     Result(7) [ 2n, 'Test Proposal 3', 0n, 0n, 1732844149n, 54n, false ]
        //   ]
        // struct Proposal {
        //     uint256 id;
        //     string description;
        //     uint256 votesFor;
        //     uint256 votesAgainst;
        //     uint256 startTime;
        //     uint256 snapshotBlock;
        //     bool executed;
        // }
        try {
            let proposals = await this.governanceContract.getAllProposals()
            console.log('Proposals: ', proposals)
            if (proposals.length > 0) {
                proposals = proposals.map((proposal: any) => {
                    // return {
                    //     id: proposal[0].toNumber(),
                    //     description: proposal[1],
                    //     votesFor: proposal[2].toNumber(),
                    //     votesAgainst: proposal[3].toNumber(),
                    //     startTime: proposal[4].toNumber(),
                    //     snapshotBlock: proposal[5].toNumber(),
                    //     executed: proposal[6]
                    // }
                    return {
                        id: Number(proposal[0]),
                        description: proposal[1],
                        votesFor: Number(proposal[2]),
                        votesAgainst: Number(proposal[3]),
                        startTime: Number(proposal[4]),
                        snapshotBlock: Number(proposal[5]),
                        executed: proposal[6]
                    };
                })
            }
            return proposals
        } catch (error) {
            console.error('Error getting proposals: ', error)
            return null
        }
    }

    public async getDelegatedVotes(address: string) {
        try {
            const votes = await this.governanceContract.delegatedVotes(address)
            return votes
        } catch (error) {
            console.error('Error getting delegated votes: ', error)
            return null
        }
    }
}
