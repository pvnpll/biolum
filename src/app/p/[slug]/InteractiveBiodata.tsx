'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Phone, MessageCircle, Share2, Check, Download,
  Heart, Sparkles, Star, MapPin, Briefcase, GraduationCap,
  Users, User, QrCode, X, Copy, ExternalLink,
  BookOpen, Coffee, Music, Camera, Dumbbell, Plane, ChefHat,
  ShieldCheck, Contact, Compass, Flame, Smile, Maximize2,
  Lock, Key, Unlock, AlertCircle, Loader2
} from 'lucide-react';
import QRCode from 'react-qr-code';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileData {
  personal: Record<string, string | null>;
  astrological: Record<string, string>;
  education: Record<string, string>;
  family: Record<string, string>;
  contact: Record<string, string>;
  partnerExpectations: Record<string, string>;
  interests?: string[];
  personalityTags?: string[];
  lifestyleChoices?: Record<string, string>;
  title?: string;
  privacySettings?: {
    isEnabled: boolean;
    hidePhone: boolean;
    hideAddress: boolean;
    hideIncome: boolean;
    hideAstro: boolean;
    hidePhoto: boolean;
  };
}

interface Props {
  profile: {
    slug: string;
    data: ProfileData;
    template_id: string;
    views_count?: number;
  };
  template: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  deity?: { emoji: string; name: string };
  age?: string;
  isProtected?: boolean;
  privacySettings?: {
    isEnabled: boolean;
    hidePhone: boolean;
    hideAddress: boolean;
    hideIncome: boolean;
    hideAstro: boolean;
    hidePhoto: boolean;
  };
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'about', label: 'About', icon: User },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'match', label: 'Partner & Values', icon: Heart },
];

// ─── Personality Tag Pool & Emoji ─────────────────────────────────────────────

const TAG_EMOJI: Record<string, string> = {
  'Family-First': '🏡', Ambitious: '🚀', Creative: '🎨', Traveller: '✈️',
  Introvert: '📚', Extrovert: '🌟', Funny: '😄', 'Health-Conscious': '🥗',
  Spiritual: '🕉️', 'Music Lover': '🎵', Foodie: '🍜', Adventurous: '🏔️',
  Reader: '📖', 'Coffee Lover': '☕', 'Dog Lover': '🐕', 'Cat Lover': '🐈',
};

const DEFAULT_TAGS = ['Family-First', 'Ambitious', 'Creative'];

// ─── Interest Chip Icons ──────────────────────────────────────────────────────

const INTEREST_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Music: Music, Reading: BookOpen, Coffee: Coffee, Photography: Camera,
  Fitness: Dumbbell, Travel: Plane, Cooking: ChefHat, Yoga: Sparkles,
  Art: PaletteIcon, Movies: FilmIcon, Nature: Compass, Coding: Briefcase
};

function PaletteIcon({ className }: { className?: string }) {
  return <span className={className}>🎨</span>;
}

function FilmIcon({ className }: { className?: string }) {
  return <span className={className}>🎬</span>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hex2rgb(hex: string) {
  if (!hex || !hex.startsWith('#')) return '139, 0, 0';
  const r = parseInt(hex.slice(1, 3), 16) || 139;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `${r}, ${g}, ${b}`;
}

function formatDate(str: string) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return str;
  }
}

function downloadVCard(name: string, phone?: string, email?: string, city?: string, url?: string) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name} (Marriage Biodata)`,
    `TITLE:BioLum Verified Candidate`,
    phone && !phone.includes('•') ? `TEL;TYPE=CELL:${phone}` : '',
    email && !email.includes('•') ? `EMAIL:${email}` : '',
    city ? `ADR;TYPE=HOME:;;;${city};;;` : '',
    url ? `URL:${url}` : '',
    `NOTE:Matrimonial profile on BioLum: ${url || ''}`,
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${(name || 'biodata').replace(/\s+/g, '_')}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, isLocked }: { label: string; value?: string | null; isLocked?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-2 border-b border-gray-100 last:border-0 text-sm items-baseline">
      <span className="text-gray-400 w-36 flex-none font-medium">{label}</span>
      <span className={`font-semibold flex-1 ${isLocked ? 'text-amber-800 font-mono tracking-wider' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color }}>
      <span className="w-1.5 h-4 rounded-full inline-block flex-none" style={{ backgroundColor: color }} />
      {children}
    </h3>
  );
}

