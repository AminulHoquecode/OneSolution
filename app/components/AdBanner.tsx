'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdBanner({ 
  slot, 
  format = 'auto', 
  style = {}, 
  className = '' 
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="YOUR_AD_CLIENT_ID" // Replace with your AdSense client ID
        data-ad-slot={slot} // Replace with your ad slot ID
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 