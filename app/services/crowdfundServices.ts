import { BrowserProvider, Contract, ContractRunner, ethers, JsonRpcProvider } from "ethers";
import { toast } from "react-toastify";

// struct Project {
//     uint256 id;
//     string name;
//     address payable recipient;
//     uint256 fundingGoal;
//     uint256 fundsRaised;
//     bool funded;
// }

// Result(2) [
//     Result(6) [
//       0n,
//       'Proyecto 1',
//       '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
//       100000000000000000000n,
//       0n,
//       false
//     ],
//     Result(6) [
//       1n,
//       'Proyecto 2',
//       '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
//       100000000000000000000n,
//       0n,
//       false
//     ]
//   ]

export type Project = {
    id: number;
    name: string;
    recipient: string;
    fundingGoal: number;
    fundsRaised: number;
    funded: boolean;
}
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

    // event ProjectCreated(uint256 id, string name, address recipient, uint256 fundingGoal);
    // event ProjectFunded(uint256 id, uint256 amount);
    // function createProject(string memory name, address payable recipient, uint256 fundingGoal) external {
    //     require(pymToken.balanceOf(msg.sender) >= MIN_PYM_FOR_PROJECT_CREATION, "No tiene suficientes tokens PYM para crear un proyecto");

    //     projects[projectCount] = Project({
    //         id: projectCount,
    //         name: name,
    //         recipient: recipient,
    //         fundingGoal: fundingGoal,
    //         fundsRaised: 0,
    //         funded: false
    //     });

    //     emit ProjectCreated(projectCount, name, recipient, fundingGoal);
    //     projectCount++;
    // }

    // function fundProjectWithPYM(uint256 projectId, uint256 amount) external {
    //     Project storage project = projects[projectId];
    //     require(!project.funded, "El proyecto ya ha sido financiado");
    //     require(project.fundsRaised + amount <= project.fundingGoal, "El monto excede la meta de financiamiento");

    //     pymToken.transferFrom(msg.sender, address(this), amount);
    //     project.fundsRaised += amount;
    //     pymToken.transfer(project.recipient, amount);

    //     if (project.fundsRaised >= project.fundingGoal) {
    //         project.funded = true;
    //     }

    //     emit ProjectFunded(projectId, amount);
    // }

    async createProject(name: string, recipient: string, fundingGoal: number): Promise<void> {
        try {
            const tx = await this.fundRaisingContract.createProject(name, recipient,ethers.parseUnits(fundingGoal.toString(), 18) );
            await tx.wait();
            this.fundRaisingContract.on('ProjectCreated', (id, name, recipient, fundingGoal) => {
                console.log('Project created: ', id, name, recipient, fundingGoal);
                toast.success(`
                    Proyecto creado: 
                    ID: ${id}
                    Nombre: ${name}
                    Destinatario: ${recipient}
                    Meta de financiamiento: ${fundingGoal}
                    `);
            }
            );
            
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error('Error creando proyecto');
            //throw error;
        }
    }

    async fundProject(projectId: number, amount: number): Promise<void> {
        try {
            const amountInWei = ethers.parseUnits(amount.toString(), 18);

            // Paso 1: Aprobar al contrato de fundraising para gastar tokens PYM
            const approveTx = await this.governanceContract.approve(await this.fundRaisingContract.getAddress(), amountInWei);
            await approveTx.wait();
            console.log('Aprobación de tokens PYM exitosa');

            // Paso 2: Llamar a fundProjectWithPYM
            const tx = await this.fundRaisingContract.fundProjectWithPYM(projectId, amountInWei);
            await tx.wait();
            console.log('Proyecto financiado exitosamente');
            toast.success('Proyecto financiado exitosamente');
        } catch (error) {
            console.error("Error funding project:", error);
            toast.error('Error financiando proyecto');
            throw error;
        }
    }

    async getProject(projectId: number): Promise<any> {
        try {
            const project =  await this.fundRaisingContract.projects(projectId);
            return {
                //id: Number(ethers.formatUnits(project[0], 18)),
                id: Number(project[0]),
                name: project[1],
                recipient: project[2],
                // fundingGoal: Number(project[3]),
                // fundsRaised: Number(project[4]),
                fundingGoal: Number(ethers.formatUnits(project[3], 18)),
                fundsRaised: Number(ethers.formatUnits(project[4], 18)),
                funded: project[5]
            }
        } catch (error) {
            console.error("Error getting project:", error);
            throw error;
        }
    }

    // function getAllProjects() external view returns (Project[] memory) {
    //     Project[] memory _projects = new Project[](projectCount);
    //     for (uint256 i = 0; i < projectCount; i++) {
    //         _projects[i] = projects[i];
    //     }
    //     return _projects;
    // }
    async getAllProjects(): Promise<Project[]|null> {
        try {
            const projects =  await this.fundRaisingContract.getAllProjects();
            return projects.map((project: any) => {
                return {
                    id: Number(project[0]),
                    name: project[1],
                    recipient: project[2],
                    fundingGoal: Number(ethers.formatUnits(project[3], 18)),
                    fundsRaised: Number(ethers.formatUnits(project[4], 18)),
                    funded: project[5]
                };
            });
        } catch (error) {
            console.error("Error getting projects:", error);
            toast.error('Error obteniendo proyectos');
            return null;
        }
    }
}