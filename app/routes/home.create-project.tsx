import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { set, z } from 'zod'
import { PageHeader } from '~/components/PageHeader'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useWallet } from '~/hooks/use-wallet'

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

    projectName: z.string().min(3, {
        message: "El nombre del proyecto debe tener al menos 3 caracteres",
    }).max(50, {
        message: "El nombre y/o descripción del proyecto debe(n) tener menos de 50 caracteres",
    }),
    recipient: z.string().min(42, {
        message: "La dirección del proyecto debe tener 42 caracteres",
    }).max(42, {
        message: "La dirección del proyecto debe tener 42 caracteres",
    }),
    fundingGoal: z.coerce.number().min(1, {
        message: "La cantidad debe ser mayor a 0",
    }).positive(),
    })


function CreateProject() {
    const { account, connectWallet, disconnectWallet, contractService } = useWallet()
    const [loading, setLoading] = React.useState<boolean>(false);
    const fundRaisingService = contractService.getFundRaisingContractService();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          projectName: "",
          fundingGoal: 0,
        },

      })
      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true);
        if (typeof window.ethereum !== 'undefined') {
            await fundRaisingService.createProject(values.projectName, values.recipient, Number(values.fundingGoal))
            .then(() => {
                form.reset();   
                setLoading(false);
                console.log('Proyecto creado');
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error Creando proyecto ', error);
            });
        }
    }

    const [nameCounter, setNameCounter] = React.useState<number>(0);
    const nameValue = form.watch('projectName');
    useEffect(() => {
        setNameCounter(nameValue.length);
    }, [nameValue])
  return (
    <>
        <PageHeader title='Crear proyecto' imgSrc='https://www.alterfinancegroup.com/wp-content/uploads/2019/11/que-es-el-crowdfunding.jpg'></PageHeader>
        <section className='w-full space-y-6'>
            <header className='text-start w-full flex flex-col space-y-2'>
                <h2 className='text-2xl font-semibold'>Proyectos</h2>
                <ul className='space-y-1'>
                    <li className='flex space-x-1 items-center'>
                        <Check className="text-primary" size={16}></Check>
                        <span>Debes tener al menos 10 PYM para poder crear una proyecto para financiar.</span>
                    </li>
                    <li className='flex space-x-1 items-center'>
                        <Check className="text-primary" size={16}></Check>
                        <span>
                        El PYM equivale más o menos 50 PEN.
                        </span>
                    </li>
                    <li className='flex space-x-1 items-center'>
                        <Check className="text-primary" size={16}></Check>
                        <span>
                        Puedes poner una descripción breve a tu proyecto al lado del nombre.
                        </span>
                    </li>
                </ul>
            </header>
            {/* <Button variant={'secondary'} onClick={getProposals}>
                Recargar propuestas
            </Button>
            {
                (
                    <div className='grid grid-cols-2 gap-4'>
                    { proposals.length> 0 && proposals.map((proposal) => (
                        <Card key={proposal.id}>
                            <CardHeader>
                                <CardTitle>Propuesta {proposal.id}</CardTitle>
                                <CardDescription>Iniciado en: { proposal.startTime} </CardDescription>
                            </CardHeader>
                            <CardContent className='text-base space-y-1'>
                                <p >{ proposal.description }</p>
                                {
                                    proposal.executed ? <p className='text-green-600 text-sm'>Propuesta ejecutada</p> : <p className='text-red-600 text-sm'>Propuesta en curso</p>
                                }
                            </CardContent>
                            <CardFooter className='flex-col space-y-2 text-sm'>
                                <div className='flex'>
                                    <p>
                                        A favor: {proposal.votesFor}
                                    </p>
                                    <Separator className='mx-4 h-4 w-[1px] bg-primary' orientation='vertical'></Separator>
                                    <p>
                                        En contra: {proposal.votesAgainst}
                                    </p>
                                </div>
                                <div className='space-x-4'>
                                    <Button variant='default' onClick={() => vote(proposal.id, 1)}>
                                        A favor
                                    </Button>
                                    <Button variant='secondary' onClick={() => vote(proposal.id, 0)}>
                                        En contra
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                    {
                        proposals.length === 0 && <p>No hay propuestas</p>
                    }
            </div>
                )
            } */}
            <Form {...form}>
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
                
            </Form>
        </section>
    </>
  )
}

export default CreateProject