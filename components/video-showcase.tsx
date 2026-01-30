"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import Image from "next/image"

interface VideoShowcaseProps {
  videoUrl?: string
  thumbnailUrl?: string
  title?: string
  description?: string
}

export function VideoShowcase({ 
  videoUrl = "/Untitled-design-video.mp4",
  thumbnailUrl = "/hero.jpg",
  title = "Discover Whitlin Excellence",
  description = "Experience the craftsmanship and quality that goes into every piece of our premium hospitality linen."
}: VideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    if (isPlaying) {
      video.play().catch((err) => {
        console.error("Error playing video:", err)
      })
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    video.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-white via-secondary/10 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(233,225,207,0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up-scale" delay={100}>
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/80 font-semibold text-sm sm:text-base">
              <Play className="w-4 h-4 mr-2" />
              Watch Our Story
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
              {title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </ScrollAnimate>

        <ScrollAnimate animation="zoom-in-blur" delay={200}>
          <div 
            ref={containerRef}
            className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_rgba(233,225,207,0.3)] transition-all duration-500 group"
          >
            {/* Video Container */}
            <div className="relative aspect-video bg-navy-950">
              {/* Video Element */}
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                onEnded={handleVideoEnd}
                preload="metadata"
              />

              {!isPlaying && (
                <>
                  {/* Thumbnail Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center group/play z-10"
                    aria-label="Play video"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-secondary/90 hover:bg-secondary rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 video-play-button group-hover/play:scale-125">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary ml-1" />
                    </div>
                  </button>
                </>
              )}

              {/* Controls Overlay */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6 transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
              }`}>
                <div className="flex items-center justify-end gap-3 sm:gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 btn-circular"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 btn-circular"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 btn-circular"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative border on hover */}
            <div className="absolute inset-0 border-4 border-secondary/0 group-hover:border-secondary/30 transition-all duration-500 pointer-events-none rounded-2xl sm:rounded-3xl" />
          </div>
        </ScrollAnimate>

        {/* Additional content */}
        <ScrollAnimate animation="fade-in-up-scale" delay={400}>
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the quality and craftsmanship that has made Whitlin a trusted name in hospitality linen for over four decades.
            </p>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}

