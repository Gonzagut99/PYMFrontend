import { Check, CheckCircle2, CoinsIcon, PlusSquareIcon, ThumbsUp, Vote } from 'lucide-react'
import React from 'react'
import BlurFade from '~/components/ui/blur-fade'
import { RainbowButton } from '~/components/ui/rainbow-button'
import { Separator } from '~/components/ui/separator'
import { useWallet } from '~/hooks/use-wallet'
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";
 
import { BentoCard, BentoGrid } from "~/components/ui/bento-grid";
import { useNavigate } from 'react-router'

const features = [
  {
    Icon: Vote,
    name: "Votación por decisiones de gobernanza",
    description: "Participa en la toma de decisiones importantes para la plataforma.",
    href: "/home/vote",
    cta: "Aprender más",
    background: <img src='https://cdn.pixabay.com/photo/2017/04/12/23/27/away-2226159_1280.jpg' className="absolute mask-linear mask-dir-to-b mask-from-100 mask-to-0 mask-point-to-[80%] w-full object-cover" />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ThumbsUp,
    name: "Crear propuesta de cambio de gobernanza",
    description: "Propón cambios y mejoras para la plataforma.",
    href: "/home/create-proposal",
    cta: "Aprender más",
    background: <img src='https://images.pexels.com/photos/7550294/pexels-photo-7550294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className="absolute mask-linear mask-dir-to-b mask-from-100 mask-to-0 mask-point-to-[80%] w-full object-cover" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: PlusSquareIcon,
    name: "Crear proyecto para financiar",
    description: "Inicia un proyecto y busca financiamiento a través de nuestra plataforma.",
    href: "/home/create-project",
    cta: "Aprender más",
    background: <img src='https://images.pexels.com/photos/7414268/pexels-photo-7414268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className="absolute -top-10 mask-linear mask-dir-to-b mask-from-100 mask-to-0 mask-point-to-[50%] w-full object-cover" />,
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CoinsIcon,
    name: "Financiar proyecto",
    description: "Apoya proyectos y recibe beneficios a cambio.",
    href: "/home/fund-project",
    cta: "Aprender más",
    background: <img src='https://images.pexels.com/photos/7414284/pexels-photo-7414284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className="absolute -top-1 mask-linear mask-dir-to-b mask-from-100 mask-to-0 mask-point-to-[80%] w-full object-cover" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: CheckCircle2,
    name: "Transferir PYM tokens",
    description: "Envía y recibe PYM tokens de manera rápida y segura.",
    href: "/home/transfer-pym",
    cta: "Aprender más",
    background: <img src='https://images.pexels.com/photos/14358442/pexels-photo-14358442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className="absolute mask-linear mask-dir-to-b mask-from-100 mask-to-0 mask-point-to-[80%] w-full object-cover" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];


function Index() {
  const { account, connectWallet, disconnectWallet } = useWallet()

return (
  <>
      <section id="header" className="text-start flex w-full py-4 space-x-10">
            <div className="w-2/3 flex flex-col justify-between">
              <header >
                <BlurFade delay={0.25} inView>
                  <h2 className="text-xl text-primary font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
                    Bienvenido a 👋
                  </h2>
                </BlurFade>
                <BlurFade delay={0.25 * 2} inView>
                  <span className="text-3xl text-primary font-black text-pretty tracking-tighter sm:text-5xl xl:text-6xl/none">
                    PYMecripto
                  </span>
                </BlurFade>
              </header>
              <div className="text-zinc-900/60 text-[0.9rem] leading-relaxed">
                <BlurFade delay={0.25 * 3} inView className="space-y-2">                    
                  <p>
                    <span className="font-bold">PYMecripto</span> es una plataforma descentralizada que busca democratizar el acceso a la financiación para pequeñas y medianas empresas en Peru.
                  </p>
                  <div>
                    <p className="text-balance">
                      Con nuestro token <span className="font-bold">PYM</span> podrás:
                    </p>
                    <ul>
                      <li className="flex space-x-1 items-center">
                        <Check className="text-primary" size={16}></Check>
                        <span>Participar en la toma de decisiones</span>
                        </li>
                      <li className="flex space-x-1 items-center">
                        <Check className="text-primary" size={16}></Check>
                        <span>Recibir financiemento para tu emprendimiento</span>
                        </li>
                    </ul>
                  </div>
                </BlurFade>
              </div>
              <BlurFade delay={0.25 * 3} inView>
                <RainbowButton onClick={
                  account ? disconnectWallet : connectWallet
                } className="hover:scale-105 transition-transform duration-300">{
                    account ? 'Desconectar' : 'Conectar Billetera'
                  }</RainbowButton>
              </BlurFade>
            </div>
            <div className="flex-grow animate-fade delay-500 bg-secondary shadow-lg rounded-3xl">
              <img src="/PymecryptoConceptArt.png" alt="Concept Art" className="aspect-square max-w-80 mask-point-from-[70%] mask-linear mask-from-100 mask-to-10 object-contain rounded-3xl"/>
            </div>
          </section>
          <Separator className="my-4"></Separator>
          <section id='services'>
            <Bento></Bento>
          </section>
  </>
)
}

export default Index
 
export function Bento() {
  return (
    <BentoGrid className="lg:grid-rows-3 [&>div]:bg-secondary">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}