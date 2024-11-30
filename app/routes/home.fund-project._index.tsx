import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import { set, z } from 'zod'
import { PageHeader } from '~/components/PageHeader'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { useWallet } from '~/hooks/use-wallet'
import { Project } from '~/services/crowdfundServices'

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

// const formSchema = z.object({
//     // address: z.string().min(42, {
//     //   message: "La propuesta debe tener al menos 50 caracteres",
//     // }),
//     // amount: z.number().min(1, {
//     //     message: "La cantidad debe ser mayor a 0",
//     // }).positive(),

//     projectName: z.string().min(3, {
//         message: "El nombre del proyecto debe tener al menos 3 caracteres",
//     }).max(50, {
//         message: "El nombre y/o descripción del proyecto debe(n) tener menos de 50 caracteres",
//     }),
//     recipient: z.string().min(42, {
//         message: "La dirección del proyecto debe tener 42 caracteres",
//     }).max(42, {
//         message: "La dirección del proyecto debe tener 42 caracteres",
//     }),
//     fundingGoal: z.coerce.number().min(1, {
//         message: "La cantidad debe ser mayor a 0",
//     }).positive(),
//     })


function FundProjectIndex() {
    const { account, connectWallet, disconnectWallet, contractService } = useWallet()
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const fundRaisingService = contractService.getFundRaisingContractService();
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //       projectName: "",
    //       fundingGoal: 0,
    //     },

    //   })
    //   async function onSubmit(values: z.infer<typeof formSchema>) {
    //     console.log(values)
    //     setLoading(true);
    //     if (typeof window.ethereum !== 'undefined') {
    //         await fundRaisingService.createProject(values.projectName, values.recipient, Number(values.fundingGoal))
    //         .then(() => {
    //             form.reset();   
    //             setLoading(false);
    //             console.log('Proyecto creado');
    //         })
    //         .catch((error) => {
    //             setLoading(false);
    //             console.error('Error Creando proyecto ', error);
    //         });
    //     }
    // }

    // const [nameCounter, setNameCounter] = React.useState<number>(0);
    // const nameValue = form.watch('projectName');
    // useEffect(() => {
    //     setNameCounter(nameValue.length);
    // }, [nameValue])

    const [projects, setProjects] = React.useState<Project[] | []>([]);
    const getProjects = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const projects = await fundRaisingService.getAllProjects();
                if (projects) {
                    setProjects(projects);
                    console.log(projects)
                }
            } catch (error) {
                console.error('Error getting projects: ', error);
                toast.error('Error obteniendo proyectos');
            }
        }
    }

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            getProjects();
        }
    }, [])
    useEffect(() => {
        toast.info('Proyectos actualizándose') 
    }, [projects])
  return (
    <>
        <header className='text-start w-full flex flex-col space-y-2'>
                <h2 className='text-2xl font-semibold'>Proyectos</h2>
                <ul className='space-y-1'>
                    <li className='flex space-x-1 items-center'>
                        <Check className="text-primary" size={16}></Check>
                        <span>
                        El PYM equivale más o menos 50 PEN.
                        </span>
                    </li>
                </ul>
            </header>
            <Button variant={'secondary'} onClick={getProjects}>
                Recargar proyectos
            </Button>
            {
                (
                    <div className='grid grid-cols-2 gap-4'>
                    { projects.length> 0 && projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-xl'>Proyecto  {project.id}</CardTitle>
                                <CardDescription>
                                    Meta: {
                                    project.fundingGoal
                                } PYM </CardDescription>
                            </CardHeader>
                            <CardContent className='text-base pb-3 italic'>
                                <p >{ project.name }</p>
                            </CardContent>
                            <CardFooter className='flex-col space-y-2 text-sm'>
                                <div className='flex font-bold text-lg'>
                                    <p>
                                        {project.fundsRaised} PYM
                                    </p>
                                    <span>
                                        /
                                    </span>
                                    <p>
                                        {project.fundingGoal} PYM
                                    </p>
                                </div>
                                <div className='space-x-4'>
                                    <Button variant='default' onClick={() => navigate(`/home/fund-project/${project.id}`)}>
                                        Financiar
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                    {
                        projects.length === 0 && <p>No hay proyectos</p>
                    }
            </div>
                )
            }
    </>
  )
}

export default FundProjectIndex