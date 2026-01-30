import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Crown, Sparkles, ArrowRight } from "lucide-react"

export default function SidebarDemoPage() {
  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-12 h-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">
                Collapsible Sidebar Demo
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Experience the luxury of a collapsible sidebar navigation system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/showcase">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  View Premium Collections
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                  Desktop Minimize/Expand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use the minimize (⊖) and expand (⊞) buttons in the sidebar header, or the floating expand button when minimized.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  Mobile Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  On mobile devices, use the hamburger menu button to open/close the sidebar overlay.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2 text-blue-500" />
                  Smooth Animations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enjoy smooth transitions and animations when collapsing/expanding the sidebar.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Sidebar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Desktop Experience</h4>
                    <p className="text-gray-600">Use the minimize (⊖) and expand (⊞) buttons in the sidebar header, or keyboard shortcuts: Ctrl+M (minimize), Ctrl+E (expand), Ctrl+B (toggle).</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Mobile Experience</h4>
                    <p className="text-gray-600">On mobile devices, tap the hamburger menu button (☰) in the top-left corner to open the sidebar overlay.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Navigation</h4>
                    <p className="text-gray-600">Use the sidebar to navigate between different sections of your Whitlin website.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Features */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Navigation Section</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Home - Main dashboard</li>
                      <li>• Products - Product management</li>
                      <li>• Premium Collections - Luxury showcase</li>
                      <li>• Collections - All product collections</li>
                      <li>• About - Company information</li>
                      <li>• Contact - Contact details</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Account Section</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Sign In - User authentication</li>
                      <li>• Sign Up - New user registration</li>
                      <li>• My Account - User profile</li>
                      <li>• Sign Out - Logout functionality</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Footer Actions</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Search Products - Product search functionality</li>
                    <li>• Cart - Shopping cart access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
