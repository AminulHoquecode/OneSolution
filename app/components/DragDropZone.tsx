'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface DragDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  title?: string;
  subtitle?: string;
  preview?: boolean;
}

export default function DragDropZone({
  onFilesDrop,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  title = 'Drop your files here',
  subtitle = 'or click to browse',
  preview = false,
}: DragDropZoneProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          errors.forEach((error: { message: string }) => {
            toast.error(error.message);
          });
        });
        return;
      }

      if (preview) {
        setPreviews(
          acceptedFiles.map((file) => URL.createObjectURL(file))
        );
      }
      
      onFilesDrop(acceptedFiles);
    },
    [onFilesDrop, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {preview && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 