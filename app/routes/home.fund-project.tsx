import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, Outlet, useNavigate } from 'react-router'
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


function FundProject() {
    // const { account, connectWallet, disconnectWallet, contractService } = useWallet()
    // const [loading, setLoading] = React.useState<boolean>(false);
    // const navigate = useNavigate();
    // const fundRaisingService = contractService.getFundRaisingContractService();
    // // const form = useForm<z.infer<typeof formSchema>>({
    // //     resolver: zodResolver(formSchema),
    // //     defaultValues: {
    // //       projectName: "",
    // //       fundingGoal: 0,
    // //     },

    // //   })
    // //   async function onSubmit(values: z.infer<typeof formSchema>) {
    // //     console.log(values)
    // //     setLoading(true);
    // //     if (typeof window.ethereum !== 'undefined') {
    // //         await fundRaisingService.createProject(values.projectName, values.recipient, Number(values.fundingGoal))
    // //         .then(() => {
    // //             form.reset();   
    // //             setLoading(false);
    // //             console.log('Proyecto creado');
    // //         })
    // //         .catch((error) => {
    // //             setLoading(false);
    // //             console.error('Error Creando proyecto ', error);
    // //         });
    // //     }
    // // }

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
  return (
    <>
        <PageHeader title='Financiar proyecto' imgSrc='https://cdn.prod.website-files.com/63221311eb23d056d942a379/63d6c41a20934a2a2a3ef75c_Crypto_Header_left.webp'></PageHeader>
        <section className='w-full space-y-6'>
            
            <Outlet></Outlet>
            {/* <Button variant={'secondary'} onClick={getProjects}>
                Recargar proyectos
            </Button>
            {
                (
                    <div className='grid grid-cols-2 gap-4'>
                    { projects.length> 0 && projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <CardTitle>Proyecto  {project.id}</CardTitle>
                                <CardDescription>
                                    Meta: {
                                    project.fundingGoal
                                } PYM </CardDescription>
                            </CardHeader>
                            <CardContent className='text-base space-y-1'>
                                <p >{ project.name }</p>
                            </CardContent>
                            <CardFooter className='flex-col space-y-2 text-sm'>
                                <div className='flex'>
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
            } */}
            {/* <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    
                        <FormField
                            control={form.control}
                            name='projectName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nombre del proyecto
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Nombre y/o descripción del proyecto'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Input>
                                    </FormControl>
                                    <FormDescription className={nameCounter<=50 && nameCounter>=3?'text-green-600':'text-red-600'}>
                                        <span>
                                            {nameCounter}/{
                                                nameCounter <= 3 ? 'min(3)' : 'max(50)'
                                            }
                                        </span>
                                    </FormDescription>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name='recipient'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Receptor:
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Cuenta a la que se depositará'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Input>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name='fundingGoal'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Monto de la meta en PYM:
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Cuenta a la que se depositará'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Input>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button variant={'default'} type='submit' disabled={loading}>
                            {
                                !loading ? 'Crear proyecto' : 'Creando proyecto...'
                            }
                        </Button>
                </form>
                
            </Form> */}
        </section>
    </>
  )
}

export default FundProject