"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Phone
} from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Terms of 
                <span className="text-amber-600"> Service</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                These terms and conditions govern your use of our website and services. 
                Please read them carefully before making a purchase or using our platform.
              </p>
              <div className="text-sm text-gray-500">
                Last updated: January 1, 2025
              </div>
            </div>
          </div>
        </section>

        {/* Terms Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Terms Overview
                </h2>
                <p className="text-xl text-gray-600">
                  By using our website and services, you agree to these terms and conditions
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Scale className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Legal Agreement</h3>
                    <p className="text-gray-600 leading-relaxed">
                      These terms form a legally binding agreement between you and Whitlin.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We clearly outline your rights and our responsibilities to you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Please read these terms carefully as they affect your legal rights.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Acceptance of Terms */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Acceptance of Terms
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Terms</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    By accessing and using the Whitlin website, you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">You must be at least 18 years old to use our services</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">You agree to provide accurate and complete information</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">You are responsible for maintaining the confidentiality of your account</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">You agree to use our services only for lawful purposes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Product Information & Usage
              </h2>

              <div className="space-y-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Descriptions</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We strive to provide accurate product descriptions, images, and specifications. However, we cannot 
                      guarantee that all product descriptions are completely accurate, complete, or error-free.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Product images are for illustrative purposes only</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Colors may vary slightly due to monitor settings</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">We reserve the right to correct any errors or omissions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Usage & Safety</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our products are designed for professional and personal use. Please follow all instructions and safety guidelines:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Read and follow all product instructions carefully</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Perform a patch test before first use</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Discontinue use if you experience any adverse reactions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Keep products out of reach of children</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Orders & Payments */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Orders & Payments
              </h2>

              <div className="space-y-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Processing</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        When you place an order, you are making an offer to purchase products. We reserve the right to 
                        accept or decline your order for any reason, including but not limited to:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Product availability</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Pricing errors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Suspected fraud or unauthorized use</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Shipping restrictions</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Terms</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        Payment is required at the time of order placement. We accept the following payment methods:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Credit cards (Visa, MasterCard, American Express, Discover)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">PayPal</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Apple Pay and Google Pay</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Shop Pay</span>
                        </li>
                      </ul>
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                        <p className="text-amber-800 text-sm">
                          <strong>Note:</strong> All payments are processed securely through encrypted connections. 
                          We do not store your complete payment information on our servers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Shipping & Returns
              </h2>

              <div className="space-y-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        We ship to all 50 US states and Canada. Shipping times and costs vary by location and method:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Standard shipping: 3-5 business days (free on orders over $75)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Express shipping: 1-2 business days ($12.99)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Overnight shipping: Next business day ($24.99)</span>
                        </li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        We are not responsible for delays caused by weather, natural disasters, or other circumstances 
                        beyond our control.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        We offer a 30-day money-back guarantee on all products. Returns must meet the following conditions:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Products must be returned within 30 days of delivery</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Items must be unopened or gently used</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Original packaging and receipt required</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Free return shipping provided</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Limitation of Liability
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Disclaimer of Warranties</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Our products are provided "as is" without warranties of any kind, either express or implied. 
                    We disclaim all warranties, including but not limited to:
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Merchantability and fitness for a particular purpose</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Non-infringement of third-party rights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Accuracy, reliability, or completeness of information</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Damages</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In no event shall Whitlin be liable for any indirect, incidental, special, consequential, 
                    or punitive damages, including but not limited to:
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Loss of profits, data, or use</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Business interruption</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Personal injury or property damage</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> Our total liability to you for any claims arising from these terms 
                      or your use of our services shall not exceed the amount you paid for the products in question.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Intellectual Property
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Ownership</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    All content on this website, including but not limited to text, graphics, logos, images, 
                    and software, is the property of Whitlin and is protected by copyright and other 
                    intellectual property laws.
                  </p>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Permitted Use</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may use our website and content for personal, non-commercial purposes only. You may not:
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Copy, modify, or distribute our content without permission</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Use our trademarks or logos without authorization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Reverse engineer or attempt to extract source code</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Use automated systems to access our website</span>
                    </li>
                  </ul>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> If you believe your intellectual property rights have been violated, 
                      please contact us immediately at info@whitlin.com.
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
                Contact Information
              </h2>

              <Card className="p-8">
                <CardContent className="p-0">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-amber-600" />
                        Email
                      </h3>
                      <p className="text-gray-700 mb-2">info@whitlin.com</p>
                      <p className="text-sm text-gray-600">For legal and terms-related inquiries</p>
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

                  <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Mailing Address:</strong><br />
                      Whitlin Legal Department<br />
                      Aspin Tower<br />
                      Sheikh Zayed Road<br />
                      Dubai, United Arab Emirates
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
                    Changes to Terms
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We reserve the right to modify these Terms of Service at any time. When we make changes, we will:
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Update the "Last updated" date at the top of this page</span>
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
                    Your continued use of our website and services after any changes constitutes acceptance of the new terms. 
                    If you do not agree to the modified terms, you must discontinue use of our services.
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
