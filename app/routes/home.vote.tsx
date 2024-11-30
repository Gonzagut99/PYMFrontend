import { Separator } from '@radix-ui/react-separator'
import { get } from 'http'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { PageHeader } from '~/components/PageHeader'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { useWallet } from '~/hooks/use-wallet'
import { Proposal } from '~/services/governanceServices'
import { Check } from 'lucide-react'

function Vote() {
    const { account, contractService } = useWallet()
    const governanceService = contractService.getGovernanceContractService();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [proposals, setProposals] = React.useState<Proposal[] | []>([]);
    const getProposals = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const proposals = await governanceService.getProposals();
                if (proposals) {
                    setProposals(proposals);
                }
                console.log(proposals)
            } catch (error) {
                console.error('Error getting proposals: ', error);
            }
        }
    }

    const vote = async (proposalId: number, vote: number) => {
        if (typeof window.ethereum !== 'undefined') {
            setLoading(true);
            try {
                await governanceService.voteOnProposal(proposalId, vote)
                .then(() => {
                    console.log('Votación exitosa');
                    setLoading(false);
                    toast.info('Votación exitosa');
                })
                .catch((error) => {
                    console.error('Error votando: ', error);
                    toast.error('Error votando');
                });
            } catch (error) {
                setLoading(false);
                console.error('Error votando: ', error);
                toast.error('Error votando');
            }
        }
    }

    useEffect(() => {
        // const fetchProposals = async () => {
        //     await getProposals();
        // };
        // fetchProposals();
        if (typeof window.ethereum !== 'undefined') {
            getProposals();
        }
    }, [])

    useEffect(() => {
        toast.info('Propuestas actualizándose')
    }, [proposals])
  return (
    <>
        {/* <ToastContainer
        containerId={'Vote'}
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                ></ToastContainer> */}
        <PageHeader title='Votaciones' imgSrc='https://d13qu023z75971.cloudfront.net/2021/11/Electronic-Voting-Blog---Image----1-.png'></PageHeader>
        <section className='w-full space-y-6'>
            <header className='text-start w-full flex flex-col space-y-2'>
                <h2 className='text-2xl font-semibold'>Propuestas</h2>
                <ul className='space-y-1'>
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
                </ul>
            </header>
            <Button variant={'secondary'} onClick={getProposals}>
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
                                    <Button variant='default' onClick={() => vote(proposal.id, 1)} disabled={loading}>
                                        {
                                            loading ? 'Votando...' : 'A favor'
                                        }
                                    </Button>
                                    <Button variant='secondary' onClick={() => vote(proposal.id, 0)} disabled={loading}>
                                        {
                                            loading ? 'Votando...' : 'En contra'
                                        }
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
            }
        </section>
    </>
  )
}

export default Vote