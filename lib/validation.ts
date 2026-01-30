import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters')
export const phoneSchema = z.string().optional()

// User validation schemas
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  images: z.array(z.string()).optional(),
  attributes: z.array(z.object({
    name: z.string(),
    value: z.string(),
    type: z.enum(['color', 'size', 'text', 'number'])
  })).optional()
})

// Order validation schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive')
})

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required')
})

export const orderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().optional(),
  notes: z.string().optional()
})

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  attributes: z.array(z.object({
    name: z.string(),
    type: z.enum(['color', 'size', 'text', 'number']),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional()
  })).optional()
})

// Utility function to validate request body
export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: string; details: string[] } {
  const result = schema.safeParse(body)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    error: 'Validation failed',
    details: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  }
}
