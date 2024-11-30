import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { set, z } from 'zod'
import { BorderBeam } from '~/components/ui/border-beam'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { MagicCard } from '~/components/ui/magic-card'
import { Textarea } from '~/components/ui/textarea'
import { useWallet } from '~/hooks/use-wallet'
import { Proposal } from '~/services/governanceServices'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '~/components/ui/separator'
import { PageHeader } from '~/components/PageHeader'
import { ToastContainer } from 'react-toastify'

// export function clientLoader() {
//     return {
//         contractService: new ContractsService()
//     }
// }

const formSchema = z.object({
    proposalDescription: z.string().min(50, {
      message: "La propuesta debe tener al menos 50 caracteres",
    }).max(500, {
        message: "La propuesta debe tener menos de 500 caracteres",
    }),
  })

function CreateProposal() {
    const { account, contractService } = useWallet()
    const governanceService = contractService.getGovernanceContractService();

    const [proposals, setProposals] = React.useState<Proposal[] | []>([]);
    const [showProposals, setShowProposals] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          proposalDescription: "",
        },
      })
    
    const [proposalCounter, setProposalCounter] = React.useState<number>(0);
    const textAreaValue = form.watch('proposalDescription');
    useEffect(() => {
        setProposalCounter(textAreaValue.length);
    }, [textAreaValue])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (typeof window.ethereum !== 'undefined') {
            setLoading(true);
            await governanceService.createProposal(values.proposalDescription)
            .then(() => {
                console.log('Propuesta creada');
                form.reset();
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error creando propuesta: ', error);
            });
        }
    }
    const getProposals = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const proposals = await governanceService.getProposals();
                if (proposals) {
                    setProposals(proposals);
                    setShowProposals(true);
                }
                console.log(proposals)
            } catch (error) {
                console.error('Error getting proposals: ', error);
            }
        }
    }

    // useEffect(() => {
    //     const fetchProposals = async () => {
    //         if (account) {
    //             await getProposals();
    //         }
    //     };
    //     fetchProposals();
    // }, [account])
    
  return (
    <>
        {/* <section className='w-full h-[200px] relative p-4 flex items-end rounded-md'>
            <img className='w-full h-full absolute object-cover rounded-md inset-0 z-0 mask-linear mask-dir-to-b mask-from-100 mask-to-30 mask-point-to-[95%]' src="https://images.pexels.com/photos/6913299/pexels-photo-6913299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="create proposal" />
            <h1 className='text-5xl font-black relative z-10 text-primary'>Propuestas de gobernanza</h1>
            <BorderBeam></BorderBeam>
        </section > */}
        {/* <ToastContainer
        containerId={'create-proposal'}
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                ></ToastContainer> */}
        <PageHeader title='Propuestas de gobernanza' imgSrc="https://images.pexels.com/photos/6913299/pexels-photo-6913299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"></PageHeader>
        <section className='w-full space-y-6'>
            <header className='text-2xl font-semibold text-start w-full space-y-2'>
                <h2>Crear Propuesta</h2>
                <p className='text-base font-normal'>
            Debes tener al menos 1000 PYM para crear una propuesta.
            </p>
            </header>
            
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    
                        <FormField
                            control={form.control}
                            name='proposalDescription'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Descripción de la propuesta
                                    </FormLabel>
                                    <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder='Escribe tu propuesta...'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Textarea>
                                    </FormControl>
                                    <FormDescription className={proposalCounter<=500 && proposalCounter>=50?'text-green-600':'text-red-600'}>
                                        <span>
                                            {proposalCounter}/{
                                                proposalCounter <= 50 ? 'min(50)' : 'max(500)'
                                            }
                                        </span>
                                    </FormDescription>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button variant={'default'} type='submit' disabled={loading}>
                            {
                                loading ? 'Creando propuesta...' : 'Crear propuesta'
                            }
                        </Button>
                </form>
                
            </Form>
        </section>
        <Separator className='my-10'></Separator>
        <section className='w-full space-y-6'>
            <header className='text-2xl font-semibold text-start w-full'>
                Propuestas
            </header>
            <Button variant={'secondary'} onClick={getProposals}>
                Cargar propuestas
            </Button>
            {
                showProposals && (
                    <div className='grid grid-cols-2 gap-4'>
                    { proposals.length> 0 && proposals.map((proposal) => (
                        <Card key={proposal.id}>
                            <CardHeader>
                                <CardTitle>Propuesta {proposal.id}</CardTitle>
                                <CardDescription>Iniciado en: { proposal.startTime} </CardDescription>
                            </CardHeader>
                            <CardContent className='text-sm space-y-1'>
                                <p >{ proposal.description }</p>
                                {
                                    proposal.executed ? <p className='text-green-600'>Propuesta ejecutada</p> : <p className='text-red-600'>Propuesta en curso</p>
                                }
                            </CardContent>
                            <CardFooter className='flex text-sm'>
                                <p>
                                    A favor: {proposal.votesFor}
                                </p>
                                <Separator className='mx-4 h-4' orientation='vertical'></Separator>
                                <p>
                                    En contra: {proposal.votesAgainst}
                                </p>
                            </CardFooter>
                        </Card>
                    ))}
                    {
                        proposals.length === 0 && <p>No hay propuestas</p>
                    }
            </div>
                )
            }
        </section>
    </>
  )
}

export default CreateProposal

