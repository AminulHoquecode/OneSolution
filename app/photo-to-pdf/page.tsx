'use client';

import { useState } from 'react';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DragDropZone from '../components/DragDropZone';
import { imagesToPDF } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function PhotoToPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesDrop = async (files: File[]) => {
    if (files.length === 0) return;
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...selectedFiles];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setSelectedFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPDF(selectedFiles);
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_photos.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Photos converted to PDF successfully!');
    } catch (error) {
      toast.error('Error converting photos to PDF');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Photo to PDF Converter</h1>
        <p className="text-lg text-gray-600 mb-8">Arrange your photos in the desired order for the PDF</p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <DragDropZone
            onFilesDrop={handleFilesDrop}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
            }}
            maxFiles={10}
            title={selectedFiles.length > 0 
              ? 'Add more photos'
              : 'Drop your photos here'
            }
            subtitle="Supported formats: JPG, PNG (up to 10 files)"
            preview={false}
          />

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Photos</h3>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                        {index + 1}
                      </span>
                      <span className="ml-3 text-gray-700">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        <ArrowUpIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === selectedFiles.length - 1}
                        className={`p-1 rounded ${
                          index === selectedFiles.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 rounded text-gray-600 hover:text-red-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                Images will be arranged in the order shown above
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                Each image will be placed on a new page
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                Images will be automatically scaled to fit the page
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={selectedFiles.length === 0 || isProcessing}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                selectedFiles.length === 0 || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 