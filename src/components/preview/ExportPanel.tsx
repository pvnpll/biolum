'use client';

import { useState } from 'react';
import { useBiodataStore } from '@/lib/store/biodata';
import {
  Share2, Image, FileText, Loader2, Check, Globe, Copy,
  ExternalLink, Lock, Key, ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import domtoimage from 'dom-to-image';
import Link from 'next/link';

export function ExportPanel() {
  const { data, updateData, isPremium } = useBiodataStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Privacy Protection State
  const [enablePrivacy, setEnablePrivacy] = useState(data.privacySettings?.isEnabled || false);
  const [accessPin, setAccessPin] = useState(data.privacySettings?.accessPin || '1234');
  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
  const [hidePhone, setHidePhone] = useState(data.privacySettings?.hidePhone ?? true);
  const [hideAddress, setHideAddress] = useState(data.privacySettings?.hideAddress ?? true);
  const [hideIncome, setHideIncome] = useState(data.privacySettings?.hideIncome ?? false);
  const [hideAstro, setHideAstro] = useState(data.privacySettings?.hideAstro ?? false);
  const [hidePhoto, setHidePhoto] = useState(data.privacySettings?.hidePhoto ?? false);

  const markDone = (key: string) => {
    setDone(key);
    setTimeout(() => setDone(null), 2500);
  };

  const publishWebBiodata = async () => {
    setLoading('publish');
    try {
      const privacyConfig = enablePrivacy && accessPin.trim() ? {
        isEnabled: true,
        accessPin: accessPin.trim(),
        hidePhone,
        hideAddress,
        hideIncome,
        hideAstro,
        hidePhoto,
      } : undefined;

      const payload = {
        data: {
          ...data,
          privacySettings: privacyConfig,
        },
        accessPin: enablePrivacy && accessPin.trim() ? accessPin.trim() : null,
      };

      const res = await fetch('/api/publish-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    const textToCopy = enablePrivacy && accessPin.trim()
      ? `Namaste, please find the marriage biodata profile for ${data.personal.fullName || 'Candidate'}: ${url}\n🔑 Passcode to unlock private contact details: ${accessPin.trim()}`
      : url;

    await navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const exportImage = async () => {
    setLoading('image');
    try {
      const node = document.getElementById('biodata-preview');
      if (!node) return;
      const blob = await domtoimage.toBlob(node, {
        quality: 1,
        bgcolor: '#fff',
        width: node.offsetWidth * 2,
        height: node.offsetHeight * 2,
      });
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

      const linkPart = publishedSlug ? `\nView interactive digital biodata: ${window.location.origin}/p/${publishedSlug}` : '';
      const pinPart = (publishedSlug && enablePrivacy && accessPin.trim()) ? `\n🔑 Passcode to unlock contact: ${accessPin.trim()}` : '';

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${data.personal.fullName} - Marriage Biodata`,
          text: `Please find matrimonial biodata for ${data.personal.fullName}.${linkPart}${pinPart}`,
        });
      } else {
        const text = `Namaste, please find the marriage biodata of ${data.personal.fullName}.${linkPart}${pinPart}`;
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
    setTimeout(() => {
      setLoading(null);
      markDone('pdf');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* SECTION 1: SHARABLE WEB BIODATA */}
      <div className="p-4 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
            <Globe className="w-4 h-4 text-rose-600" />
            <span>Interactive Web Biodata Link</span>
          </div>
          <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">
            LIVE
          </span>
        </div>
        <p className="text-[11px] text-gray-600 mb-3 leading-snug">
          Create an interactive web profile for WhatsApp family groups with quick-calling, tabs, and personality highlights.
        </p>

        {/* Privacy & Password Lock Box */}
        {!publishedSlug && (
          <div className="mb-3 p-3 bg-white/90 rounded-xl border border-rose-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enablePrivacy}
                  onChange={(e) => {
                    setEnablePrivacy(e.target.checked);
                    if (e.target.checked) setShowPrivacyOptions(true);
                  }}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Password Protect Private Data</span>
                </span>
              </label>

              {enablePrivacy && (
                <button
                  type="button"
                  onClick={() => setShowPrivacyOptions(!showPrivacyOptions)}
                  className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-0.5 font-medium"
                >
                  <span>Customize</span>
                  {showPrivacyOptions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {enablePrivacy && (
              <div className="pt-2 border-t border-gray-100 space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Set Unlock Passcode / PIN:
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={accessPin}
                      onChange={(e) => setAccessPin(e.target.value)}
                      placeholder="e.g. 1234 or word"
                      className="w-full pl-8 pr-3 py-1.5 text-xs font-mono font-bold bg-amber-50/50 border border-amber-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Share this passcode with families you want to allow direct contact.
                  </p>
                </div>

                {showPrivacyOptions && (
                  <div className="pt-1.5 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-700">
                    <span className="block font-bold text-[10px] uppercase tracking-wider text-gray-400">
                      Select which fields to hide until unlocked:
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hidePhone}
                        onChange={(e) => setHidePhone(e.target.checked)}
                        className="rounded text-rose-600 w-3.5 h-3.5"
                      />
                      <span>Phone number & WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideAddress}
                        onChange={(e) => setHideAddress(e.target.checked)}
                        className="rounded text-rose-600 w-3.5 h-3.5"
                      />
                      <span>Detailed street address & Email</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideIncome}
                        onChange={(e) => setHideIncome(e.target.checked)}
                        className="rounded text-rose-600 w-3.5 h-3.5"
                      />
                      <span>Annual Income / Salary</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideAstro}
                        onChange={(e) => setHideAstro(e.target.checked)}
                        className="rounded text-rose-600 w-3.5 h-3.5"
                      />
                      <span>Astrological / Kundali details</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hidePhoto}
                        onChange={(e) => setHidePhoto(e.target.checked)}
                        className="rounded text-rose-600 w-3.5 h-3.5"
                      />
                      <span>Profile Photo</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!publishedSlug ? (
          <button
            onClick={publishWebBiodata}
            disabled={loading === 'publish'}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading === 'publish' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing & Securing...</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>{enablePrivacy ? 'Publish Protected Web Biodata' : 'Publish Web Biodata Link'}</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-rose-200 text-xs text-gray-700 font-mono overflow-hidden">
              <span className="truncate flex-1">/p/{publishedSlug}</span>
              <button
                onClick={copyShareableLink}
                className="bg-rose-50 text-rose-700 hover:bg-rose-100 p-1.5 rounded-lg flex-none cursor-pointer"
                title="Copy full link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {enablePrivacy && accessPin && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-700 flex-none" />
                  <span className="text-gray-700 font-medium">Passcode:</span>
                  <span className="font-mono font-black text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                    {accessPin}
                  </span>
                </div>
                <span className="text-[10px] text-amber-700 font-bold">🔒 Protected</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={copyShareableLink}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied with Passcode!' : 'Copy Link + Passcode'}</span>
              </button>
              <Link
                href={`/p/${publishedSlug}`}
                target="_blank"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
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
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50 text-xs font-medium transition-all cursor-pointer"
          >
            {loading === 'image' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'image' ? <Check className="w-5 h-5" /> : <Image className="w-5 h-5" />}
            Save Image
          </button>

          <button
            onClick={shareWhatsApp}
            disabled={!!loading}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 text-xs font-medium transition-all cursor-pointer"
          >
            {loading === 'whatsapp' ? <Loader2 className="w-5 h-5 animate-spin" /> : done === 'whatsapp' ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            WhatsApp
          </button>

          <button
            onClick={exportPdf}
            disabled={!!loading}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 cursor-pointer ${
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