// ─── Unlock Passcode Modal ────────────────────────────────────────────────────

function UnlockModal({
  onClose,
  onUnlock,
  isUnlocking,
  error,
}: {
  onClose: () => void;
  onUnlock: (pin: string) => void;
  isUnlocking: boolean;
  error?: string;
}) {
  const [pin, setPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      onUnlock(pin.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm flex flex-col gap-4 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-gray-900">Unlock Private Details</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
            This candidate&#39;s direct contact & confidential info is locked by the family. Enter the passcode to reveal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                ref={inputRef}
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter access passcode..."
                className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-amber-50/50 border border-amber-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-none" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUnlocking || !pin.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isUnlocking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Passcode...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Full Profile</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center">
          🔒 Passcode is provided directly by the candidate or their parents.
        </p>
      </div>
    </div>
  );
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────

function QRModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-xs flex flex-col items-center gap-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-black text-gray-900 text-base">Scan to View</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-inner">
          <QRCode value={url} size={180} />
        </div>
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Share this QR code for <strong>{name}</strong>&#39;s matrimonial biodata
        </p>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(url);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              onClose();
            }, 1200);
          }}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Profile Link'}
        </button>
      </div>
    </div>
  );
}

// ─── Express Interest Modal ────────────────────────────────────────────────────

