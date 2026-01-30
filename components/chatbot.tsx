"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { MessageCircle, X, Send, Loader2, Bot, User, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollAnimate } from "@/components/scroll-animate"
import { faqDataPart1 } from "@/lib/faq-data-part1"
import { faqDataPart2 } from "@/lib/faq-data-part2"
import { faqDataPart3 } from "@/lib/faq-data-part3"
import { faqDataPart4 } from "@/lib/faq-data-part4"
import { faqDataPart5 } from "@/lib/faq-data-part5"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  suggestions?: string[] // Optional suggestions for bot messages
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

// Combine all FAQ data
const allFAQs: FAQ[] = [
  ...faqDataPart1,
  ...faqDataPart2,
  ...faqDataPart3,
  ...faqDataPart4,
  ...faqDataPart5
]

// Common quick questions based on FAQ categories
const quickQuestions = [
  "What products do you offer?",
  "How do I place an order?",
  "What are your shipping costs?",
  "What is Thread Count (TC)?",
]

// Fallback responses for specific scenarios
const fallbackResponses: Record<string, string> = {
  "contact": "You can reach us at:\n\n📧 Email: info@whitlin.com\n📞 Phone: +971 54 438 9849, +971 50 396 1541\n🌍 Global Helpline: +91 99928 43000\n📍 Address: Al Ittihad Road, Dubai, United Arab Emirates\n   View on map: https://maps.app.goo.gl/Q5CVsPpM9eMm7GMc7\n\nBusiness Hours:\n• Sunday - Thursday: 9:00 AM - 6:00 PM GST\n• Friday: 10:00 AM - 4:00 PM GST\n• Saturday: Closed\n\n📱 Follow us: https://linktr.ee/WhitlinTrading",
  "order_details": "To view your order details:\n\n1. Log in to your account\n2. Go to 'My Account' or 'Orders' section\n3. Click on the order you want to view\n\nYou can also access your orders directly at /orders or from your account dashboard. Each order shows:\n• Order number and date\n• Items ordered\n• Shipping address\n• Order status\n• Tracking information\n• Invoice download\n\nIf you need help finding a specific order, please contact us at info@whitlin.com with your order number.",
  "default": "I apologize, but I couldn't find a specific answer for that. \n\nCould you please rephrase your question? You can ask about:\n• Products specifications (TC, GSM)\n• Order status & Tracking\n• Shipping & Returns\n• Care instructions\n\nOr contact our team directly at info@whitlin.com for immediate assistance."
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Whitlin AI assistant. I can help you with product details, orders, shipping, and care guides. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Semantic search function to find best matching FAQ
  const findBestMatch = (query: string): FAQ | null => {
    const lowerQuery = query.toLowerCase().trim()
    // Remove common stop words to focus on keywords
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had', 'what', 'where', 'when', 'why', 'how', 'can', 'could', 'would', 'should', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'ours', 'theirs'];
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w))
    
    if (queryWords.length === 0) return null

    // Score each FAQ based on keyword matches
    const scoredFAQs = allFAQs.map(faq => {
      const questionLower = faq.question.toLowerCase()
      const answerLower = faq.answer.toLowerCase()
      let score = 0

      // Exact phrase match in QUESTION (Highest Priority)
      if (lowerQuery.length > 5 && questionLower.includes(lowerQuery)) {
        score += 150
      }

      // Word matches in QUESTION (High Priority)
      queryWords.forEach(word => {
        if (questionLower.includes(word)) {
          // Boost score for specific technical terms
          if (['gsm', 'tc', 'thread', 'cotton', 'size', 'return', 'refund', 'track'].includes(word)) {
             score += 25
          } else {
             score += 15
          }
        }
      })

      // Minimal score for matches in ANSWER (Low Priority)
      // This prevents matching completely unrelated questions just because the answer has a common word
      queryWords.forEach(word => {
         // Only count answer matches if there's at least SOME match in the question or if it's a very specific term
         if (answerLower.includes(word)) {
            if (['gsm', 'tc', 'thread', 'cotton', 'refund'].includes(word)) {
               score += 5
            } else {
               score += 1 // Very low weight for generic words in answer
            }
         }
      })

      // Category relevance - slightly boost
      const categoryLower = faq.category.toLowerCase()
      queryWords.forEach(word => {
        if (categoryLower.includes(word)) {
          score += 5
        }
      })

      return { faq, score }
    })

    // Sort by score and return best match
    scoredFAQs.sort((a, b) => b.score - a.score)
    const bestMatch = scoredFAQs[0]

    // DEBUG: Log best match for testing (can be removed in prod)
    // console.log(`Query: "${query}" | Best Match: "${bestMatch.faq.question}" | Score: ${bestMatch.score}`);

    // SIGNIFICANTLY INCREASED THRESHOLD
    // Previous was 5. Now we require at least one strong keyword match in the question (15+) or multiple weak matches.
    return bestMatch && bestMatch.score >= 15 ? bestMatch.faq : null
  }

  // Get bot response using FAQ data
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()
    
    // Handle greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)[\s!.]*$/i)) {
      return "Hello! Welcome to Whitlin. I'm here to help you with any questions about our premium hospitality linen products. What would you like to know?"
    }

    // Handle order details/tracking queries first (before general order matching)
    if (lowerMessage.includes('order details') || lowerMessage.includes('order detail') || 
        (lowerMessage.includes('get') && lowerMessage.includes('order') && !lowerMessage.includes('place')) || 
        (lowerMessage.includes('view') && lowerMessage.includes('order')) ||
        lowerMessage.includes('track') || lowerMessage.includes('status')) {
      
        // If it looks like tracking, try to give specific tracking info first
        if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
           const trackingFAQ = findBestMatch('how do I track my order')
           return trackingFAQ && trackingFAQ.id !== '' ? trackingFAQ.answer : fallbackResponses.order_details
        }
        return fallbackResponses.order_details
    }

    // Try to find matching FAQ
    const matchedFAQ = findBestMatch(userMessage)
    if (matchedFAQ) {
      return matchedFAQ.answer
    }

    // Fallback to keyword-based matching for common queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || 
        lowerMessage.includes('call') || lowerMessage.includes('reach') || lowerMessage.includes('support')) {
      return fallbackResponses.contact
    }

    // Return default response
    return fallbackResponses.default
  }

  // Get practical, helpful suggestions based on context
  const getRelatedQuestions = (answer: string, userQuery: string): string[] => {
    const answerLower = answer.toLowerCase()
    const queryLower = userQuery.toLowerCase()
    
    // Practical action-oriented suggestions based on what user asked
    const suggestions: string[] = []
    
    // If user asked about products, suggest practical product questions
    if (queryLower.includes('product') || queryLower.includes('offer') || queryLower.includes('sell') || 
        answerLower.includes('bed linen') || answerLower.includes('bath linen') || answerLower.includes('towels')) {
      suggestions.push(
        "What sizes do your bedsheets come in?",
        "What is Thread Count (TC)?",
        "What sizes are available for towels?",
        "How do I choose the right product?"
      )
    }
    
    // If user asked about ordering, suggest order-related actions
    else if (queryLower.includes('order') || queryLower.includes('buy') || queryLower.includes('purchase') ||
             answerLower.includes('place an order') || answerLower.includes('checkout')) {
      suggestions.push(
        "How long does delivery take?",
        "What are your shipping costs?",
        "What payment methods are accepted?",
        "Do you offer bulk discounts?"
      )
    }
    
    // If user asked about shipping/delivery
    else if (queryLower.includes('shipping') || queryLower.includes('delivery') || queryLower.includes('ship') ||
             answerLower.includes('shipping') || answerLower.includes('delivery')) {
      suggestions.push(
        "How do I track my order?",
        "Do you ship internationally?",
        "What are your shipping costs?",
        "Same day delivery options?"
      )
    }
    
    // If user asked about tracking/order status
    else if (queryLower.includes('track') || queryLower.includes('tracking') || queryLower.includes('status') ||
             answerLower.includes('track') || answerLower.includes('tracking')) {
      suggestions.push(
        "How do I view my order details?",
        "What if my package is delayed?",
        "How do I contact support?",
        "Business hours?"
      )
    }
    
    // If user asked about returns/refunds
    else if (queryLower.includes('return') || queryLower.includes('refund') || queryLower.includes('exchange') ||
             answerLower.includes('return') || answerLower.includes('refund')) {
      suggestions.push(
        "How do I initiate a return?",
        "Return policy details",
        "How long do returns take?",
        "Are return shipping costs covered?"
      )
    }
    
    // Default practical suggestions if no specific match
    else {
      suggestions.push(
        "How do I place an order?",
        "What are your shipping options?",
        "How do I track my order?",
        "What is your return policy?"
      )
    }
    
    return suggestions.slice(0, 4)
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowSuggestions(false)

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 800))

    // Get bot response
    const botResponse = getBotResponse(messageText)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)

    // Always show practical, helpful suggestions after bot response
    setTimeout(() => {
      const suggestions = getRelatedQuestions(botResponse, messageText)
      
      if (suggestions.length > 0) {
        const suggestionsMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `💡 You might also want to know:`,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: suggestions
        }
        setMessages(prev => [...prev, suggestionsMessage])
      }
    }, 600)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-secondary hover:bg-secondary/90 text-primary rounded-full shadow-2xl flex items-center justify-center smooth-color-transition hover-scale-smooth button-press btn-circular border-2 border-primary/10 ${
          isOpen ? 'hidden' : 'animate-bounce'
        }`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in border border-border hover-shadow-premium overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-secondary p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-secondary/30">
                <Bot className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-base">Whitlin Assistant</h3>
                <p className="text-xs text-secondary/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-secondary/80 hover:text-secondary hover:bg-white/10 rounded-full p-2 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
             {/* Welcome Timestamp */}
             <div className="text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-full">
                   Today
                </span>
             </div>

            {messages.map((message, index) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0 mt-2 shadow-sm">
                        <Bot className="w-4 h-4 text-secondary" />
                     </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-navy-900 rounded-tl-none border border-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <p className={`text-[10px] mt-1.5 text-right ${
                      message.sender === 'user' ? 'text-white/60' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {/* Show suggestions after bot messages */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-10 pr-4 animate-fade-in-up">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(suggestion)}
                        className="text-xs bg-white text-primary hover:bg-secondary hover:text-primary border border-primary/20 rounded-xl px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0 mt-2">
                    <Bot className="w-4 h-4 text-secondary" />
                 </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            
            {/* Quick Questions / Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-4 pl-10 pr-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground ml-1">Popular questions:</p>
                  <div className="flex flex-col gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs bg-white text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/10 hover:text-primary transition-all duration-200 shadow-sm flex items-center justify-between group"
                      >
                        {question}
                        <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-border">
            <div className="flex space-x-2 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm bg-gray-50 border-gray-200 focus:border-primary pr-10 rounded-xl"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className={`absolute right-1 top-1 h-8 w-8 rounded-lg p-0 transition-all duration-300 ${
                   inputValue.trim() ? 'bg-primary text-secondary hover:bg-navy-800 scale-100' : 'bg-gray-200 text-gray-400 scale-90'
                }`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
