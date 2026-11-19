'use client';

import { useState } from 'react';
import { Share2, Check, Download, QrCode } from 'lucide-react';

interface Props {
  candidateName: string;
  slug: string;
  phone?: string;
  whatsapp?: string;
}

export function ShareableActions({ candidateName, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${candidateName} — Marriage Biodata`,
          text: `Please find the matrimonial biodata profile of ${candidateName}:`,
          url,
        });
        return;
      } catch (e) {
        // user cancelled or share failed
      }
    }
    // Fallback: Copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-sm"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
      </button>

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 bg-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all"
        title="Print this biodata"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Print</span>
      </button>
    </div>
  );
}
