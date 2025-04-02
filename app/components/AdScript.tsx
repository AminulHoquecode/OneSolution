'use client';

import Script from 'next/script';

export default function AdScript() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_AD_CLIENT_ID"
      crossOrigin="anonymous"
    />
  );
} 