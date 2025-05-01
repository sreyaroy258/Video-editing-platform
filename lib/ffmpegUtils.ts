// lib/ffmpegUtils.ts
// types/ffmpeg.d.ts
declare module '@ffmpeg/ffmpeg' {
    export function createFFmpeg(config?: any): any
    export function fetchFile(path: string | File | Blob): Promise<Uint8Array>
  }
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

export const loadFFmpeg = async () => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
}

export const trimVideo = async (file: File, start = '00:00:00', duration = '00:00:10') => {
  await loadFFmpeg()

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file))

  await ffmpeg.run('-i', 'input.mp4', '-ss', start, '-t', duration, 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')
  return new Blob([data.buffer], { type: 'video/mp4' })
}

export const muteVideo = async (file: File) => {
  await loadFFmpeg()

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file))

  await ffmpeg.run('-i', 'input.mp4', '-an', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')
  return new Blob([data.buffer], { type: 'video/mp4' })
}
