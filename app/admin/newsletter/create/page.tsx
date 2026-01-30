"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Send, 
  Eye, 
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  Tag
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function CreateNewsletterPage() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    htmlContent: '',
    type: 'manual',
    scheduledDate: '',
    tags: '',
    segments: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async (status: 'draft' | 'scheduled' = 'draft') => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          segments: formData.segments.split(',').map(segment => segment.trim()).filter(segment => segment),
          status: status === 'scheduled' ? 'scheduled' : 'draft'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Newsletter ${status === 'draft' ? 'saved as draft' : 'scheduled'} successfully`)
        router.push('/admin/newsletter')
      } else {
        toast.error(data.error || 'Failed to save newsletter')
      }
    } catch (error) {
      console.error('Error saving newsletter:', error)
      toast.error('Failed to save newsletter')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    setIsSending(true)
    
    try {
      // First save as draft
      const saveResponse = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          segments: formData.segments.split(',').map(segment => segment.trim()).filter(segment => segment),
          status: 'draft'
        })
      })
      
      const saveData = await saveResponse.json()
      
      if (!saveData.success) {
        toast.error(saveData.error || 'Failed to save newsletter')
        return
      }

      // Then send it
      const sendResponse = await fetch(`/api/admin/newsletter/${saveData.data._id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const sendData = await sendResponse.json()
      
      if (sendData.success) {
        toast.success(`Newsletter sent to ${sendData.data.recipientCount} subscribers`)
        router.push('/admin/newsletter')
      } else {
        toast.error(sendData.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      toast.error('Failed to send newsletter')
    } finally {
      setIsSending(false)
    }
  }

  const generateHtmlContent = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.subject}</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Whitlin</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Professional Hospitality Linen</p>
          </div>
          <div class="content">
            ${formData.content.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>© 2025 Whitlin. All rights reserved.</p>
            <div class="unsubscribe">
              <a href="UNSUBSCRIBE_TOKEN">Unsubscribe</a> | 
              <a href="mailto:info@whitlin.com">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
    
    setFormData(prev => ({
      ...prev,
      htmlContent: htmlContent
    }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Newsletter</h1>
          <p className="text-gray-600 mt-1">Create a new email campaign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter newsletter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Type
                </label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automated">Automated</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                    <SelectItem value="product_launch">Product Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter newsletter content..."
                  rows={10}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Use line breaks to separate paragraphs. HTML will be generated automatically.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="e.g., promotion, new-product, tips"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Segments (comma-separated)
                </label>
                <Input
                  value={formData.segments}
                  onChange={(e) => handleInputChange('segments', e.target.value)}
                  placeholder="e.g., vip-customers, new-subscribers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date (optional)
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSave('draft')}
                disabled={isSaving || !formData.title || !formData.subject || !formData.content}
                className="w-full"
                variant="outline"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save as Draft
              </Button>

              <Button
                onClick={() => handleSave('scheduled')}
                disabled={isSaving || !formData.title || !formData.subject || !formData.content || !formData.scheduledDate}
                className="w-full"
                variant="outline"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>

              <Button
                onClick={handleSend}
                disabled={isSending || !formData.title || !formData.subject || !formData.content}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    generateHtmlContent()
                    setPreviewMode(!previewMode)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </Button>

                {previewMode && formData.htmlContent && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-sm text-gray-600 mb-2">Email Preview:</div>
                    <div 
                      className="text-xs bg-white p-3 rounded border max-h-64 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subject Length:</span>
                  <Badge variant={formData.subject.length > 50 ? 'destructive' : 'default'}>
                    {formData.subject.length}/50
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Content Length:</span>
                  <Badge variant={formData.content.length < 100 ? 'destructive' : 'default'}>
                    {formData.content.length} chars
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge>{formData.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
