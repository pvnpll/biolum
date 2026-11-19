'use client';

import { useState, useRef } from 'react';
import { useBiodataStore } from '@/lib/store/biodata';
import { Download, Share2, Image, FileText, Loader2, Check, QrCode } from 'lucide-react';
import domtoimage from 'dom-to-image';

export function ExportPanel() {
  const { data, isPremium } = useBiodataStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const markDone = (key: string) => {
    setDone(key);
    setTimeout(() => setDone(null), 2500);
  };

  const exportImage = async () => {
    setLoading('image');
    try {
      const node = document.getElementById('biodata-preview');
      if (!node) return;
      const blob = await domtoimage.toBlob(node, { quality: 1, bgcolor: '#fff', width: node.offsetWidth * 2, height: node.offsetHeight * 2 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personal.fullName || 'biodata'}-biolum.png`;
      a.click();
      URL.revokeObjectURL(url);
      markDone('image');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const shareWhatsApp = async () => {
    setLoading('whatsapp');
    try {
      const node = document.getElementById('biodata-preview');
      if (!node) return;
      const blob = await domtoimage.toBlob(node, { quality: 1, bgcolor: '#fff' });
      const file = new File([blob], 'biodata.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `${data.personal.fullName} - Marriage Biodata`, text: 'Please find my biodata attached.' });
      } else {
        // Fallback: open WhatsApp web
        window.open(`https://wa.me/?text=${encodeURIComponent(`Hi! Please find the marriage biodata for ${data.personal.fullName}.`)}`, '_blank');
      }
      markDone('whatsapp');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const exportPdf = () => {
    setLoading('pdf');
    // Trigger browser print dialog (simplest PDF method)
    window.print();
    setTimeout(() => { setLoading(null); markDone('pdf'); }, 1000);
  };

  const BtnIcon = ({ key: k, icon: Icon, label, color, onClick }: any) => {
    const isLoading = loading === k;
    const isDone = done === k;
    return (
      <button
        onClick={onClick}
        disabled={!!loading}
        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-medium ${
          color === 'green'
            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50'
            : color === 'blue'
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50'
            : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-50'
        }`}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700">Export & Share</div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={exportImage} disabled={!!loading}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50 text-xs font-medium transition-all">
          {loading === 'image' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'image' ? <Check className="w-5 h-5" /> : <Image className="w-5 h-5" />}
          Save Image
        </button>

        <button onClick={shareWhatsApp} disabled={!!loading}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 text-xs font-medium transition-all">
          {loading === 'whatsapp' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'whatsapp' ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          WhatsApp
        </button>

        <button onClick={exportPdf} disabled={!!loading}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 ${
            isPremium
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
          {loading === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'pdf' ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          {isPremium ? 'Save PDF' : 'PDF (Premium)'}
        </button>
      </div>

      {!isPremium && (
        <div className="text-xs text-gray-400 text-center">
          🔒 Clean watermark-free PDF — <button className="text-rose-600 font-medium hover:underline">Upgrade ₹49</button>
        </div>
      )}

      <div className="border-t border-gray-100 pt-3">
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Your data stays on your device — never uploaded to our servers.
        </div>
      </div>
    </div>
  );
}
