'use client';

import { useState } from 'react';
import { useBiodataStore } from '@/lib/store/biodata';
import { Share2, Image, FileText, Loader2, Check, Globe, Copy, ExternalLink } from 'lucide-react';
import domtoimage from 'dom-to-image';
import Link from 'next/link';

export function ExportPanel() {
  const { data, isPremium } = useBiodataStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const markDone = (key: string) => {
    setDone(key);
    setTimeout(() => setDone(null), 2500);
  };

  const publishWebBiodata = async () => {
    setLoading('publish');
    try {
      const res = await fetch('/api/publish-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        throw new Error('Failed to publish');
      }

      const result = await res.json();
      if (result.slug) {
        setPublishedSlug(result.slug);
        markDone('publish');
      }
    } catch (e) {
      console.error('Publish error:', e);
    } finally {
      setLoading(null);
    }
  };

  const copyShareableLink = async () => {
    if (!publishedSlug) return;
    const url = `${window.location.origin}/p/${publishedSlug}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
        await navigator.share({
          files: [file],
          title: `${data.personal.fullName} - Marriage Biodata`,
          text: `Please find matrimonial biodata for ${data.personal.fullName}.${publishedSlug ? `\nView online profile: ${window.location.origin}/p/${publishedSlug}` : ''}`,
        });
      } else {
        const text = `Namaste, please find the marriage biodata of ${data.personal.fullName}.${publishedSlug ? `\nView interactive digital biodata: ${window.location.origin}/p/${publishedSlug}` : ''}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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
    window.print();
    setTimeout(() => { setLoading(null); markDone('pdf'); }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* SECTION 1: SHARABLE WEB BIODATA (NEW FEATURE) */}
      <div className="p-3.5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-200 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
            <Globe className="w-4 h-4 text-rose-600" />
            <span>Interactive Web Biodata Link</span>
          </div>
          <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">
            NEW
          </span>
        </div>
        <p className="text-[11px] text-gray-600 mb-3 leading-snug">
          Create a private web link for WhatsApp family groups. Includes tap-to-call, tap-to-WhatsApp, and instant updates.
        </p>

        {!publishedSlug ? (
          <button
            onClick={publishWebBiodata}
            disabled={loading === 'publish'}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-2 px-3 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {loading === 'publish' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Private Link...</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Publish Web Biodata Link</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-rose-200 text-xs text-gray-700 font-mono overflow-hidden">
              <span className="truncate flex-1">/p/{publishedSlug}</span>
              <button
                onClick={copyShareableLink}
                className="bg-rose-50 text-rose-700 hover:bg-rose-100 p-1.5 rounded-lg flex-none"
                title="Copy full link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyShareableLink}
                className="flex-1 bg-rose-600 text-white py-1.5 rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center justify-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy Link'}
              </button>
              <Link
                href={`/p/${publishedSlug}`}
                target="_blank"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: INSTANT EXPORT BUTTONS */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Download & Send</div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={exportImage}
            disabled={!!loading}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50 text-xs font-medium transition-all"
          >
            {loading === 'image' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'image' ? <Check className="w-5 h-5" /> : <Image className="w-5 h-5" />}
            Save Image
          </button>

          <button
            onClick={shareWhatsApp}
            disabled={!!loading}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 text-xs font-medium transition-all"
          >
            {loading === 'whatsapp' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'whatsapp' ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            WhatsApp
          </button>

          <button
            onClick={exportPdf}
            disabled={!!loading}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 ${
              isPremium
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            {loading === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'pdf' ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            {isPremium ? 'Save PDF' : 'PDF (Print)'}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-none" />
          <span>Shared profiles stored safely in isolated `biolum_` database tables.</span>
        </div>
      </div>
    </div>
  );
}
