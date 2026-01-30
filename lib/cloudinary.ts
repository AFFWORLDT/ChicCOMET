import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dsght9yix',
  api_key: '348164423488494',
  api_secret: '1QmRiWBXuZzcGYNLsW0tSjVoLfU',
  secure: true
})

export default cloudinary

export const uploadImage = async (file: File, folder: string = 'whitlin-products') => {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 800, crop: 'limit', quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    throw new Error('Failed to upload image')
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    throw new Error('Failed to delete image')
  }
}
