"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Users, 
  Eye, 
  MousePointer,
  Calendar,
  Edit,
  Trash2,
  Send,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Newsletter {
  _id: string
  title: string
  subject: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  type: 'manual' | 'automated' | 'welcome' | 'abandoned_cart' | 'product_launch'
  recipientCount: number
  openCount: number
  clickCount: number
  scheduledDate?: string
  sentDate?: string
  createdAt: string
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('/api/admin/newsletter')
      const data = await response.json()
      
      if (data.success) {
        setNewsletters(data.data.newsletters)
      } else {
        toast.error('Failed to fetch newsletters')
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      toast.error('Failed to fetch newsletters')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'sending': return 'bg-yellow-100 text-yellow-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manual': return 'bg-purple-100 text-purple-800'
      case 'automated': return 'bg-orange-100 text-orange-800'
      case 'welcome': return 'bg-green-100 text-green-800'
      case 'abandoned_cart': return 'bg-red-100 text-red-800'
      case 'product_launch': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter
    const matchesType = typeFilter === 'all' || newsletter.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Newsletter deleted successfully')
        fetchNewsletters()
      } else {
        toast.error(data.error || 'Failed to delete newsletter')
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error)
      toast.error('Failed to delete newsletter')
    }
  }

  const handleSend = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Newsletter sent to ${data.data.recipientCount} subscribers`)
        fetchNewsletters()
      } else {
        toast.error(data.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      toast.error('Failed to send newsletter')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading newsletters...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your email campaigns</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/newsletter/create')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Newsletter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Newsletters</p>
                <p className="text-2xl font-bold text-gray-900">{newsletters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsletters.reduce((sum, n) => sum + n.recipientCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Opens</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsletters.reduce((sum, n) => sum + n.openCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsletters.reduce((sum, n) => sum + n.clickCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search newsletters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="welcome">Welcome</SelectItem>
                <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                <SelectItem value="product_launch">Product Launch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Newsletters List */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletters ({filteredNewsletters.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters found</h3>
              <p className="text-gray-600 mb-4">Create your first newsletter to get started</p>
              <Button 
                onClick={() => router.push('/admin/newsletter/create')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Newsletter
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNewsletters.map((newsletter) => (
                <div key={newsletter._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {newsletter.title}
                        </h3>
                        <Badge className={getStatusColor(newsletter.status)}>
                          {newsletter.status}
                        </Badge>
                        <Badge className={getTypeColor(newsletter.type)}>
                          {newsletter.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{newsletter.subject}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {newsletter.recipientCount} recipients
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {newsletter.openCount} opens
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointer className="w-4 h-4" />
                          {newsletter.clickCount} clicks
                        </div>
                        {newsletter.sentDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Sent {new Date(newsletter.sentDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {newsletter.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleSend(newsletter._id)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/newsletter/${newsletter._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/newsletter/${newsletter._id}`)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {newsletter.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => handleSend(newsletter._id)}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(newsletter._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
