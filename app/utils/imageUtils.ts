export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  quality?: number;
}

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Calculate dimensions
      let targetWidth = options.width || img.width;
      let targetHeight = options.height || img.height;

      if (options.maintainAspectRatio) {
        const ratio = Math.min(
          targetWidth / img.width,
          targetHeight / img.height
        );
        targetWidth = img.width * ratio;
        targetHeight = img.height * ratio;
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create blob'));
          }
        },
        'image/jpeg',
        options.quality ? options.quality / 100 : 0.8
      );

      // Clean up
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Could not load image'));
      URL.revokeObjectURL(img.src);
    };
  });
}

export const PRESET_SIZES = {
  thumbnail: { width: 150, height: 150, maintainAspectRatio: true },
  small: { width: 300, height: 300, maintainAspectRatio: true },
  medium: { width: 800, height: 800, maintainAspectRatio: true },
  large: { width: 1920, height: 1080, maintainAspectRatio: true },
  passport: { width: 600, height: 750, maintainAspectRatio: false },
  profile: { width: 400, height: 400, maintainAspectRatio: false },
}; 