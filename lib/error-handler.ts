import { NextResponse } from 'next/server'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export class CustomError extends Error implements AppError {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export function createErrorResponse(error: unknown, defaultMessage: string = 'Internal server error') {
  console.error('API Error:', error)
  
  let statusCode = 500
  let message = defaultMessage
  let details: string[] | undefined

  if (error instanceof CustomError) {
    statusCode = error.statusCode
    message = error.message
  } else if (error instanceof Error) {
    message = error.message
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      statusCode = 400
      message = 'Validation failed'
    } else if (error.name === 'CastError') {
      statusCode = 400
      message = 'Invalid ID format'
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      statusCode = 500
      // Provide user-friendly message for database errors
      if (message.includes('connection') || message.includes('Connection') || message.includes('SSL') || message.includes('TLS')) {
        message = 'Unable to connect to the database. Please try again in a moment.'
      } else {
        message = 'Database error occurred. Please try again later.'
      }
    } else if (error.name === 'JsonWebTokenError') {
      statusCode = 401
      message = 'Invalid token'
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401
      message = 'Token expired'
    } else if (message.includes('Database connection failed') || message.includes('option keepalive') || message.includes('SSL') || message.includes('TLS')) {
      // Handle database connection errors with user-friendly messages
      statusCode = 500
      message = 'Unable to connect to the database. Please try again in a moment.'
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
    },
    { status: statusCode }
  )
}

export function handleAsyncError(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Common error types
export const BadRequestError = (message: string) => new CustomError(message, 400)
export const UnauthorizedError = (message: string) => new CustomError(message, 401)
export const ForbiddenError = (message: string) => new CustomError(message, 403)
export const NotFoundError = (message: string) => new CustomError(message, 404)
export const ConflictError = (message: string) => new CustomError(message, 409)
export const TooManyRequestsError = (message: string) => new CustomError(message, 429)
export const InternalServerError = (message: string) => new CustomError(message, 500)
