'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface FileWithPreview extends File {
  preview?: string;
}

interface DragDropZoneProps {
  onFilesDrop: (files: FileWithPreview[]) => void;
  accept: Record<string, string[]>;
  maxFiles?: number;
  title?: string;
  subtitle?: string;
  preview?: boolean;
}

export default function DragDropZone({ 
  onFilesDrop,
  accept,
  maxFiles = 10,
  title = 'Drop your files here',
  subtitle = 'or click to select files',
  preview = true
}: DragDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    onFilesDrop(filesWithPreview);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  });

  return (
    <div className="flex items-center justify-center w-full">
      <label
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Image
            src="/file.svg"
            alt="Upload icon"
            width={64}
            height={64}
            className="mb-3"
          />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">{title}</span>
          </p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <input {...getInputProps()} className="hidden" />
      </label>
    </div>
  );
}