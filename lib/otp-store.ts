// Database-backed OTP store (persists across server restarts)
import connectDB from './mongodb'
import User from './models/User'

interface OTPData {
  otp: string
  email: string
  expiresAt: Date
  isUsed: boolean
}

// Ensure database connection before operations
const ensureDB = async () => {
  try {
    await connectDB()
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export const storeOTP = async (email: string, otp: string, expiresAt: Date): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim()
  
  try {
    await ensureDB()
    
    // Update user with new OTP (clears any existing OTP)
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        resetPassword: {
          otp,
          expiresAt,
          isUsed: false
        }
      },
      { upsert: false } // Don't create user if doesn't exist
    )
    
    console.log(`💾 OTP stored in database for ${normalizedEmail}: ${otp}, expires at: ${expiresAt.toISOString()}`)
  } catch (error) {
    console.error(`❌ Error storing OTP for ${normalizedEmail}:`, error)
    throw error
  }
}

export const getOTP = async (email: string): Promise<OTPData | null> => {
  const normalizedEmail = email.toLowerCase().trim()
  
  try {
    await ensureDB()
    
    const user = await User.findOne({ email: normalizedEmail })
    
    if (!user || !user.resetPassword || !user.resetPassword.otp) {
      return null
    }
    
    const resetPassword = user.resetPassword
    
    // Check if expired
    if (new Date() > resetPassword.expiresAt) {
      // Clean up expired OTP
      await User.findOneAndUpdate(
        { email: normalizedEmail },
        { $unset: { resetPassword: 1 } }
      )
      return null
    }
    
    return {
      otp: resetPassword.otp,
      email: normalizedEmail,
      expiresAt: resetPassword.expiresAt,
      isUsed: resetPassword.isUsed || false
    }
  } catch (error) {
    console.error(`❌ Error getting OTP for ${normalizedEmail}:`, error)
    return null
  }
}

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase().trim()
  const normalizedProvidedOTP = String(otp).trim()
  
  console.log(`🔍 Verifying OTP for email: ${normalizedEmail}`)
  console.log(`🔍 OTP provided: "${normalizedProvidedOTP}" (length: ${normalizedProvidedOTP.length}, type: ${typeof otp})`)
  
  const data = await getOTP(normalizedEmail)
  
  if (!data) {
    console.log(`❌ No OTP found for email: ${normalizedEmail}`)
    return false
  }
  
  if (data.isUsed) {
    console.log(`❌ OTP already used for email: ${normalizedEmail}`)
    return false
  }
  
  // Normalize OTP comparison (trim and ensure string)
  const normalizedStoredOTP = String(data.otp).trim()
  
  console.log(`🔍 Comparing OTPs - Stored: "${normalizedStoredOTP}" (length: ${normalizedStoredOTP.length}) vs Provided: "${normalizedProvidedOTP}" (length: ${normalizedProvidedOTP.length})`)
  
  if (normalizedStoredOTP !== normalizedProvidedOTP) {
    console.log(`❌ OTP mismatch. Expected: "${normalizedStoredOTP}" (length: ${normalizedStoredOTP.length}), Got: "${normalizedProvidedOTP}" (length: ${normalizedProvidedOTP.length})`)
    console.log(`❌ Character codes - Stored: [${normalizedStoredOTP.split('').map(c => c.charCodeAt(0)).join(', ')}], Provided: [${normalizedProvidedOTP.split('').map(c => c.charCodeAt(0)).join(', ')}]`)
    return false
  }
  
  // Check expiration again
  if (new Date() > data.expiresAt) {
    console.log(`❌ OTP expired for email: ${normalizedEmail}. Expired at: ${data.expiresAt.toISOString()}, Current time: ${new Date().toISOString()}`)
    // Clean up expired OTP
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $unset: { resetPassword: 1 } }
    )
    return false
  }
  
  console.log(`✅ OTP verified successfully for email: ${normalizedEmail}`)
  return true
}

export const markOTPAsUsed = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim()
  
  try {
    await ensureDB()
    
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { 'resetPassword.isUsed': true }
    )
    
    console.log(`✅ OTP marked as used for ${normalizedEmail}`)
  } catch (error) {
    console.error(`❌ Error marking OTP as used for ${normalizedEmail}:`, error)
  }
}

export const clearOTP = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim()
  
  try {
    await ensureDB()
    
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $unset: { resetPassword: 1 } }
    )
    
    console.log(`🗑️ OTP cleared for ${normalizedEmail}`)
  } catch (error) {
    console.error(`❌ Error clearing OTP for ${normalizedEmail}:`, error)
  }
}

// Debug function - get all OTPs from database
export const getAllOTPs = async (): Promise<Map<string, OTPData>> => {
  const otpMap = new Map<string, OTPData>()
  
  try {
    await ensureDB()
    
    const users = await User.find({
      'resetPassword.otp': { $exists: true, $ne: null }
    }).select('email resetPassword')
    
    users.forEach(user => {
      if (user.resetPassword && user.resetPassword.otp) {
        otpMap.set(user.email.toLowerCase().trim(), {
          otp: user.resetPassword.otp,
          email: user.email.toLowerCase().trim(),
          expiresAt: user.resetPassword.expiresAt,
          isUsed: user.resetPassword.isUsed || false
        })
      }
    })
    
    console.log(`📋 Found ${otpMap.size} OTPs in database`)
  } catch (error) {
    console.error('❌ Error getting all OTPs:', error)
  }
  
  return otpMap
}
