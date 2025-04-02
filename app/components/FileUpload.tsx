import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: Record<string, string[]>
  maxSize?: number
  title?: string
  subtitle?: string
}

export default function FileUpload({
  onFileSelect,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  title = "Drop your file here",
  subtitle = "or click to browse",
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <input {...getInputProps()} />
      <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
} 