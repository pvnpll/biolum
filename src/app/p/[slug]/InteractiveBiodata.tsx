'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Phone, MessageCircle, Share2, Check, Download,
  Heart, Sparkles, Star, MapPin, Briefcase, GraduationCap,
  Users, User, ChevronDown, QrCode, X, Copy, ExternalLink,
  BookOpen, Coffee, Music, Camera, Dumbbell, Plane, ChefHat,
  ShieldCheck,
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
  title?: string;
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
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'about',  label: 'About',   icon: User },
  { id: 'career', label: 'Career',  icon: Briefcase },
  { id: 'family', label: 'Family',  icon: Users },
  { id: 'match',  label: 'Match',   icon: Heart },
];

// ─── Personality Tag Pool (fallback suggestions) ──────────────────────────────

const TAG_EMOJI: Record<string, string> = {
  'Family-First': '🏡', Ambitious: '🚀', Creative: '🎨', Traveller: '✈️',
  Introvert: '📚', Funny: '😄', 'Health-Conscious': '🥗', Spiritual: '🕉️',
  'Music Lover': '🎵', Foodie: '🍜', Adventurous: '🏔️', Reader: '📖',
};

const DEFAULT_TAGS = ['Family-First', 'Ambitious', 'Creative'];

// ─── Interest Chip Icons ──────────────────────────────────────────────────────

const INTEREST_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Music: Music, Reading: BookOpen, Coffee: Coffee, Photography: Camera,
  Fitness: Dumbbell, Travel: Plane, Cooking: ChefHat,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hex2rgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
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

// ─── Sub-Components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-2 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-400 w-36 flex-none font-medium">{label}</span>
      <span className="text-gray-900 font-semibold flex-1">{value}</span>
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
      <span className="w-1 h-4 rounded-full inline-block flex-none" style={{ backgroundColor: color }} />
      {children}
    </h3>
  );
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────

function QRModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-7 w-full max-w-xs flex flex-col items-center gap-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-black text-gray-900 text-base">Scan to View</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-3 rounded-2xl border-2 border-gray-100">
          <QRCode value={url} size={180} />
        </div>
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Share this QR code for <strong>{name}</strong>&#39;s matrimonial biodata
        </p>
        <button
          onClick={() => { navigator.clipboard?.writeText(url); onClose(); }}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
        >
          <Copy className="w-4 h-4" /> Copy Profile Link
        </button>
      </div>
    </div>
  );
}

// ─── Express Interest Modal ────────────────────────────────────────────────────

function InterestModal({
  name, phone, whatsapp, onClose, accentColor,
}: {
  name: string; phone?: string; whatsapp?: string; onClose: () => void; accentColor: string;
}) {
  const msg = encodeURIComponent(`Namaste! 🙏 I came across the matrimonial biodata of ${name} on BioLum and would like to get in touch.`);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-7 w-full max-w-sm flex flex-col gap-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="self-end p-1.5 rounded-full hover:bg-gray-100 transition">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center -mt-4">
          <div className="text-5xl mb-3">💌</div>
          <h2 className="text-xl font-black text-gray-900">Express Your Interest</h2>
          <p className="text-sm text-gray-500 mt-1">Reach out to {name}&#39;s family</p>
        </div>

        <div className="flex flex-col gap-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Send WhatsApp Message
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-3 border-2 text-gray-900 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50 active:scale-95"
              style={{ borderColor: accentColor }}
            >
              <Phone className="w-5 h-5" style={{ color: accentColor }} />
              Call Family
            </a>
          )}
        </div>

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          🔒 Contact info shared securely. Please be respectful in your communication.
        </p>
      </div>
    </div>
  );
}

// ─── Typewriter Name ──────────────────────────────────────────────────────────

function TypewriterName({ name, color }: { name: string; color: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(name.slice(0, i));
      if (i >= name.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [name, done]);

  return (
    <span style={{ color }}>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
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
    }, 2500);
    return () => clearInterval(t);
  }, [items]);

  return (
    <span
      className="transition-opacity duration-300 font-semibold text-gray-600 text-sm"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {items[idx]}
    </span>
  );
}

