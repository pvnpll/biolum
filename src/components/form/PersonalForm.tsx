'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { BLOOD_GROUPS, DEITY_SYMBOLS, HEIGHTS } from '@/lib/constants';
import { calculateAge } from '@/lib/utils';
import { useRef, useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';

const complexions = ['Very Fair', 'Fair', 'Wheatish', 'Medium', 'Olive', 'Dark'];
const diets = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain Vegetarian', 'Vegan'];
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Separated'];

export function PersonalForm() {
  const { data, updateSection, updateData } = useBiodataStore();
  const { personal, astrological, education, family } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioGenerated, setBioGenerated] = useState(false);

  const availableTags = [
    'Family-First', 'Ambitious', 'Creative', 'Traveller', 'Introvert',
    'Extrovert', 'Funny', 'Health-Conscious', 'Spiritual', 'Music Lover',
    'Foodie', 'Adventurous', 'Reader', 'Coffee Lover'
  ];

  const availableInterests = [
    'Reading', 'Music', 'Travel', 'Coffee', 'Fitness',
    'Photography', 'Cooking', 'Art', 'Movies', 'Nature', 'Yoga'
  ];

  const toggleTag = (tag: string) => {
    const current = data.personalityTags || [];
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    updateData({ personalityTags: updated });
  };

  const toggleInterest = (interest: string) => {
    const current = data.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateData({ interests: updated });
  };

  const update = (field: string, value: string | null) => {
    updateSection('personal', { [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('profilePhoto', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      const res = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalDetails: personal,
          educationDetails: education,
          familyDetails: family,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.bio) {
          update('aboutMe', json.bio);
          setBioGenerated(true);
          setTimeout(() => setBioGenerated(false), 3000);
          return;
        }
      }
      // Smart offline fallback if API key is not configured locally
      const name = personal.fullName || 'I';
      const role = education.occupation || 'professional';
      const city = education.workCity || personal.placeOfBirth || 'India';
      const fallbackBio = `I am a warm, ambitious, and grounded individual currently working as ${role} based in ${city}. I value strong family ethics, mutual respect, and continuous personal growth. Looking for an understanding and open-minded partner with whom I can build a happy, harmonious life.`;
      update('aboutMe', fallbackBio);
      setBioGenerated(true);
      setTimeout(() => setBioGenerated(false), 3000);
    } catch (err) {
      const fallbackBio = `I am a grounded and career-focused individual who cherishes traditional family values while embracing a contemporary lifestyle. Seeking an understanding life partner to share a journey of love, trust, and shared aspirations.`;
      update('aboutMe', fallbackBio);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Deity Symbol */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Auspicious Deity / Symbol</label>
        <div className="flex flex-wrap gap-2">
          {DEITY_SYMBOLS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => updateSection('astrological', { deitySymbol: d.id })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${
                astrological.deitySymbol === d.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-base">{d.emoji}</span>
              <span className="text-xs">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (Optional)</label>
        <div className="flex items-center gap-5">
          <div
            className="w-24 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all overflow-hidden relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            {personal.profilePhoto ? (
              <img src={personal.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <div className="text-3xl mb-1">📸</div>
                <div className="text-[11px] text-gray-500 font-medium">Upload Photo</div>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">Recommended Dimensions</p>
            <p>• 3:4 portrait photo (PNG, JPG)</p>
            <p>• Max file size: 5MB</p>
            {personal.profilePhoto && (
              <button
                type="button"
                onClick={() => update('profilePhoto', null)}
                className="text-rose-600 hover:text-rose-700 font-semibold underline pt-1 block"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidate Full Name *</label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
          <input
            type="date"
            value={personal.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          />
          {personal.dateOfBirth && (
            <p className="text-xs text-rose-600 font-medium mt-1">Calculated Age: {calculateAge(personal.dateOfBirth)}</p>
          )}
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time of Birth</label>
          <input
            type="text"
            value={personal.timeOfBirth}
            onChange={(e) => update('timeOfBirth', e.target.value)}
            placeholder="e.g. 08:30 AM"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Place of Birth</label>
          <input
            type="text"
            value={personal.placeOfBirth}
            onChange={(e) => update('placeOfBirth', e.target.value)}
            placeholder="e.g. Pune, Maharashtra"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height</label>
          <select
            value={personal.height}
            onChange={(e) => update('height', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            <option value="">Select height</option>
            {HEIGHTS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weight</label>
          <input
            type="text"
            value={personal.weight}
            onChange={(e) => update('weight', e.target.value)}
            placeholder="e.g. 56 kg"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Complexion */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complexion</label>
          <select
            value={personal.complexion}
            onChange={(e) => update('complexion', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            <option value="">Select complexion</option>
            {complexions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Group</label>
          <select
            value={personal.bloodGroup}
            onChange={(e) => update('bloodGroup', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Diet</label>
          <select
            value={personal.diet}
            onChange={(e) => update('diet', e.target.value as any)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            {diets.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Marital Status */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marital Status</label>
          <div className="flex flex-wrap gap-2">
            {maritalStatuses.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update('maritalStatus', m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  personal.maritalStatus === m
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* About Me & AI Generation Button */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-sm font-semibold text-gray-700">About Me / Candidate Summary</label>
          <button
            type="button"
            onClick={generateAIBio}
            disabled={isGeneratingBio}
            className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            {isGeneratingBio ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Writing with AI...</span>
              </>
            ) : bioGenerated ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Generated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Write with AI ✨</span>
              </>
            )}
          </button>
        </div>
        <textarea
          value={personal.aboutMe}
          onChange={(e) => update('aboutMe', e.target.value)}
          placeholder="A brief introduction highlighting personality, professional background, family culture, and values..."
          rows={3}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors resize-none"
        />
      </div>

      {/* Personality Traits */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Personality Traits <span className="text-xs font-normal text-gray-400">(Featured on your web profile)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = (data.personalityTags || []).includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hobbies & Interests */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Hobbies & Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {availableInterests.map((interest) => {
            const isSelected = (data.interests || []).includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
