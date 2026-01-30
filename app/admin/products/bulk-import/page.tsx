"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface ImportResult {
  total: number
  imported: number
  failed: number
  errors: string[]
  importedProducts: Array<{
    name: string
    sku: string
    price: number
  }>
}

export default function BulkImportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file)
        setImportResult(null)
      } else {
        toast.error("Please select an Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/products/bulk-import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setImportResult(data.data)
        toast.success(data.message)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        toast.error(data.error || "Import failed")
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/products/download-template')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'product-import-template.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Template downloaded successfully')
      } else {
        toast.error('Failed to download template')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download template')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Import Products</h1>
          <p className="text-muted-foreground">Import multiple products from Excel file</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Excel File</span>
            </CardTitle>
            <CardDescription>
              Select an Excel file (.xlsx or .xls) to import products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="cursor-pointer"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Products
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download Template</span>
            </CardTitle>
            <CardDescription>
              Download the Excel template to see the required format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Use the template to ensure your Excel file has the correct format and column headers.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Excel Template
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Required columns:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>name (required)</li>
                <li>price (required)</li>
                <li>category (required)</li>
                <li>sku (required)</li>
                <li>description</li>
                <li>stock</li>
                <li>image</li>
                <li>isBestSeller</li>
                <li>isNewProduct</li>
                <li>rating</li>
                <li>weight</li>
                <li>size</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {importResult.failed === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>Import Results</span>
            </CardTitle>
            <CardDescription>
              Summary of the import process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                <div className="text-sm text-muted-foreground">Imported</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Errors:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResult.importedProducts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-green-600">Imported Products:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {importResult.importedProducts.map((product, index) => (
                    <div key={index} className="text-sm bg-green-50 p-2 rounded">
                      <span className="font-medium">{product.name}</span> - 
                      <span className="text-muted-foreground ml-1">SKU: {product.sku}</span> - 
                      <span className="text-muted-foreground ml-1">AED {product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
