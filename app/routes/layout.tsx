// import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
// import type { Route } from "./+types/_index";
// import { AppSidebar } from "~/components/app-sidebar";
// import { useEffect, useState } from "react";
// import Particles from "~/components/ui/particles";
// import { Link, Outlet } from "react-router";
// import BlurFade from "~/components/ui/blur-fade";
// import { RainbowButton } from "~/components/ui/rainbow-button";
// import { Separator } from "~/components/ui/separator";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "~/components/ui/breadcrumb";
// import { Avatar, AvatarFallback } from "~/components/ui/avatar";
// import { AvatarImage } from "@radix-ui/react-avatar";
// import { ContractsService } from "~/services/initialization";
// import { MetaMaskAvatar } from 'react-metamask-avatar'
// import { HomeIcon, SearchCheck, Wallet, Vote, PlusSquareIcon, CoinsIcon, Check, LogOut } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
// } from "~/components/ui/sidebar"
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
// import { Button } from "~/components/ui/button";
// import { useWallet, WalletProvider } from "~/hooks/use-wallet";

// // Menu items.
// const items = [
//   {
//     title: "Inicio",
//     url: "#",
//     icon: HomeIcon,
//   },
  
//   {
//     title: "Acerca de",
//     url: "#",
//     icon: SearchCheck,
//   },
//   {
//     title: "Conectar Billetera",
//     url: "#",
//     icon: Wallet,
//   }
// ]

// const actions = [
//   {
//     title:"Votar",
//     url:"#",
//     icon:Vote,
//   },
//   {
//     title:"Crear proyecto",
//     url:"#",
//     icon:PlusSquareIcon,
//   },
//   {
//     title:"Financiar proyecto",
//     url:"#",
//     icon:CoinsIcon,
//   }]

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

// // {
// //   balance,
// //   formattedBalance: formatEther(balance),
// //   symbol,
// //   decimals,
// //   formattedTotalSupply: formatEther(totalSupply),
// //   totalSupply: totalSupply
// // }
// type AccountData = {
//   account: string,
//   ethSymbol: 'ETH',
//   ethBalance: string,
//   pymBalance: string,
//   formattedBalance: string,
//   symbol: string,
//   decimals: number,
//   formattedTotalSupply: string,
//   totalSupply: string
// }

// export async function clientLoader() {
//   const contractService = new ContractsService(); 
//   return {
//     contractService
//   }
// }
// clientLoader.hydrate = true as const;
// export default function Home({ loaderData }: Route.ComponentProps) {
//   const { contractService } = loaderData;
//   const [open, setOpen] = useState(true)
//   const [color, setColor] = useState("#2a9d8f");
//   const { account, accountData, connectWallet, disconnectWallet } = useWallet();
//   // const [account, setAccount] = useState<string | null>(null);
//   // const [balance, setBalance] = useState<string | null>(null);
//   // const [accountData, setAccountData] = useState<AccountData | null>({
//   //   account: '',
//   //   ethSymbol: 'ETH',
//   //   ethBalance: '',
//   //   pymBalance: '',
//   //   formattedBalance: '',
//   //   symbol: '',
//   //   decimals: 0,
//   //   formattedTotalSupply: '',
//   //   totalSupply: ''
//   // });


//   // useEffect(() => {
//   //   if (typeof window.ethereum !== 'undefined') {
//   //     const fetchAccount = async () => {
//   //       const account = await contractService.requestAccount();
//   //       setAccount(account);
//   //     };
//   //     fetchAccount();
//   //   }
//   // }
//   // , [])

//   // useEffect(() => {
//   //   const fetchAccountData = async () => {
//   //     if (account) {
//   //       const ethBalance = await contractService.getGovernanceContractService()?.getBalance(account);
//   //       const pymBalanceData = await contractService.getGovernanceContractService()?.getPYMBalance(account);
//   //       if (pymBalanceData && ethBalance) {
//   //         const { balance, formattedBalance, symbol, decimals, formattedTotalSupply, totalSupply } = pymBalanceData;
//   //         setAccountData({
//   //           account,
//   //           ethSymbol: 'ETH',
//   //           ethBalance,
//   //           pymBalance: balance,
//   //           formattedBalance,
//   //           symbol,
//   //           decimals,
//   //           formattedTotalSupply,
//   //           totalSupply
//   //         });
//   //       }
//   //     }
//   //   };
//   //   fetchAccountData();
//   // }, [account]);

//   // useEffect(() => {
//   //   const handleAccountChanged= (accounts: string[]) => {
//   //     setAccount(accounts?.length>0 ? accounts[0] : null);
//   //   }
//   //   if (typeof window.ethereum !== 'undefined') {
//   //     window.ethereum.on('accountsChanged', handleAccountChanged);
//   //     window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountChanged);
//   //   }
//   //   return () => {
//   //     if (typeof window.ethereum !== 'undefined') {
//   //       window.ethereum.removeListener('accountsChanged', handleAccountChanged);
//   //     }
//   //   }
//   // })

//   // const connectWallet = async () => {
//   //   if (typeof window.ethereum !== 'undefined') {
//   //     try {
//   //       const account = await contractService.requestAccount();
//   //       setAccount(account);
//   //     } catch (error) {
//   //       console.error('Error connecting wallet: ', error);
//   //     }
//   //   }
//   // }

