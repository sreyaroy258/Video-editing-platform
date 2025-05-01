'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Separator } from '../../../components/ui/separator'

type TextOverlay = {
  text: string
  position: 'top' | 'center' | 'bottom'
  color: string
  fontSize: string
  time?: string
}

type ImageOverlay = {
  url: string
  position: 'top' | 'center' | 'bottom'
  time?: string
}

export default function VideoEditorPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [usedElements, setUsedElements] = useState<string[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([])
  const [videoEffect, setVideoEffect] = useState<'none' | 'grayscale' | 'blur'>('none')

  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const storedUrl = localStorage.getItem('uploadedVideo')
    if (storedUrl) {
      setVideoUrl(storedUrl)
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoUrl])

  const addElement = (element: string) => {
    if (element === 'Mute Audio') {
      setIsMuted(true)
    }

    if (element === 'Add Text') {
      const userText = prompt('Enter the text to overlay:') 
      const position = prompt('Enter position (top, center, bottom):', 'top') as 'top' | 'center' | 'bottom'
      const color = prompt('Enter text color (e.g. white, red, #00ff00):', 'white') || 'white'
      const fontSize = prompt('Enter font size (e.g. 16px, 24px):', '20px') || '20px'
      const time = prompt('Enter time (e.g. 00:30):', '00:30') || '00:30'

      if (userText) {
        const overlay: TextOverlay = {
          text: userText,
          position,
          color,
          fontSize,
          time,
        }
        setTextOverlays((prev) => [...prev, overlay])
      }
    }

    if (element === 'Add Persistent Text') {
      const userText = prompt('Enter the persistent text to overlay:')
      const position = prompt('Enter position (top, center, bottom):', 'top') as 'top' | 'center' | 'bottom'
      const color = prompt('Enter text color (e.g. white, red, #00ff00):', 'white') || 'white'
      const fontSize = prompt('Enter font size (e.g. 16px, 24px):', '20px') || '20px'

      if (userText) {
        const overlay: TextOverlay = {
          text: userText,
          position,
          color,
          fontSize,
        }
        setTextOverlays((prev) => [...prev, overlay])
      }
    }

    if (element === 'Add Image') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return

        const url = URL.createObjectURL(file)
        const position = prompt('Enter position (top, center, bottom):', 'top') as 'top' | 'center' | 'bottom'
        const time = prompt('Enter time (e.g. 00:30):', '00:30') || '00:30'

        setImageOverlays((prev) => [...prev, { url, position, time }])
      }
      input.click()
    }

    if (element === 'Add Persistent Image') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return

        const url = URL.createObjectURL(file)
        const position = prompt('Enter position (top, center, bottom):', 'top') as 'top' | 'center' | 'bottom'

        // Add the persistent image without a time
        setImageOverlays((prev) => [...prev, { url, position }])
      }
      input.click()
    }

    if (element === 'Add Effects') {
      const effect = prompt('Enter effect (none, grayscale, blur):', 'grayscale') as 'none' | 'grayscale' | 'blur'
      if (['none', 'grayscale', 'blur'].includes(effect)) {
        setVideoEffect(effect)
      }
    }

    setUsedElements((prev) => [...prev, element])
  }

  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'top':
        return 'top-4 left-4'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'bottom':
        return 'bottom-4 left-4'
      default:
        return 'top-4 left-4'
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 border-r space-y-4">
        <h2 className="text-lg font-semibold">Tools</h2>
        <Separator />
        <ScrollArea className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Trim Video')}>
            ✂️ Trim Video
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Mute Audio')}>
            🔇 Mute Audio
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Add Text')}>
            ✍️ Add Text (Timed)
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Add Persistent Text')}>
            ✍️ Add Persistent Text
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Add Persistent Image')}>
            📷 Add Persistent Image
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Add Effects')}>
            ✨ Add Effects
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addElement('Subtitles')}>
            📝 Subtitles
          </Button>
          <Separator className="my-4" />
          <Button variant="destructive" className="w-full" onClick={() => router.push('/')}>
            ❌ Cancel
          </Button>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center justify-start p-6 gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Advanced Video Editor</h1>

        {videoUrl ? (
          <>
            {/* Video Player with Overlays */}
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-md">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                muted={isMuted}
                className={`w-full h-full object-contain ${
                  videoEffect === 'grayscale'
                    ? 'filter grayscale'
                    : videoEffect === 'blur'
                    ? 'filter blur-sm'
                    : ''
                }`}
              />
              {textOverlays.map((overlay, index) => {
                const [min, sec] = overlay.time ? overlay.time.split(':').map(Number) : [0, 0]
                const showTime = min * 60 + sec
                const shouldShow = overlay.time ? Math.abs(currentTime - showTime) < 1 : true
                if (!shouldShow) return null
                return (
                  <p
                    key={index}
                    className={`absolute ${getPositionStyles(overlay.position)} bg-black/60 px-2 py-1 rounded`}
                    style={{ color: overlay.color, fontSize: overlay.fontSize }}
                  >
                    {overlay.text}
                  </p>
                )
              })}
              {imageOverlays.map((overlay, index) => {
                const [min, sec] = overlay.time ? overlay.time.split(':').map(Number) : [0, 0]
                const showTime = min * 60 + sec
                const shouldShow = overlay.time ? Math.abs(currentTime - showTime) < 1 : true
                if (!shouldShow) return null
                return (
                  <img
                    key={index}
                    src={overlay.url}
                    alt="Overlay"
                    className={`absolute w-24 h-24 object-contain ${getPositionStyles(overlay.position)}`}
                  />
                )
              })}
            </div>

            {/* Timeline */}
            <div className="w-full max-w-4xl bg-white border rounded-lg p-4 shadow">
              <p className="text-center text-sm text-gray-600 mb-2">🎞️ Editing Timeline</p>
              <div className="h-16 bg-gray-200 rounded flex items-center justify-between px-4 text-xs text-gray-500 relative">
                <span>00:00</span>
                <span>00:30</span>
                <span>01:00</span>
                <span>01:30</span>
                <span>02:00</span>

                {/* Text Markers */}
                {textOverlays.map((overlay, index) => {
                  const [min, sec] = overlay.time ? overlay.time.split(':').map(Number) : [0, 0]
                  const showTime = min * 60 + sec
                  return (
                    <div
                      key={`text-${index}`}
                      className="absolute top-0 text-[10px] text-blue-600"
                      style={{ left: `${(showTime / 120) * 100}%` }}
                    >
                      ✍️
                      <div className="text-[8px] whitespace-nowrap">{overlay.text.slice(0, 10)}...</div>
                    </div>
                  )
                })}

                {/* Image Markers */}
                {imageOverlays.map((overlay, index) => {
                  const [min, sec] = overlay.time ? overlay.time.split(':').map(Number) : [0, 0]
                  const showTime = min * 60 + sec
                  return (
                    <div
                      key={`img-${index}`}
                      className="absolute top-6 text-[10px] text-green-600"
                      style={{ left: `${(showTime / 120) * 100}%` }}
                    >
                      🖼️
                      <div className="text-[8px]">Image</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="text-red-500">Loading video...</p>
        )}
      </section>

      {/* Right Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 border-l">
        <h2 className="text-lg font-semibold mb-2">Used Elements</h2>
        <Separator />
        <ScrollArea className="mt-4 space-y-2">
          {usedElements.map((element, index) => (
            <div key={index} className="text-sm text-gray-600">
              {element}
            </div>
          ))}
        </ScrollArea>
      </aside>
    </main>
  )
}
