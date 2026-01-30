"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RotateCcw, 
  Clock, 
  Shield, 
  Package, 
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <RotateCcw className="w-4 h-4 mr-2" />
                Returns & Exchanges
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Easy 
                <span className="text-amber-600"> Returns & Exchanges</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We want you to love your Whitlin products. If you're not completely satisfied, 
                we offer hassle-free returns and exchanges within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Return Policy Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our Return Policy
                </h2>
                <p className="text-xl text-gray-600">
                  Simple, fair, and customer-friendly return process
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">30-Day Window</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Return or exchange any unopened or gently used products within 30 days of delivery.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Returns</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We provide free return shipping labels for all returns. No hidden fees or restocking charges.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Refund</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Receive a full refund to your original payment method within 5-7 business days.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  How to Return Your Order
                </h2>
                <p className="text-xl text-gray-600">
                  Follow these simple steps to return your products
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-amber-600">1</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Contact Customer Service
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Email us at info@whitlin.com or call +971 45 754 785 to initiate your return. 
                            Please have your order number ready.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-amber-600">2</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Receive Return Label
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            We'll email you a prepaid return shipping label and return authorization number 
                            within 24 hours.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-amber-600">3</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Package Your Items
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Securely package your items in the original packaging or a similar box. 
                            Include the return authorization number.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-amber-600">4</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Ship Your Return
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Drop off your package at any authorized shipping location or schedule a pickup. 
                            Track your return with the provided tracking number.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Need Help with Your Return?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-gray-600 mb-6">
                        Our customer service team is here to help make your return process as smooth as possible.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                          <Mail className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Support</p>
                            <p className="text-sm text-gray-600">info@whitlin.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                          <Phone className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="font-medium text-gray-900">Phone Support</p>
                            <p className="text-sm text-gray-600">+971 45 754 785</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link href="/contact">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700">
                            Contact Support
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Return Conditions
                </h2>
                <p className="text-xl text-gray-600">
                  What you need to know about returning products
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Eligible for Return</h3>
                  
                  <div className="space-y-6">
                    <Card className="p-6 bg-green-50 border-green-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-green-900 mb-2">
                              Unopened Products
                            </h4>
                            <p className="text-green-800">
                              Products in original, unopened packaging with all seals intact.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-green-50 border-green-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-green-900 mb-2">
                              Gently Used Products
                            </h4>
                            <p className="text-green-800">
                              Products that have been used once or twice but are still in good condition.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-green-50 border-green-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-green-900 mb-2">
                              Defective Products
                            </h4>
                            <p className="text-green-800">
                              Products with manufacturing defects or damaged during shipping.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Not Eligible for Return</h3>
                  
                  <div className="space-y-6">
                    <Card className="p-6 bg-red-50 border-red-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-red-900 mb-2">
                              Heavily Used Products
                            </h4>
                            <p className="text-red-800">
                              Products that are more than 50% used or show significant wear.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-red-50 border-red-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-red-900 mb-2">
                              Personalized Items
                            </h4>
                            <p className="text-red-800">
                              Custom or personalized products that cannot be resold.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-red-50 border-red-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-red-900 mb-2">
                              Past 30 Days
                            </h4>
                            <p className="text-red-800">
                              Products returned after the 30-day return window has expired.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Process */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Exchange Process
                </h2>
                <p className="text-xl text-gray-600">
                  Need a different size or want to try a different product?
                </p>
              </div>

              <Card className="p-8 bg-white">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        How Exchanges Work
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">Contact us to initiate an exchange</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">Return the original item using our free return label</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">We'll ship your new item once we receive the return</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">Pay only the price difference if applicable</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Exchange Benefits
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">Free return shipping</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">No restocking fees</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">Fast processing</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">Easy online tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Important Notes
                </h2>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-2">
                          Processing Time
                        </h3>
                        <p className="text-blue-800">
                          Returns are processed within 5-7 business days after we receive your package. 
                          Refunds will appear on your original payment method within 1-2 billing cycles.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-amber-50 border-amber-200">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-amber-900 mb-2">
                          Original Payment Method
                        </h3>
                        <p className="text-amber-800">
                          Refunds are issued to the original payment method used for the purchase. 
                          If you used a gift card, the refund will be issued as store credit.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-green-50 border-green-200">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-green-900 mb-2">
                          Customer Satisfaction
                        </h3>
                        <p className="text-green-800">
                          Your satisfaction is our priority. If you have any issues with your return 
                          or exchange, please don't hesitate to contact our customer service team.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
