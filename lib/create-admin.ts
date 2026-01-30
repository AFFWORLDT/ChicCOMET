import connectDB from './mongodb'
import User from './models/User'
import bcrypt from 'bcryptjs'

const createAdmin = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@whitlin.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '+1 (555) 000-0000',
      address: {
        street: '789 Admin St',
        city: 'Admin City',
        state: 'AC',
        zipCode: '00000',
        country: 'US'
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null
      }
    })

    await adminUser.save()
    console.log('Admin user created successfully!')
    console.log('Email: admin@whitlin.com')
    console.log('Password: admin123')
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdmin()