function InterestModal({
  name, phone, whatsapp, isLocked, onOpenUnlock, onClose, accentColor,
}: {
  name: string;
  phone?: string;
  whatsapp?: string;
  isLocked?: boolean;
  onOpenUnlock: () => void;
  onClose: () => void;
  accentColor: string;
}) {
  const wa = whatsapp || phone;
  const msg = encodeURIComponent(`Namaste! 🙏 I came across the matrimonial biodata of ${name} on BioLum and would like to get in touch.`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm flex flex-col gap-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div className="text-3xl">💌</div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-black text-gray-900">Express Your Interest</h2>
          <p className="text-xs text-gray-500 mt-1">Directly connect with {name}&#39;s family</p>
        </div>

        {isLocked ? (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Direct Contact Is Private</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                The family has locked phone numbers & WhatsApp messaging with an access passcode.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenUnlock();
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Enter Passcode to Reveal Contact</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {wa && !wa.includes('•') && (
              <a
                href={`https://wa.me/${wa.replace(/[^0-9]/g, '')}?text=${msg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            )}
            {phone && !phone.includes('•') && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2.5 border-2 text-gray-900 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50 active:scale-95"
                style={{ borderColor: accentColor }}
              >
                <Phone className="w-4 h-4" style={{ color: accentColor }} />
                Call Family ({phone})
              </a>
            )}
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          🔒 Contact info shared with discretion. Please be respectful in your communication.
        </p>
      </div>
    </div>
  );
}

// ─── Photo Lightbox ───────────────────────────────────────────────────────────

function PhotoLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border-2 border-white/20"
        />
        <p className="text-white/80 text-xs mt-3 font-semibold">{alt}</p>
      </div>
    </div>
  );
}

// ─── Typewriter Name ──────────────────────────────────────────────────────────

function TypewriterName({ name, color }: { name: string; color: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(name.slice(0, i));
      if (i >= name.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [name]);

  return (
    <span style={{ color }} className="inline-flex items-center">
      {displayed || name}
      <span
        className={`inline-block w-1.5 h-7 ml-1 bg-amber-300 rounded-sm transition-opacity duration-300 ${
          done ? 'opacity-0' : 'animate-pulse opacity-100'
        }`}
      />
    </span>
  );
}

// ─── Rotating Tagline ─────────────────────────────────────────────────────────

function RotatingTagline({ items }: { items: string[] }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length);
        setFade(true);
      }, 300);
    }, 2800);
    return () => clearInterval(t);
  }, [items]);

  return (
    <span
      className="transition-opacity duration-300 font-semibold text-white/90 text-sm tracking-wide"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {items[idx]}
    </span>
  );
}

// ─── Scroll-Fade Section Wrapper ──────────────────────────────────────────────

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Interactive Component ───────────────────────────────────────────────

export default function InteractiveBiodata({
  profile,
  template,
  deity,
  age,
  isProtected = false,
  privacySettings,
}: Props) {
  const { slug } = profile;

  // Unlocked Data State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(profile.data);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const {
    personal = {},
    astrological = {},
    education = {},
    family = {},
    contact = {},
    partnerExpectations = {},
  } = profileData;

  const bg = template.primaryColor || '#8B0000';
  const accent = template.accentColor || '#D4AF37';

  const tags: string[] = profileData.personalityTags?.length ? profileData.personalityTags : DEFAULT_TAGS;
  const interests: string[] = profileData.interests?.length ? profileData.interests : ['Reading', 'Music', 'Travel', 'Coffee', 'Fitness'];

  const [activeTab, setActiveTab] = useState('about');
  const [showQR, setShowQR] = useState(false);
  const [showInterest, setShowInterest] = useState(false);
  const [showPhotoLightbox, setShowPhotoLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://biolum.pvnpll.in/p/${slug}`;

  // Check cached unlock session
  useEffect(() => {
    if (isProtected) {
      try {
        const cachedPin = sessionStorage.getItem(`biolum_unlocked_${slug}`);
        if (cachedPin) {
          handleUnlock(cachedPin);
        }
      } catch {}
    }
  }, [slug, isProtected]);

  const handleUnlock = async (pinToTry: string) => {
    setIsUnlocking(true);
    setUnlockError('');
    try {
      const res = await fetch('/api/unlock-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, pin: pinToTry }),
      });
      const json = await res.json();
      if (!res.ok) {
        setUnlockError(json.error || 'Incorrect passcode');
        return;
      }
      if (json.unlockedData) {
        setProfileData(json.unlockedData);
        setIsUnlocked(true);
        setShowUnlockModal(false);
        try {
          sessionStorage.setItem(`biolum_unlocked_${slug}`, pinToTry);
        } catch {}
      }
    } catch {
      setUnlockError('Network error. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const taglineItems = [
    education.occupation ? `💼 ${education.occupation}` : null,
    contact.city ? `📍 Based in ${contact.city}` : null,
    astrological.rashi ? `♈ ${astrological.rashi}` : null,
    education.highestEducation ? `🎓 ${education.highestEducation}` : null,
  ].filter(Boolean) as string[];

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : profileUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personal.fullName || 'Candidate'} — Marriage Biodata`,
          text: `Please view the verified matrimonial biodata profile of ${personal.fullName}:`,
          url,
        });
        return;
      } catch {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveContact = () => {
    if (isProtected && !isUnlocked && privacySettings?.hidePhone) {
      setShowUnlockModal(true);
      return;
    }
    downloadVCard(
      (personal.fullName as string) || 'Candidate',
      contact.phone,
      contact.email,
      contact.city,
      profileUrl
    );
  };

  const hasAstrological = astrological && (
    astrological.religion || astrological.caste || astrological.rashi ||
    astrological.nakshatra || astrological.gotra || astrological.manglik ||
    astrological.subCaste || astrological.gan || astrological.nadi
  );

  const isContactLocked = isProtected && !isUnlocked && (privacySettings?.hidePhone || privacySettings?.hideAddress);

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        fontFamily: template.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
        background: `linear-gradient(160deg, rgba(${hex2rgb(bg)},0.06) 0%, #fafafa 50%, rgba(${hex2rgb(accent)},0.06) 100%)`,
      }}
    >
      {/* ── Top Nav Bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 flex-none">
            <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
              BioLum
            </span>
            <span className="hidden sm:inline-flex text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Profile
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Privacy Lock indicator badge */}
            {isProtected && (
              isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Unlock className="w-3 h-3" />
                  <span className="hidden sm:inline">Unlocked</span>
                </span>
              ) : (
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition cursor-pointer"
                  title="Unlock Private Details"
                >
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Unlock</span>
                </button>
              )
            )}

            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-600 cursor-pointer"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveContact}
              className="hidden sm:inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              title="Save Candidate to Phone Contacts"
            >
              <Contact className="w-3.5 h-3.5 text-gray-500" />
              <span>Save Contact</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-5">

        {/* ── Privacy Alert Banner (if locked) ── */}
        {isProtected && !isUnlocked && (
          <FadeInSection>
            <div className="p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-none">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Private Details Protected</p>
                  <p className="text-[11px] text-gray-600">Contact & confidential info locked by candidate&#39;s family.</p>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer flex-none"
              >
                <Key className="w-3 h-3" />
                <span>Enter Code</span>
              </button>
            </div>
          </FadeInSection>
        )}

        {/* ── Hero Card ── */}
        <FadeInSection>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white">
            {/* Gradient Header */}
            <div
              className="relative text-white p-7 sm:p-10 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
              }}
            >
              {/* Background decorative circles */}
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-15 bg-white blur-xs" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15 bg-white blur-xs" />

              <div className="relative z-10 text-center">
                <div className="text-5xl mb-2 drop-shadow-md select-none">{deity?.emoji || '🕉️'}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/80 font-bold mb-1">
                  {profileData.title || 'Official Matrimonial Biodata'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm min-h-[44px]">
                  <TypewriterName name={(personal.fullName as string) || 'Candidate'} color="white" />
                </h1>

                {taglineItems.length > 0 && (
                  <div className="mt-2 text-sm flex items-center justify-center gap-2 min-h-[24px]">
                    <RotatingTagline items={taglineItems} />
                  </div>
                )}

                {age && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{age}</span>
                    {personal.height && <span>• {personal.height}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Photo + Quick Bio Row */}
            <div className="p-5 sm:p-7 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {personal.profilePhoto ? (
                <div
                  className="relative flex-none group cursor-zoom-in"
                  onClick={() => setShowPhotoLightbox(true)}
                >
                  <img
                    src={personal.profilePhoto as string}
                    alt={(personal.fullName as string) || 'Candidate'}
                    className="w-32 h-44 sm:w-36 sm:h-48 object-cover rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-102"
                    style={{ border: `3px solid ${accent}` }}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white drop-shadow" />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-38 rounded-2xl flex flex-col items-center justify-center text-gray-300 bg-gray-50 border-2 border-dashed border-gray-200 flex-none">
                  <User className="w-10 h-10 mb-1 opacity-60" />
                  <span className="text-[11px] font-medium text-gray-400">
                    {isProtected && !isUnlocked && privacySettings?.hidePhoto ? '🔒 Photo Locked' : 'Photo Private'}
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-4 text-center sm:text-left">
                {/* About Me Quote */}
                <div
                  className="relative p-4 rounded-2xl text-sm text-gray-700 leading-relaxed italic"
                  style={{ background: `rgba(${hex2rgb(bg)},0.04)`, borderLeft: `3px solid ${accent}` }}
                >
                  <span className="text-3xl leading-none opacity-20 font-serif absolute top-2 left-3">"</span>
                  <p className="pl-4">
                    {personal.aboutMe || 'Looking for an understanding and open-minded partner with mutual respect and shared family values.'}
                  </p>
                </div>

                {/* Personality Tags */}
                {tags.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                      Personality & Traits
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-3 py-1 rounded-full border shadow-2xs"
                          style={{
                            color: bg,
                            borderColor: `rgba(${hex2rgb(bg)},0.25)`,
                            background: `rgba(${hex2rgb(bg)},0.05)`,
                          }}
                        >
                          {TAG_EMOJI[tag] || '✨'} {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    {interests.map(interest => {
                      const Icon = INTEREST_ICONS[interest];
                      return (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {Icon ? <Icon className="w-3 h-3 text-gray-500" /> : '🎯'} {interest}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Interactive Reactions */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2 text-center sm:text-left">
                    Send a Quick Reaction
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {[
                      { id: 'auspicious', label: '🌸 Auspicious Alliance' },
                      { id: 'impressive', label: '⭐ Impressive Profile' },
                      { id: 'match', label: '💖 Great Match' },
                    ].map(reaction => {
                      const isSelected = selectedReaction === reaction.id;
                      return (
                        <button
                          key={reaction.id}
                          onClick={() => setSelectedReaction(isSelected ? null : reaction.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}{reaction.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ── Tabs Navigation ── */}
        <FadeInSection delay={50}>
          <div className="flex gap-1.5 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${bg}, ${accent})` } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </FadeInSection>

        {/* ── Tab Panels ── */}

        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <FadeInSection delay={80}>
            <div className="space-y-4">
              <SectionCard>
                <SectionTitle color={bg}>Personal & Physical Details</SectionTitle>
                <InfoRow label="Date of Birth" value={formatDate((personal.dateOfBirth as string) || '')} />
                {personal.timeOfBirth && <InfoRow label="Time of Birth" value={personal.timeOfBirth as string} />}
                {personal.placeOfBirth && <InfoRow label="Place of Birth" value={personal.placeOfBirth as string} />}
                {personal.height && <InfoRow label="Height" value={personal.height as string} />}
                {personal.weight && <InfoRow label="Weight" value={personal.weight as string} />}
                {personal.complexion && <InfoRow label="Complexion" value={personal.complexion as string} />}
                {personal.bloodGroup && <InfoRow label="Blood Group" value={personal.bloodGroup as string} />}
                {personal.diet && <InfoRow label="Diet" value={personal.diet as string} />}
                {personal.maritalStatus && <InfoRow label="Marital Status" value={personal.maritalStatus as string} />}
              </SectionCard>

              {hasAstrological && (
                <SectionCard>
                  <div className="flex items-center justify-between mb-2">
                    <SectionTitle color={bg}>Astrological & Horoscope Background</SectionTitle>
                    {isProtected && !isUnlocked && privacySettings?.hideAstro && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        🔒 Protected
                      </span>
                    )}
                  </div>
                  {astrological.religion && <InfoRow label="Religion" value={astrological.religion} />}
                  {astrological.caste && <InfoRow label="Caste" value={astrological.caste} />}
                  {astrological.subCaste && <InfoRow label="Sub-Caste" value={astrological.subCaste} />}
                  {astrological.gotra && <InfoRow label="Gotra" value={astrological.gotra} />}
                  {astrological.rashi && <InfoRow label="Rashi (Moon Sign)" value={astrological.rashi} />}
                  {astrological.nakshatra && <InfoRow label="Nakshatra" value={astrological.nakshatra} />}
                  {astrological.manglik && <InfoRow label="Manglik Status" value={astrological.manglik} />}
                  {astrological.gan && <InfoRow label="Gan" value={astrological.gan} />}
                  {astrological.nadi && <InfoRow label="Nadi" value={astrological.nadi} />}
                </SectionCard>
              )}
            </div>
          </FadeInSection>
        )}

        {/* Tab 2: Career */}
        {activeTab === 'career' && (
          <FadeInSection delay={80}>
            <div className="space-y-4">
              <SectionCard>
                <SectionTitle color={bg}>Education & Profession</SectionTitle>
                {education.highestEducation && <InfoRow label="Highest Degree" value={education.highestEducation} />}
                {education.educationDetails && <InfoRow label="Field / Specialization" value={education.educationDetails} />}
                {education.college && <InfoRow label="College / University" value={education.college} />}
                {education.occupation && <InfoRow label="Current Occupation" value={education.occupation} />}
                {education.employer && <InfoRow label="Organization / Employer" value={education.employer} />}
                {education.annualIncome && (
                  <InfoRow
                    label="Annual Income"
                    value={education.annualIncome}
                    isLocked={education.annualIncome.includes('Protected')}
                  />
                )}
                {education.workCity && (
                  <InfoRow
                    label="Work Location"
                    value={`${education.workCity}${education.workCountry && education.workCountry !== 'India' ? ', ' + education.workCountry : ''}`}
                  />
                )}

                {/* Career highlight badge */}
                {education.occupation && (
                  <div
                    className="mt-5 flex items-center gap-3.5 p-4 rounded-2xl border"
                    style={{
                      background: `rgba(${hex2rgb(bg)},0.04)`,
                      borderColor: `rgba(${hex2rgb(bg)},0.15)`
                    }}
                  >
                    <div className="p-3 rounded-xl shadow-xs" style={{ background: bg }}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Currently Working As</p>
                      <p className="text-base font-black text-gray-900">{education.occupation}</p>
                      {education.employer && <p className="text-xs text-gray-600 font-medium">at {education.employer}</p>}
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>
          </FadeInSection>
        )}

        {/* Tab 3: Family & Contact */}
        {activeTab === 'family' && (
          <FadeInSection delay={80}>
            <div className="space-y-4">
              <SectionCard>
                <SectionTitle color={bg}>Family Background</SectionTitle>
                {family.fatherName && (
                  <InfoRow label="Father" value={`${family.fatherName}${family.fatherOccupation ? ` (${family.fatherOccupation})` : ''}`} />
                )}
                {family.motherName && (
                  <InfoRow label="Mother" value={`${family.motherName}${family.motherOccupation ? ` (${family.motherOccupation})` : ''}`} />
                )}
                {(family.brothers !== '0' || family.sisters !== '0') && (
                  <InfoRow
                    label="Siblings"
                    value={`${family.brothers || 0} Brother(s), ${family.sisters || 0} Sister(s)`}
                  />
                )}
                {family.nativePlace && <InfoRow label="Native Place" value={family.nativePlace} />}
                {family.familyType && <InfoRow label="Family Type" value={`${family.familyType} Family`} />}
                {family.familyValues && <InfoRow label="Family Values" value={family.familyValues} />}
                {family.familyStatus && <InfoRow label="Family Status" value={family.familyStatus} />}
              </SectionCard>

              {/* Residence & Contact Details Card */}
              {(contact.city || contact.phone) && (
                <SectionCard>
                  <div className="flex items-center justify-between mb-1">
                    <SectionTitle color={bg}>Residence & Contact Details</SectionTitle>
                    {isContactLocked && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Protected
                      </span>
                    )}
                  </div>

                  {contact.contactPerson && <InfoRow label="Contact Person" value={contact.contactPerson} />}
                  {contact.phone && (
                    <InfoRow
                      label="Primary Phone"
                      value={contact.phone}
                      isLocked={contact.phone.includes('•')}
                    />
                  )}
                  {contact.whatsapp && (
                    <InfoRow
                      label="WhatsApp"
                      value={contact.whatsapp}
                      isLocked={contact.whatsapp.includes('•')}
                    />
                  )}
                  {contact.email && (
                    <InfoRow
                      label="Email"
                      value={contact.email}
                      isLocked={contact.email.includes('•')}
                    />
                  )}
                  {contact.address && (
                    <InfoRow
                      label="Address"
                      value={contact.address}
                      isLocked={contact.address.includes('•')}
                    />
                  )}
                  {contact.city && <InfoRow label="City & State" value={`${contact.city}, ${contact.state || 'India'}`} />}

                  {/* Lock Box / Unlocked Banner */}
                  {isContactLocked ? (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-none shadow-xs">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Direct Contact & Address Locked</p>
                          <p className="text-[11px] text-gray-600">Enter family passcode to reveal phone numbers and address.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowUnlockModal(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer flex-none"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Unlock with Passcode</span>
                      </button>
                    </div>
                  ) : isProtected && isUnlocked ? (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-none" />
                      <span>Contact Details Unlocked with Family Passcode</span>
                    </div>
                  ) : null}

                  {contact.city && (
                    <div className="mt-4 flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4 text-rose-600 flex-none" />
                        <span>Based in <strong className="text-gray-900">{contact.city}</strong></span>
                      </div>
                      <button
                        onClick={handleSaveContact}
                        className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Contact className="w-3.5 h-3.5" /> Save Contact
                      </button>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          </FadeInSection>
        )}

        {/* Tab 4: Partner & Values */}
        {activeTab === 'match' && (
          <FadeInSection delay={80}>
            <div className="space-y-4">
              <SectionCard>
                <SectionTitle color={bg}>Partner Expectations</SectionTitle>
                {(partnerExpectations.ageFrom || partnerExpectations.ageTo) && (
                  <InfoRow label="Preferred Age" value={`${partnerExpectations.ageFrom || 24}–${partnerExpectations.ageTo || 35} years`} />
                )}
                {partnerExpectations.education && <InfoRow label="Preferred Education" value={partnerExpectations.education} />}
                {partnerExpectations.occupation && <InfoRow label="Preferred Career" value={partnerExpectations.occupation} />}

                {partnerExpectations.preferences && (
                  <div
                    className="mt-4 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed italic relative"
                    style={{ background: `rgba(${hex2rgb(accent)},0.08)`, borderLeft: `3px solid ${accent}` }}
                  >
                    <span className="text-3xl leading-none opacity-20 font-serif absolute top-2 left-3">"</span>
                    <p className="pl-5">{partnerExpectations.preferences}</p>
                  </div>
                )}
              </SectionCard>

              {/* Lifestyle & Values Icebreaker Card */}
              <SectionCard>
                <SectionTitle color={bg}>Lifestyle & Everyday Vibe</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    { label: 'Morning Vibe', val: 'Filter Coffee ☕' },
                    { label: 'Getaway Preference', val: 'Mountains 🏔️' },
                    { label: 'Ideal Weekend', val: 'Good Books & Cafes 📚' },
                    { label: 'Daily Rhythm', val: 'Early Riser 🌅' },
                    { label: 'Food Culture', val: 'Home-Cooked Food 🥘' },
                    { label: 'Life Philosophy', val: 'Mutual Respect 🤝' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-gray-800">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Reach Out Card */}
              <div
                className="rounded-3xl p-6 sm:p-7 text-white text-center shadow-lg relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)` }}
              >
                <div className="text-3xl mb-2">💌</div>
                <h3 className="font-black text-xl mb-1">Interested in {personal.fullName?.split(' ')[0] || 'this Candidate'}?</h3>
                <p className="text-xs text-white/80 max-w-sm mx-auto mb-5 leading-relaxed">
                  Start a polite conversation directly with the candidate&#39;s family via WhatsApp or phone call.
                </p>
                <button
                  onClick={() => setShowInterest(true)}
                  className="bg-white font-black text-sm px-8 py-3.5 rounded-2xl transition-all hover:bg-gray-100 active:scale-95 shadow-md cursor-pointer"
                  style={{ color: bg }}
                >
                  Send a Message / Call Family
                </button>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* ── Footer CTA ── */}
        <FadeInSection delay={120}>
          <div className="text-center py-6 border-t border-gray-200/80">
            <p className="text-xs text-gray-400 mb-2">Create your own interactive marriage biodata for free</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 font-black text-sm text-rose-600 hover:text-rose-700 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Create Free Biodata on BioLum →
            </Link>
          </div>
        </FadeInSection>
      </main>

      {/* ── Floating Express Interest FAB ── */}
      <div className="fixed bottom-6 right-5 z-40">
        <button
          onClick={() => setShowInterest(true)}
          className="flex items-center gap-2 text-white px-5 py-3.5 rounded-2xl font-black text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${bg}, ${accent})`,
            boxShadow: `0 8px 30px rgba(${hex2rgb(bg)},0.4)`,
          }}
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>Interested?</span>
        </button>
      </div>

      {/* ── Modals ── */}
      {showUnlockModal && (
        <UnlockModal
          onClose={() => setShowUnlockModal(false)}
          onUnlock={handleUnlock}
          isUnlocking={isUnlocking}
          error={unlockError}
        />
      )}

      {showQR && (
        <QRModal
          url={profileUrl}
          name={(personal.fullName as string) || 'Candidate'}
          onClose={() => setShowQR(false)}
        />
      )}

      {showInterest && (
        <InterestModal
          name={(personal.fullName as string) || 'Candidate'}
          phone={contact.phone}
          whatsapp={contact.whatsapp || contact.phone}
          isLocked={isContactLocked}
          onOpenUnlock={() => setShowUnlockModal(true)}
          onClose={() => setShowInterest(false)}
          accentColor={accent}
        />
      )}

      {showPhotoLightbox && personal.profilePhoto && (
        <PhotoLightbox
          src={personal.profilePhoto as string}
          alt={(personal.fullName as string) || 'Candidate Profile'}
          onClose={() => setShowPhotoLightbox(false)}
        />
      )}
    </div>
  );
}
