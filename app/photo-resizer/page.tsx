'use client';

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DragDropZone from '../components/DragDropZone';
import { resizeImage, PRESET_SIZES, ResizeOptions } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import AdBanner from "../components/AdBanner";

export default function PhotoResizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customSize, setCustomSize] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 80,
  });

  const handleFilesDrop = async (files: File[]) => {
    if (files.length === 0) return;
    setSelectedFile(files[0]);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    try {
      const options = selectedPreset
        ? { ...PRESET_SIZES[selectedPreset as keyof typeof PRESET_SIZES], quality: customSize.quality }
        : customSize;

      const resizedImageBlob = await resizeImage(selectedFile, options);
      
      // Create download link
      const url = URL.createObjectURL(resizedImageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resized_${selectedFile.name.split('.')[0]}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Image resized successfully!');
    } catch (error) {
      toast.error('Error resizing image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-black">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Photo Resizer</h1>
        
        {/* Ad Banner at the top of the page */}
        <div className="mb-8 w-full">
          <AdBanner 
            slot="photo_resizer_top" 
            format="horizontal" 
            className="rounded-lg overflow-hidden"
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preset Sizes
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Custom Size</option>
                  {Object.entries(PRESET_SIZES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} ({value.width}x{value.height})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedPreset && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={customSize.width}
                    onChange={(e) => setCustomSize({ ...customSize, width: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={customSize.height}
                    onChange={(e) => setCustomSize({ ...customSize, height: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality ({customSize.quality}%)
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={customSize.quality}
                onChange={(e) => setCustomSize({ ...customSize, quality: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customSize.maintainAspectRatio}
                  onChange={(e) => setCustomSize({ ...customSize, maintainAspectRatio: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 mr-2"
                />
                <span className="text-sm text-gray-700">Maintain aspect ratio</span>
              </label>
            </div>

            <DragDropZone
              onFilesDrop={handleFilesDrop}
              accept={{
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
              }}
              title={selectedFile ? selectedFile.name : 'Drop your photo here'}
              subtitle="Supported formats: JPG, PNG"
              preview={true}
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
                {isProcessing ? 'Processing...' : 'Save Resized Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Ad Banner at the bottom of the page */}
        <div className="mt-8 w-full">
          <AdBanner 
            slot="photo_resizer_bottom" 
            format="horizontal" 
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </main>
  );
} 