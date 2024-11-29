import { Calendar, Home, Inbox, Search, Settings, SearchCheck, Wallet, Vote, Plus, PlusSquareIcon, CoinsIcon } from "lucide-react"
import { title } from "process"
import { Link } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "#",
    icon: Home,
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
    title:"Votar",
    url:"#",
    icon:Vote,
  },
  {
    title:"Crear proyecto",
    url:"#",
    icon:PlusSquareIcon,
  },
  {
    title:"Financiar proyecto",
    url:"#",
    icon:CoinsIcon,
  }]
export function AppSidebar() {
  return (
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
        <SidebarGroup>
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
      </SidebarContent>

    </Sidebar>
  )
}