//   // const disconnectWallet = async () => {
//   //   try {
//   //     await contractService.disconnectAccount();
//   //     setAccount(null);
//   //     setAccountData({
//   //       account: '',
//   //       ethSymbol: 'ETH',
//   //       ethBalance: '',
//   //       pymBalance: '',
//   //       formattedBalance: '',
//   //       symbol: '',
//   //       decimals: 0,
//   //       formattedTotalSupply: '',
//   //       totalSupply: ''
//   //     });
//   //   } catch (error) {
//   //     console.error('Error disconnecting wallet: ', error);
//   //   }
//   // }

//   const openMetaMaskPanel = async () => {
//     try {
//       if (typeof window.ethereum !== 'undefined' && account) {
//         const from = account;
//         const msg = 'Solicitando firma para abrir MetaMask';
//         await window.ethereum.request({
//           method: 'personal_sign',
//           params: [msg, from],
//         });
//       } else {
//         console.error('MetaMask no está instalado o no hay cuenta conectada');
//       }
//     } catch (error) {
//       console.error('Error al solicitar la firma:', error);
//     }
//   };

//   return (
//     <WalletProvider contractService={contractService}>
//       <SidebarProvider open={open} onOpenChange={setOpen}>
//         <Sidebar>
//         <SidebarContent>
//           <SidebarHeader>
//               <h1 className="text-balance text-center text-primary">Hola <span className="text-2xl font-black">PYMecripto</span></h1>
//           </SidebarHeader>
//           <SidebarSeparator></SidebarSeparator>
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-primary text-lg">Menú Principal</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {items.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <Link to={item.url}>
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//           <SidebarSeparator></SidebarSeparator>
//           {
//             account && <SidebarGroup>
//             <SidebarGroupLabel className="text-primary text-lg">Casos de uso</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {actions.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <Link to={item.url}>
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//           }
//         </SidebarContent>
//         </Sidebar>
//         <div className="w-full">
//           <Particles
//             className="absolute inset-0"
//             quantity={300}
//             ease={80}
//             color={color}
//             refresh
//           ></Particles>
//           <div className="flex px-4 w-full py-2 justify-between">
//             <div className="flex">
//               <SidebarTrigger className="size-10 text-lg"/>
//               <Separator orientation="vertical" className="mx-4 h-10"></Separator>
//               <div className="h-10 flex items-center">
//                 <Breadcrumb>
//                   <BreadcrumbList>
//                     <BreadcrumbItem className="text-lg">
//                       <Link to="/">Inicio</Link>
//                     </BreadcrumbItem>
//                     {/* <BreadcrumbSeparator className="[&>svg]:w-[18px] [&>svg]:h-[18px]"/> */}
//                     {/* <BreadcrumbItem>
//                       <BreadcrumbLink href="/components">Components</BreadcrumbLink>
//                     </BreadcrumbItem>
//                     <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
//                     </BreadcrumbItem> */}
//                   </BreadcrumbList>
//                 </Breadcrumb>
//               </div>
//             </div>
//             <div>
//               {
//                 !account?(<Avatar onClick={connectWallet} className="cursor-pointer hover:scale-125 transition-transform duration-300">
//                   <AvatarImage src="" />
//                   <AvatarFallback>NN</AvatarFallback>
//                 </Avatar>):(
      
//                   <HoverCard>
//                     <HoverCardTrigger>
//                       <div className="size-[40px] min-w-[40px] rounded-full relative cursor-pointer" onClick={openMetaMaskPanel}>
//                         <MetaMaskAvatar  address={account} size={40} className="absolute inset-0 [&>img]:rounded-full [&>img]:object-cover hover:scale-125 transition-transform duration-300"/>
//                       </div>
//                     </HoverCardTrigger>
//                     <HoverCardContent className="w-[28rem] px-4" side="bottom" align="end">
//                       <div className="w-full flex flex-col items-center">
//                         <div>
//                           <MetaMaskAvatar  address={account} size={40} className="[&>img]:rounded-full [&>img]:object-cover hover:scale-125 transition-transform duration-300"/>
//                         </div>
//                         <div className="text-center">
//                           <strong>Dirección de cuenta</strong>
//                           <p className="text-wrap w-full">{account}</p>
//                         </div>
//                         <Separator className="my-4"></Separator>
//                         <div>
//                           <p><strong>Saldo:</strong> {accountData?.ethBalance} Sepolia{accountData?.ethSymbol}</p>
//                           <p><strong>Saldo PYM:</strong> {accountData?.formattedBalance} {accountData?.ethSymbol}</p>
//                           <p><strong>Suministro total:</strong> {accountData?.formattedTotalSupply} {accountData?.ethSymbol}</p>
//                         </div>
//                         <Separator className="my-4"></Separator>
//                         <Button className="space-x-2" onClick={disconnectWallet}><span><LogOut></LogOut></span>Cerrar conexión</Button>
//                         {/* <p><strong>Decimales: </strong>{accountData?.decimals}</p> */}
//                       </div>
//                     </HoverCardContent>
//                   </HoverCard>
//                 )
//               }
//             </div>
//           </div>
//           <div className="flex-1 flex flex-col items-center gap-16 w-full px-4 py-4">
//             <article className="max-w-screen-md w-full flex flex-col space-y-4 items-center ">
//               <Outlet></Outlet>
//             </article>
//           </div>
//         </div>
//       </SidebarProvider>
//     </WalletProvider>
//   )
// }
