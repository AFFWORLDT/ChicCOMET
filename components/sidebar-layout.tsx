"use client"

import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth()

  const toggleSidebar = () => {
    // Find and click the sidebar toggle button
    const toggleButton = document.querySelector('[title*="Open Sidebar"], [title*="Close Sidebar"]') as HTMLButtonElement
    if (toggleButton) {
      toggleButton.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar user={user} logout={logout} />
      
      {/* Prominent Close/Open Button */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 border-2"
          onClick={toggleSidebar}
        >
          <PanelLeftClose className="h-5 w-5 mr-2" />
          Toggle Sidebar
        </Button>
      </div>

      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}