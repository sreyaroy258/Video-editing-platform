'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setVideoFile(file)
    setIsProcessing(true)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsProcessing(false)

        // Save video URL to localStorage
        const videoUrl = URL.createObjectURL(file)
        localStorage.setItem('uploadedVideo', videoUrl)

        // Redirect
        router.push('/edit')
      }
    }, 400)
  }, [router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false,
  })

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-10 rounded-xl cursor-pointer text-center bg-white hover:bg-gray-50 transition"
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto text-gray-400" size={40} />
            {isDragActive ? (
              <p className="text-gray-700">Drop the video here...</p>
            ) : (
              <p className="text-gray-500">Drag & drop a video file here, or click to select</p>
            )}
          </div>

          {videoFile && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Processing: {videoFile.name}</p>
              <Progress value={uploadProgress} className="h-4" />
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setVideoFile(null)
              setUploadProgress(0)
            }}
            disabled={!videoFile}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
