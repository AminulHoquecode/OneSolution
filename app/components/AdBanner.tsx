'use client';

import { useEffect } from 'react';

export default function AdBanner() {
    useEffect(() => {
        // @ts-expect-error - Window adsbygoogle is added by external script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}