// ─── Scroll-Fade Section Wrapper ──────────────────────────────────────────────

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Interactive Component ───────────────────────────────────────────────

export default function InteractiveBiodata({ profile, template, deity, age }: Props) {
  const { data, slug } = profile;
  const { personal = {}, astrological = {}, education = {}, family = {}, contact = {}, partnerExpectations = {} } = data;

  const bg = template.primaryColor;
  const accent = template.accentColor;
  const tags: string[] = data.personalityTags?.length ? data.personalityTags : DEFAULT_TAGS;
  const interests: string[] = data.interests || [];

  const [activeTab, setActiveTab] = useState('about');
  const [showQR, setShowQR] = useState(false);
  const [showInterest, setShowInterest] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://biolum.pvnpll.in/p/${slug}`;

  const taglineItems = [
    education.occupation,
    astrological.rashi ? `${astrological.rashi} ♈` : null,
    contact.city ? `📍 ${contact.city}` : null,
    education.highestEducation,
  ].filter(Boolean) as string[];

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : profileUrl;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${personal.fullName} — Marriage Biodata`, url });
        return;
      } catch { /* cancelled */ }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: template.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
        background: `linear-gradient(160deg, rgba(${hex2rgb(bg)},0.07) 0%, #f9fafb 50%, rgba(${hex2rgb(accent)},0.05) 100%)`,
      }}
    >
      {/* ── Top Nav Bar ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 flex-none">
            <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
              BioLum
            </span>
            <span className="hidden sm:flex text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-600"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1 border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
            >
              <Download className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-5">

        {/* ── Hero Card ── */}
        <FadeInSection>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-white/50">
            {/* Gradient Header */}
            <div
              className="relative text-white p-7 sm:p-10 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
              }}
            >
              {/* Background decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 bg-white" />

              <div className="relative z-10 text-center">
                <div className="text-5xl mb-3 drop-shadow">{deity?.emoji || '🕉️'}</div>
                <div className="text-[11px] uppercase tracking-widest opacity-80 font-bold mb-2">
                  {data.title || 'Marriage Biodata'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                  <TypewriterName name={personal.fullName as string || 'Candidate'} color="white" />
                </h1>

                {taglineItems.length > 0 && (
                  <div className="mt-3 text-white/80 text-sm flex items-center justify-center gap-2 min-h-[22px]">
                    <RotatingTagline items={taglineItems} />
                  </div>
                )}

                {age && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles className="w-3 h-3" /> {age}
                    {personal.height && ` • ${personal.height}`}
                  </div>
                )}
              </div>
            </div>

            {/* Photo + About Row */}
            <div className="bg-white p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {personal.profilePhoto ? (
                <div className="relative flex-none group cursor-zoom-in">
                  <img
                    src={personal.profilePhoto as string}
                    alt={personal.fullName as string}
                    className="w-32 h-44 sm:w-36 sm:h-48 object-cover rounded-2xl shadow-md transition-transform group-hover:scale-105"
                    style={{ border: `3px solid ${accent}` }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ background: `rgba(${hex2rgb(bg)},0.3)` }}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div
                  className="w-28 h-40 rounded-2xl flex flex-col items-center justify-center text-gray-300 bg-gray-50 border-2 border-dashed border-gray-200 flex-none"
                >
                  <User className="w-10 h-10 mb-1" />
                  <span className="text-[11px]">No Photo</span>
                </div>
              )}

              <div className="flex-1 space-y-4 text-center sm:text-left">
                {/* About Me Quote */}
                <div
                  className="relative p-4 rounded-2xl text-sm text-gray-700 leading-relaxed italic"
                  style={{ background: `rgba(${hex2rgb(bg)},0.05)`, borderLeft: `3px solid ${accent}` }}
                >
                  <span className="text-3xl leading-none opacity-20 font-serif absolute top-2 left-3">"</span>
                  <p className="pl-4">{personal.aboutMe || 'Looking for a compassionate and understanding life partner.'}</p>
                </div>

                {/* Personality Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-bold px-3 py-1 rounded-full border"
                        style={{ color: bg, borderColor: `rgba(${hex2rgb(bg)},0.3)`, background: `rgba(${hex2rgb(bg)},0.07)` }}
                      >
                        {TAG_EMOJI[tag] || '✨'} {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interest Chips */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {interests.map(interest => {
                      const Icon = INTEREST_ICONS[interest];
                      return (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
                        >
                          {Icon ? <Icon className="w-3.5 h-3.5" /> : '🎯'} {interest}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Like + Heart CTA */}
                <div className="flex items-center gap-3 justify-center sm:justify-start pt-1">
                  <button
                    onClick={() => setLiked(l => !l)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 ${liked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500'}`}
                  >
                    <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                    {liked ? 'Liked ✓' : 'Like Profile'}
                  </button>
                  <button
                    onClick={() => setShowInterest(true)}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white transition-all active:scale-95 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${bg}, ${accent})` }}
                  >
                    <Star className="w-4 h-4" /> Express Interest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ── Tabs Navigation ── */}
        <FadeInSection delay={80}>
          <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${active ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  style={active ? { background: `linear-gradient(135deg, ${bg}, ${accent})` } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
        </FadeInSection>

        {/* ── Tab Panels ── */}

        {activeTab === 'about' && (
          <FadeInSection delay={100}>
            <div className="space-y-4">
              <SectionCard>
                <SectionTitle color={bg}>Personal Details</SectionTitle>
                <InfoRow label="Date of Birth" value={formatDate(personal.dateOfBirth as string)} />
                {personal.timeOfBirth && <InfoRow label="Time of Birth" value={personal.timeOfBirth as string} />}
                {personal.placeOfBirth && <InfoRow label="Place of Birth" value={personal.placeOfBirth as string} />}
                {personal.height && <InfoRow label="Height" value={personal.height as string} />}
                {personal.weight && <InfoRow label="Weight" value={personal.weight as string} />}
                {personal.complexion && <InfoRow label="Complexion" value={personal.complexion as string} />}
                {personal.bloodGroup && <InfoRow label="Blood Group" value={personal.bloodGroup as string} />}
                {personal.diet && <InfoRow label="Diet" value={personal.diet as string} />}
                {personal.maritalStatus && <InfoRow label="Marital Status" value={personal.maritalStatus as string} />}
              </SectionCard>

              {(astrological.rashi || astrological.caste) && (
                <SectionCard>
                  <SectionTitle color={bg}>Astrological & Religious</SectionTitle>
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

        {activeTab === 'career' && (
          <FadeInSection delay={100}>
            <SectionCard>
              <SectionTitle color={bg}>Education & Profession</SectionTitle>
              {education.highestEducation && <InfoRow label="Highest Degree" value={education.highestEducation} />}
              {education.educationDetails && <InfoRow label="Specialization" value={education.educationDetails} />}
              {education.college && <InfoRow label="University" value={education.college} />}
              {education.occupation && <InfoRow label="Occupation" value={education.occupation} />}
              {education.employer && <InfoRow label="Employer" value={education.employer} />}
              {education.annualIncome && <InfoRow label="Annual Income" value={education.annualIncome} />}
              {education.workCity && (
                <InfoRow
                  label="Work Location"
                  value={`${education.workCity}${education.workCountry && education.workCountry !== 'India' ? ', ' + education.workCountry : ''}`}
                />
              )}

              {/* Career visual accent */}
              {education.occupation && (
                <div
                  className="mt-5 flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: `rgba(${hex2rgb(bg)},0.06)` }}
                >
                  <div className="p-2.5 rounded-xl" style={{ background: bg }}>
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Currently working as</p>
                    <p className="text-sm font-black text-gray-900">{education.occupation}</p>
                    {education.employer && <p className="text-xs text-gray-500">at {education.employer}</p>}
                  </div>
                </div>
              )}
            </SectionCard>
          </FadeInSection>
        )}

        {activeTab === 'family' && (
          <FadeInSection delay={100}>
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

              {(contact.city || contact.phone) && (
                <SectionCard>
                  <SectionTitle color={bg}>Contact & Location</SectionTitle>
                  {contact.contactPerson && <InfoRow label="Contact Person" value={contact.contactPerson} />}
                  {contact.phone && <InfoRow label="Phone" value={contact.phone} />}
                  {contact.city && <InfoRow label="City & State" value={`${contact.city}, ${contact.state || 'India'}`} />}
                  {contact.address && <InfoRow label="Address" value={contact.address} />}

                  {contact.city && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4 flex-none" style={{ color: accent }} />
                      <span>Based in <strong className="text-gray-900">{contact.city}</strong></span>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          </FadeInSection>
        )}

        {activeTab === 'match' && (
          <FadeInSection delay={100}>
            <div className="space-y-4">
              {partnerExpectations.preferences ? (
                <SectionCard>
                  <SectionTitle color={bg}>Looking For</SectionTitle>
                  {(partnerExpectations.ageFrom || partnerExpectations.ageTo) && (
                    <InfoRow label="Preferred Age" value={`${partnerExpectations.ageFrom || 21}–${partnerExpectations.ageTo || 35} years`} />
                  )}
                  {partnerExpectations.education && <InfoRow label="Education" value={partnerExpectations.education} />}
                  {partnerExpectations.occupation && <InfoRow label="Career" value={partnerExpectations.occupation} />}

                  <div
                    className="mt-4 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed italic relative"
                    style={{ background: `rgba(${hex2rgb(accent)},0.07)` }}
                  >
                    <span className="text-3xl leading-none opacity-20 font-serif absolute top-2 left-3">"</span>
                    <p className="pl-5">{partnerExpectations.preferences}</p>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard>
                  <div className="text-center py-8 text-gray-400">
                    <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Partner expectations not specified</p>
                  </div>
                </SectionCard>
              )}

              {/* Express Interest Card */}
              <div
                className="rounded-2xl p-6 text-white text-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)` }}
              >
                <div className="text-3xl mb-2">💌</div>
                <h3 className="font-black text-lg mb-1">Interested in {personal.fullName?.split(' ')[0]}?</h3>
                <p className="text-sm opacity-80 mb-5">Reach out directly to their family</p>
                <button
                  onClick={() => setShowInterest(true)}
                  className="bg-white font-black text-sm px-8 py-3 rounded-xl transition-all hover:bg-gray-100 active:scale-95 shadow-md"
                  style={{ color: bg }}
                >
                  Send a Message
                </button>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* ── Create Your Own CTA ── */}
        <FadeInSection delay={200}>
          <div className="text-center py-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-2">Create a beautiful biodata like this for free</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 font-black text-sm text-rose-600 hover:text-rose-700 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Create Free Biodata with BioLum →
            </Link>
          </div>
        </FadeInSection>
      </main>

      {/* ── Floating Express Interest FAB ── */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setShowInterest(true)}
          className="flex items-center gap-2 text-white px-5 py-3.5 rounded-2xl font-black text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${bg}, ${accent})`,
            boxShadow: `0 8px 32px rgba(${hex2rgb(bg)},0.45)`,
          }}
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>Interested?</span>
        </button>
      </div>

      {/* ── Modals ── */}
      {showQR && (
        <QRModal
          url={profileUrl}
          name={personal.fullName as string || 'Candidate'}
          onClose={() => setShowQR(false)}
        />
      )}

      {showInterest && (
        <InterestModal
          name={personal.fullName as string || 'Candidate'}
          phone={contact.phone}
          whatsapp={contact.whatsapp}
          onClose={() => setShowInterest(false)}
          accentColor={accent}
        />
      )}
    </div>
  );
}
