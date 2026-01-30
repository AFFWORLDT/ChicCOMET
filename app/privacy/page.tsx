"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Mail,
  Phone,
  Calendar,
  CheckCircle
} from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Your Privacy 
                <span className="text-amber-600"> Matters to Us</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We are committed to protecting your privacy and ensuring the security of your personal information. 
                This policy explains how we collect, use, and safeguard your data.
              </p>
              <div className="text-sm text-gray-500">
                Last updated: January 1, 2025
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Privacy Overview
                </h2>
                <p className="text-xl text-gray-600">
                  We believe in transparency and giving you control over your personal information
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We clearly explain what information we collect and how we use it.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Security</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Your data is protected with industry-standard security measures.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Database className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Control</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You have the right to access, update, or delete your personal information.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Information We Collect
              </h2>

              <div className="space-y-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Mail className="w-6 h-6 mr-3 text-amber-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        When you create an account, place an order, or contact us, we may collect:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Name and contact information (email, phone number)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Shipping and billing addresses</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Payment information (processed securely through our payment partners)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Account preferences and settings</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Database className="w-6 h-6 mr-3 text-amber-600" />
                      Usage Information
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        We automatically collect certain information when you use our website:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Device information (browser type, operating system)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">IP address and location data</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Pages visited and time spent on our site</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Purchase history and preferences</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Eye className="w-6 h-6 mr-3 text-amber-600" />
                      Cookies and Tracking
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        We use cookies and similar technologies to enhance your experience:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Essential cookies for website functionality</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Analytics cookies to understand site usage</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Marketing cookies for personalized content</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                How We Use Your Information
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Processing</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Process and fulfill your orders</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Send order confirmations and updates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Handle returns and exchanges</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Respond to your inquiries</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Provide technical support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Send important account updates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Marketing & Communication</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Send promotional emails (with your consent)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Personalize your shopping experience</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Show relevant product recommendations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Website Improvement</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Analyze website usage and performance</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Improve our products and services</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Prevent fraud and ensure security</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Data Security & Protection
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Lock className="w-6 h-6 mr-3 text-amber-600" />
                        Security Measures
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">SSL encryption for all data transmission</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Secure payment processing through trusted partners</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Regular security audits and updates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Limited access to personal information</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-amber-600" />
                        Your Rights
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Access your personal information</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Update or correct your data</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Delete your account and data</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Opt-out of marketing communications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Third-Party Services
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We may share your information with trusted third-party service providers who help us operate our business:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">Payment Processors:</span>
                        <span className="text-gray-700 ml-2">To process your payments securely</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">Shipping Companies:</span>
                        <span className="text-gray-700 ml-2">To deliver your orders</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">Email Service Providers:</span>
                        <span className="text-gray-700 ml-2">To send you important updates and marketing emails</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">Analytics Services:</span>
                        <span className="text-gray-700 ml-2">To understand how you use our website</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Note:</strong> We never sell your personal information to third parties for marketing purposes. 
                      All third-party service providers are required to maintain the confidentiality of your information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Contact Us About Privacy
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy or how we handle your personal information, 
                    please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-amber-600" />
                        Email
                      </h3>
                      <p className="text-gray-700 mb-2">info@whitlin.com</p>
                      <p className="text-sm text-gray-600">We'll respond within 48 hours</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-amber-600" />
                        Phone
                      </h3>
                      <p className="text-gray-700 mb-2">+971 45 754 785</p>
                      <p className="text-sm text-gray-600">Sun-Thu 9AM-6PM GST</p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Data Protection Officer:</strong> For EU residents, you can contact our Data Protection Officer 
                      at info@whitlin.com for any privacy-related concerns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-amber-600" />
                    Policy Updates
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We may update this Privacy Policy from time to time to reflect changes in our practices 
                    or for other operational, legal, or regulatory reasons. When we make changes, we will:
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Update the "Last updated" date at the top of this policy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Notify you via email if there are significant changes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Post a notice on our website for 30 days</span>
                    </li>
                  </ul>
                  
                  <p className="text-gray-700 leading-relaxed">
                    We encourage you to review this Privacy Policy periodically to stay informed about 
                    how we protect your information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
