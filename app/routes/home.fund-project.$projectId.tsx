import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
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

const formSchema = z.object({
    // address: z.string().min(42, {
    //   message: "La propuesta debe tener al menos 50 caracteres",
    // }),
    // amount: z.number().min(1, {
    //     message: "La cantidad debe ser mayor a 0",
    // }).positive(),

    projectId: z.coerce.number().min(0, {
        message: "El id del proyecto debe ser mayor a 0",
    }),
    amount: z.coerce.number().min(1, {
        message: "La cantidad debe ser mayor a 0",
    }).positive(),
    })


function FundProjectForm() {
    const params = useParams();
    const projectId = params.projectId;


    const { account, connectWallet, disconnectWallet, contractService } = useWallet()
    const [loading, setLoading] = React.useState<boolean>(false);
    const fundRaisingService = contractService.getFundRaisingContractService();
    
    // const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: Number(projectId),
            amount: 0,
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true);
        if (typeof window.ethereum !== 'undefined') {
            await fundRaisingService.fundProject(values.projectId, values.amount)
            .then(() => {
                form.reset();   
                setLoading(false);
                console.log('Proyecto financiado');
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error financiando proyecto ', error);
            });
        }
    }

    // // const [nameCounter, setNameCounter] = React.useState<number>(0);
    // // const nameValue = form.watch('projectName');
    // // useEffect(() => {
    // //     setNameCounter(nameValue.length);
    // // }, [nameValue])

    // const [projects, setProjects] = React.useState<Project[] | []>([]);
    // const getProjects = async () => {
    //     if (typeof window.ethereum !== 'undefined') {
    //         try {
    //             const projects = await fundRaisingService.getAllProjects();
    //             if (projects) {
    //                 setProjects(projects);
    //                 console.log(projects)
    //             }
    //         } catch (error) {
    //             console.error('Error getting projects: ', error);
    //             toast.error('Error obteniendo proyectos');
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (typeof window.ethereum !== 'undefined') {
    //         getProjects();
    //     }
    // }, [])
    // useEffect(() => {
    //     toast.info('Propuestas actualizándose')
    // }, [projects])

    const [project, setProject] = React.useState<Project | undefined>();
    const getProject = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const project = await fundRaisingService.getProject(Number(projectId));
                if (project) {
                    setProject(project);
                    console.log(project)
                }
            } catch (error) {
                console.error('Error getting projects: ', error);
                toast.error('Error obteniendo proyectos');
            }
        }
    }

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            getProject();
        }
    }, [])
    useEffect(() => {
        toast.info('Proyectos actualizándose') 
    }, [project])

    return (
        <>
            {
                !project &&
                (
                    <Button variant={'secondary'} onClick={getProject}>
                            Recargar proyectos
                        </Button>
                )
            }
            {
                project &&
                <>
                    <header className='text-start w-full flex flex-col space-y-4'>
                            <h2 className='text-xl font-semibold'>Proyecto {projectId}</h2>
                            <div className='space-y-0'>
                                <p className='font-normal text-lg italic'>
                                    {project.name}
                                </p>
                                <p className={
                                    project.funded ? 'text-green-600' : 'text-red-600'
                                }>{
                                    project.funded ? 'Financiado' : 'En proceso'
                                }</p>
                            </div>
                            <ul className='space-y-1'>
                                <li className='flex space-x-1 items-center'>
                                    <Check className="text-primary" size={16}></Check>
                                    <span>
                                        El PYM equivale más o menos 50 PEN.
                                    </span>
                                </li>
                            </ul>
                            
                            <Card className='flex items-center justify-center p-4'>
                                <div className='flex w-full text-center'>
                                    <div className='basis-1/2 flex flex-col space-y-1'>
                                        <p>Recaudado</p>
                                        <p className='font-black text-2xl text-primary'>
                                            {project.fundsRaised} PYM
                                        </p>
                                    </div>
                                    <Separator orientation='vertical' className='h-14'></Separator>
                                    <div className='basis-1/2  flex flex-col space-y-1'>
                                        <p>Meta</p>
                                        <p className='font-black text-2xl'>
                                            {
                                                project.fundingGoal
                                            } PYM
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            
                        </header>
                        <Separator></Separator>
                        <Form {...form}>
                            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name='projectId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Id del proyecto:
                                                </FormLabel>
                                                <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Cifra de financiamiento'
                                                    className='w-full p-2 border border-gray-300 rounded-md'
                                                    disabled
                                                ></Input>
                                                </FormControl>
                                                {/* <FormDescription className={nameCounter<=50 && nameCounter>=3?'text-green-600':'text-red-600'}>
                                                    <span>
                                                        {nameCounter}/{
                                                            nameCounter <= 3 ? 'min(3)' : 'max(50)'
                                                        }
                                                    </span>
                                                </FormDescription> */}
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    ></FormField>
                                    <FormField
                                        control={form.control}
                                        name='amount'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Monto a financiar:
                                                </FormLabel>
                                                <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Cifra de financiamiento'
                                                    className='w-full p-2 border border-gray-300 rounded-md'
                                                ></Input>
                                                </FormControl>
                                                {/* <FormDescription className={nameCounter<=50 && nameCounter>=3?'text-green-600':'text-red-600'}>
                                                    <span>
                                                        {nameCounter}/{
                                                            nameCounter <= 3 ? 'min(3)' : 'max(50)'
                                                        }
                                                    </span>
                                                </FormDescription> */}
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )}
                                    ></FormField>
                                    
                                    <Button variant={'default'} type='submit' disabled={loading}>
                                        {
                                            !loading ? 'Financiar' : 'Enviando tokens...'
                                        }
                                    </Button>
                            </form>
                            
                        </Form>
                </>
            }
        </>
    )
    
     
        
}

export default FundProjectForm