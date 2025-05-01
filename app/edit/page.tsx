'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function EditPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUrl = localStorage.getItem('uploadedVideo')
    if (storedUrl) {
      setVideoUrl(storedUrl)
    } else {
      router.push('/')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Video Editor</h1>

          {videoUrl ? (
            <div className="space-y-4">
              {/* Centered Video Container */}
              <div className="flex justify-center items-center w-full">
                <div className="w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push('/')}>
                  Upload New Video
                </Button>
                <Button variant="default" onClick={() => router.push('/edit/video')}>
                  Edit Video
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Loading video...</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
