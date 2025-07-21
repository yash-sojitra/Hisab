import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@radix-ui/react-separator"
import { UserButton } from "@clerk/clerk-react"

export default function Layout({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="flex flex-col margin gap-2 ">
                    <header className="flex h-16 shrink-0 justify-between px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <h1 className="font-bold text-xl">{title}</h1>
                        </div>
                        <UserButton/>
                    </header>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}