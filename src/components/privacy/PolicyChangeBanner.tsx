'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'autocap_policy_banner_dismissed';

interface PolicyChangeBannerProps {
  version: string;
  lastUpdated: string;
}

export function PolicyChangeBanner({ version, lastUpdated }: PolicyChangeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== version) {
      setVisible(true);
    }
  }, [version]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, version);
    setVisible(false);
  }

  if (!visible) return null;

  const formatted = new Date(lastUpdated).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full bg-[#C8102E] px-4 py-3 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <p className="text-sm">
          Our Privacy Policy has been updated (v{version}, {formatted}). Please review the changes.
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss privacy policy update notification"
          className="shrink-0 text-sm font-semibold underline hover:no-underline"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
