"use client"

import { useState } from "react"
import Image from "next/image"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const galleryImages = [
  {
    src: "/images/refresh/hero-interior.jpg",
    alt: "Luxurious Bedroom Interior",
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    src: "/images/refresh/istock-pillows.jpg",
    alt: "Premium Pillows Detail",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    src: "/images/refresh/bedding-detail-1.jpg",
    alt: "High Thread Count Sheets",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    src: "/images/refresh/bedding-detail-2.jpg",
    alt: "Soft Texture Detail",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    src: "/images/refresh/istock-white-bed.jpg",
    alt: "Hotel Quality Bedding",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
]

export function GalleryShowcase() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section className="relative w-full overflow-hidden bg-navy-50 py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,225,207,0.3),transparent_50%)]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">
              Visual Experience
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-navy-900">
              The Art of Comfort
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Experience the visual journey of our premium collections. Every thread, every texture tells a story of luxury and relaxation.
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]">
          {galleryImages.map((image, index) => (
            <ScrollAnimate 
              key={index} 
              animation="scale-up" 
              delay={index * 100}
              className={cn("relative group overflow-hidden rounded-xl shadow-lg cursor-pointer", image.span)}
            >
              <div 
                className="relative w-full h-full"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/20 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-white/90 backdrop-blur-sm text-navy-900 px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    View Detail
                  </span>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none">
          {selectedImage && (
            <div className="relative aspect-[16/9] w-full max-h-[85vh] rounded-lg overflow-hidden">
               <Image
                 src={selectedImage}
                 alt="Gallery Preview"
                 fill
                 className="object-contain"
               />
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
               >
                 <span className="sr-only">Close</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
