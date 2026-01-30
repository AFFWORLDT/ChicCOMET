import connectDB from './mongodb'
import User from './models/User'

async function checkAdmin() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    const admin = await User.findOne({ email: 'admin@whitlin.com' })
    
    if (admin) {
      console.log('Admin user found:')
      console.log('Email:', admin.email)
      console.log('Name:', admin.name)
      console.log('Role:', admin.role)
      console.log('isActive:', admin.isActive)
      console.log('Password:', admin.password)
      console.log('Full user object:', JSON.stringify(admin, null, 2))
    } else {
      console.log('Admin user not found')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error checking admin:', error)
    process.exit(1)
  }
}

checkAdmin()
