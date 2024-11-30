import { BrowserProvider, Contract, ContractRunner, ethers, formatEther, JsonRpcProvider } from "ethers";
import { toast } from "react-toastify";

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
            // // Esperar a que la transacción sea minada
            // const receipt = await tx.wait();
            // console.log('Transaction mined:', receipt);
            // Escuchar el evento ProposalCreated
            this.governanceContract.on('ProposalCreated', (id, description) => {
                console.log(`Proposal created with ID: ${id}, Description: ${description}`);
                // Aquí puedes actualizar el estado de tu aplicación o realizar otras acciones
                toast.success(`Propuesta creada: ID: ${id}, Description: ${description}`);
            });
            console.log('Proposal created successfully')
            
        } catch (error:any) {
            console.error('Error creating proposal: ', error);
            if (error.code === 4001) {
                toast.error('Transacción rechazada por el usuario');
            } else if (error.message.includes('No tiene suficientes tokens PYM')) {
                toast.error('No tienes suficientes tokens PYM');
            } else {
                toast.error('Error creando la propuesta');
            }
        }
    }

    public async voteOnProposal(proposalId: number, vote: number) {
        try {
            const tx = await this.governanceContract.vote(proposalId, vote)
            await tx.wait()
            console.log('Voted successfully')

            this.governanceContract.on('Voted', (proposalId, support, voter) => {
                console.log(`Voted on proposal: ${proposalId}, Support: ${support}, Voter: ${voter}`);
                // Aquí puedes actualizar el estado de tu aplicación o realizar otras acciones
                toast.success(`Votaste en la propuesta: ${proposalId}, ${support == 1 ? 'A favor':'En contra'}, Votante: ${voter}`);
            })
        } catch (error:any) {
            console.error('Error voting on proposal: ', error)
            // toast.error('Error votando en la propuesta')
            console.error('Error voting on proposal: ', error);
            if (error.code === 4001) {
                toast.error('Transacción rechazada por el usuario');
            } else if (error.message.includes('La votacion no ha comenzado')) {
                toast.error('La votación no ha comenzado');
            } else if (error.message.includes('La votacion ha terminado')) {
                toast.error('La votación ha terminado');
            } else if (error.message.includes('Ya has votado en esta propuesta')) {
                toast.error('Ya has votado en esta propuesta');
            } else if (error.message.includes('No tienes poder de voto')) {
                toast.error('No tienes poder de voto');
            } else if (error.message.includes('Opcion de voto invalida')) {
                toast.error('Opción de voto inválida');
            } else {
                toast.error('Error votando en la propuesta');
            }
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
            return {
                id: Number(proposal[0]),
                description: proposal[1],
                votesFor: Number(proposal[2]),
                votesAgainst: Number(proposal[3]),
                startTime: Number(proposal[4]),
                snapshotBlock: Number(proposal[5]),
                executed: proposal[6]
            }
        } catch (error) {
            console.error('Error getting proposal: ', error)
            return null
        }
    }

    public async getProposals(): Promise<Proposal[] | null> {
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

    public async mintTokens(to: string, amount: number) {
        try {
            const tx = await this.governanceContract.mint(to, ethers.parseUnits(amount.toString(), 18));
            await tx.wait();
            console.log('Tokens minted successfully');
            toast.success('Tokens enviadas exitosamente');
        } catch (error: any) {
            console.error('Error minting tokens: ', error);
            if (error.code === 4001) {
                toast.error('Transaction rejected by user');
            } else {
                toast.error('Error enviando tokens');
            }
        }
    }
}
