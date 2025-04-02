'use client';

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DragDropZone from '../components/DragDropZone';
import { resizePDF } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export default function PDFResizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFilesDrop = async (files: File[]) => {
    if (files.length === 0) return;
    setSelectedFile(files[0]);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      const resizedPdfBytes = await resizePDF(selectedFile, scale);
      
      // Create download link
      const blob = new Blob([resizedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resized_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF resized successfully!');
    } catch (error) {
      toast.error('Error resizing PDF');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">PDF Resizer</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale Factor
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-20">
                {scale.toFixed(1)}x
              </span>
            </div>
          </div>

          <DragDropZone
            onFilesDrop={handleFilesDrop}
            accept={{
              'application/pdf': ['.pdf'],
            }}
            title={selectedFile ? selectedFile.name : 'Drop your PDF here'}
            subtitle="Supported format: PDF up to 10MB"
          />

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={!selectedFile || isProcessing}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                !selectedFile || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Save Resized PDF'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 