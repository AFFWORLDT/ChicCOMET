"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Users, 
  Mail, 
  Download,
  Filter,
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff
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

interface Subscriber {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  source: string
  tags: string[]
  preferences: {
    productUpdates: boolean
    promotions: boolean
    tips: boolean
    events: boolean
  }
  subscriptionDate: string
  lastEmailSent?: string
  unsubscribeDate?: string
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers')
      const data = await response.json()
      
      if (data.success) {
        setSubscribers(data.data)
      } else {
        toast.error('Failed to fetch subscribers')
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      toast.error('Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'unsubscribed': return 'bg-red-100 text-red-800'
      case 'bounced': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.firstName && subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter
    const matchesSource = sourceFilter === 'all' || subscriber.source === sourceFilter
    
    return matchesSearch && matchesStatus && matchesSource
  })

  const activeSubscribers = subscribers.filter(s => s.status === 'active').length
  const unsubscribedSubscribers = subscribers.filter(s => s.status === 'unsubscribed').length
  const bouncedSubscribers = subscribers.filter(s => s.status === 'bounced').length

  const handleExport = () => {
    const csvContent = [
      ['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Subscription Date', 'Last Email Sent'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.firstName || '',
        sub.lastName || '',
        sub.status,
        sub.source,
        new Date(sub.subscriptionDate).toLocaleDateString(),
        sub.lastEmailSent ? new Date(sub.lastEmailSent).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Subscribers exported successfully')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscribers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-600 mt-1">Manage your email subscribers</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <EyeOff className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                <p className="text-2xl font-bold text-gray-900">{unsubscribedSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounced</p>
                <p className="text-2xl font-bold text-gray-900">{bouncedSubscribers}</p>
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
                  placeholder="Search subscribers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="import">Import</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
              <p className="text-gray-600">No subscribers match your current filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {subscriber.firstName && subscriber.lastName 
                            ? `${subscriber.firstName} ${subscriber.lastName}`
                            : subscriber.email
                          }
                        </h3>
                        <Badge className={getStatusColor(subscriber.status)}>
                          {subscriber.status}
                        </Badge>
                        <Badge variant="outline">
                          {subscriber.source}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{subscriber.email}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          Subscribed {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                        </div>
                        {subscriber.lastEmailSent && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            Last email {new Date(subscriber.lastEmailSent).toLocaleDateString()}
                          </div>
                        )}
                        {subscriber.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>Tags: {subscriber.tags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Updates: {subscriber.preferences.productUpdates ? '✓' : '✗'}</span>
                        <span>Promotions: {subscriber.preferences.promotions ? '✓' : '✗'}</span>
                        <span>Tips: {subscriber.preferences.tips ? '✓' : '✗'}</span>
                        <span>Events: {subscriber.preferences.events ? '✓' : '✗'}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
