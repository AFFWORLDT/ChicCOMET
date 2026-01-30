import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to') || 'creators@affworld.io'
    
    console.log('🧪 Testing email sending to:', to)
    
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-box { background: #f0f0f0; padding: 20px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="test-box">
          <h1>✅ Test Email from Whitlin</h1>
          <p>This is a test email to verify that nodemailer is working correctly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this email, nodemailer is configured correctly!</p>
        </div>
      </body>
      </html>
    `
    
    const result = await sendEmail(
      to,
      '🧪 Test Email - Whitlin Order System',
      testHtml,
      'Test Email from Whitlin - If you received this, nodemailer is working!'
    )
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `✅ Test email sent successfully to ${to}`,
        messageId: result.messageId,
        response: result.response,
        note: 'Check your inbox (and spam folder) for the test email'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: result.error,
        code: result.code,
        response: result.response
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error testing email',
      message: error?.message,
      stack: error?.stack
    }, { status: 500 })
  }
}

