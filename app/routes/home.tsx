import { CheckCircle2, CoinsIcon, HomeIcon, LogOut, PlusSquareIcon, SearchCheck, ThumbsUp, Vote, Wallet } from 'lucide-react'
import { title } from 'process'
import React, { useState } from 'react'
import { MetaMaskAvatar } from 'react-metamask-avatar'
import { Link, Outlet } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '~/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card'
import Particles from '~/components/ui/particles'
import { Separator } from '~/components/ui/separator'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, SidebarTrigger } from '~/components/ui/sidebar'
import { useWallet } from '~/hooks/use-wallet'

const items = [
    {
      title: "Inicio",
      url: "/home",
      icon: HomeIcon,
    },
    
    {
      title: "Acerca de",
      url: "#",
      icon: SearchCheck,
    },
    {
      title: "Conectar Billetera",
      url: "#",
      icon: Wallet,
    }
  ]
  
  const actions = [
    {
      title:"Crear propuesta",
      url:"/home/create-proposal",
      icon:ThumbsUp,
    },
    {
      title:"Votar",
      url:"/home/vote",
      icon:Vote,
    },
    {
      title:"Crear proyecto",
      url:"/home/create-project",
      icon:PlusSquareIcon,
    },
    {
      title:"Financiar proyecto",
      url:"/home/fund-project",
      icon:CoinsIcon,
    },
    {
      title:"Transferir PYM",
      url:"/home/transfer-pym",
      icon:CheckCircle2,
    }
  ]

function Layout() {
    const [color, setColor] = useState("#2a9d8f");
    const { account, accountData, connectWallet, disconnectWallet } = useWallet();
    const openMetaMaskPanel = async () => {
      try {
        if (typeof window.ethereum !== 'undefined' && account) {
          const from = account;
          const msg = 'Solicitando firma para abrir MetaMask';
          await window.ethereum.request({
            method: 'personal_sign',
            params: [msg, from],
          });
        } else {
          console.error('MetaMask no está instalado o no hay cuenta conectada');
        }
      } catch (error) {
        console.error('Error al solicitar la firma:', error);
      }
    };
  return (
    <>
    <Sidebar>
        <SidebarContent>
          <SidebarHeader>
              <h1 className="text-balance text-center text-primary">Hola <span className="text-2xl font-black">PYMecripto</span></h1>
          </SidebarHeader>
          <SidebarSeparator></SidebarSeparator>
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary text-lg">Menú Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator></SidebarSeparator>
          {
            account && <SidebarGroup>
            <SidebarGroupLabel className="text-primary text-lg">Casos de uso</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {actions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          }
        </SidebarContent>
        </Sidebar>
        <div className="w-full">
          <Particles
            className="absolute inset-0"
            quantity={300}
            ease={80}
            color={color}
            refresh
          ></Particles>
          <nav className='w-full sticky top-0 backdrop-blur-md bg-secondary/10 z-20'>
            <div className="flex px-4 w-full py-2 justify-between relative">
              <div className="flex">
                <SidebarTrigger className="size-10 text-lg"/>
                <Separator orientation="vertical" className="mx-4 h-10"></Separator>
                <div className="h-10 flex items-center">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="text-lg">
                        <Link to="/home">Inicio</Link>
                      </BreadcrumbItem>
                      {/* <BreadcrumbSeparator className="[&>svg]:w-[18px] [&>svg]:h-[18px]"/> */}
                      {/* <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                      </BreadcrumbItem> */}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
              <div>
                {
                  !account?(<Avatar onClick={connectWallet} className="cursor-pointer hover:scale-125 transition-transform duration-300">
                    <AvatarImage src="" />
                    <AvatarFallback>NN</AvatarFallback>
                  </Avatar>):(
                    <HoverCard>
                      <HoverCardTrigger>
                        <div className="size-[40px] min-w-[40px] rounded-full relative cursor-pointer" onClick={openMetaMaskPanel}>
                          <MetaMaskAvatar  address={account} size={40} className="absolute inset-0 [&>img]:rounded-full [&>img]:object-cover hover:scale-125 transition-transform duration-300"/>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-[28rem] px-4" side="bottom" align="end">
                        <div className="w-full flex flex-col items-center">
                          <div>
                            <MetaMaskAvatar  address={account} size={40} className="[&>img]:rounded-full [&>img]:object-cover hover:scale-125 transition-transform duration-300"/>
                          </div>
                          <div className="text-center">
                            <strong>Dirección de cuenta</strong>
                            <p className="text-wrap w-full">{account}</p>
                          </div>
                          <Separator className="my-4"></Separator>
                          <div>
                            <p><strong>Saldo:</strong> {accountData?.ethBalance} Sepolia{accountData?.ethSymbol}</p>
                            <p><strong>Saldo PYM:</strong> {accountData?.formattedBalance} {accountData?.ethSymbol}</p>
                            <p><strong>Suministro total:</strong> {accountData?.formattedTotalSupply} {accountData?.ethSymbol}</p>
                          </div>
                          <Separator className="my-4"></Separator>
                          <Button className="space-x-2" onClick={disconnectWallet}><span><LogOut></LogOut></span>Cerrar conexión</Button>
                          {/* <p><strong>Decimales: </strong>{accountData?.decimals}</p> */}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )
                }
              </div>
            </div>
          </nav>
          <div className="flex-1 flex flex-col items-center gap-16 w-full px-4 py-4">
            <article className="max-w-screen-md w-full flex flex-col space-y-4 items-center ">
              <Outlet></Outlet>
            </article>
          </div>
        </div>
  </>
  )
}

export default Layout