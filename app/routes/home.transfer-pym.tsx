import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { number, z } from 'zod';
import { PageHeader } from '~/components/PageHeader'
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useWallet } from '~/hooks/use-wallet'

const formSchema = z.object({
    address: z.string().min(42, {
      message: "La propuesta debe se una dirección válida",
    }).max(42, {
        message: "La dirección debe tener 42 caracteres",
    }),
    amount: z.coerce.number().min(1, {
        message: "La cantidad debe ser mayor a 0",
    }).positive(),
  })


function Transfer() {
    const { account, connectWallet, disconnectWallet, contractService } = useWallet()
    const governanceService = contractService.getGovernanceContractService();
    const owner = "0x0b33cda31618ebeabb3c5c3e3671be25f7fdba82";
    const [loading, setLoading] = React.useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //   proposalDescription: "",
        // },
      })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (typeof window.ethereum !== 'undefined') {
            await governanceService.mintTokens(values.address, Number(values.amount))
            .then(() => {
                console.log('PYM transferido');
                toast.success('PYM transferido');
            })
            .catch((error) => {
                console.error('Error transfiriendo PYM: ', error);
                toast.error('Error transfiriendo PYM');
            });
        }
    }
  return (
    <>
        <PageHeader title='Transferir PYM' imgSrc='https://es.investing.com/academy/wp-content/uploads/sites/4/2022/04/Crypto-Token-scaled.jpg'></PageHeader>
        { account == owner &&
            <section className='w-full space-y-4'>
            <header className='text-start w-full flex flex-col space-y-2'>
                    <h2 className='text-2xl font-semibold'>Propuestas</h2>
                    <p>Transfiere PYM a una direccion de wallet válida.</p>
                    {/* <ul className='space-y-1'>
                        <li className='flex space-x-1 items-center'>
                            <Check className="text-primary" size={16}></Check>
                            <span>Mientras más PYM tengas, tienes mayor poder de voto.</span>
                        </li>
                        <li className='flex space-x-1 items-center'>
                            <Check className="text-primary" size={16}></Check>
                            <span>
                            Solo son 7 días desde que comienza la propuesta, en que puedes votar.
                            </span>
                        </li>
                        <li className='flex space-x-1 items-center'>
                            <Check className="text-primary" size={16}></Check>
                            <span>
                            No se puede votar mas de una vez por propuesta.
                            </span>
                        </li>
                    </ul> */}

                </header>
                <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    
                        <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Dirección de la cuenta
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Escribe tu propuesta...'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Input>
                                    </FormControl>
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
                                        Monto:
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Escribe tu propuesta...'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    ></Input>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button variant={'default'} type='submit' disabled={
                            loading
                        }>
                            {
                                loading ? 'Transfiriendo...' : 'Transferir'
                            }
                        </Button>
                </form>
                
            </Form>
            </section>
        }
        {
            account != owner &&
            <section className='w-full'>
            <header className='text-start w-full flex flex-col space-y-2'>
                    {/* <h2 className='text-2xl font-semibold'>Propuestas</h2> */}
                    <p>No eres el dueño del contrato</p>
            </header>
            </section>
        }
    </>
  )
}

export default Transfer