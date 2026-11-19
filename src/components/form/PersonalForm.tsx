'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { BLOOD_GROUPS, DEITY_SYMBOLS, HEIGHTS } from '@/lib/constants';
import { calculateAge } from '@/lib/utils';
import { useRef, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const complexions = ['Very Fair', 'Fair', 'Wheatish', 'Medium', 'Olive', 'Dark'];
const diets = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain Vegetarian', 'Vegan'];
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Separated'];

export function PersonalForm() {
  const { data, updateSection } = useBiodataStore();
  const { personal, astrological } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
      {/* Deity Symbol */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Deity / Symbol (Optional)</label>
        <div className="flex flex-wrap gap-2">
          {DEITY_SYMBOLS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => updateSection('astrological', { deitySymbol: d.id })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
                astrological.deitySymbol === d.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span>{d.emoji}</span>
              <span className="hidden sm:block">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
        <div className="flex items-start gap-4">
          <div
            className="w-24 h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-rose-300 transition-colors overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {personal.profilePhoto ? (
              <img src={personal.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-3xl mb-1">📸</div>
                <div className="text-xs text-gray-400">Click to upload</div>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 space-y-1 pt-2">
            <p>• Portrait orientation (3:4) works best</p>
            <p>• JPG or PNG, max 5MB</p>
            {personal.profilePhoto && (
              <button
                type="button"
                onClick={() => update('profilePhoto', null)}
                className="text-rose-500 hover:text-rose-700 font-medium mt-2"
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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
          <input
            type="date"
            value={personal.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
          {personal.dateOfBirth && (
            <p className="text-xs text-gray-400 mt-1">Age: {calculateAge(personal.dateOfBirth)}</p>
          )}
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time of Birth</label>
          <input
            type="time"
            value={personal.timeOfBirth}
            onChange={(e) => update('timeOfBirth', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Place of Birth</label>
          <input
            type="text"
            value={personal.placeOfBirth}
            onChange={(e) => update('placeOfBirth', e.target.value)}
            placeholder="e.g. Mumbai, Maharashtra"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height</label>
          <select
            value={personal.height}
            onChange={(e) => update('height', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
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
            placeholder="e.g. 55 kg"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Complexion */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complexion</label>
          <select
            value={personal.complexion}
            onChange={(e) => update('complexion', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
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
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
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
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            {diets.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marital Status</label>
          <select
            value={personal.maritalStatus}
            onChange={(e) => update('maritalStatus', e.target.value as any)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors bg-white"
          >
            {maritalStatuses.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* About Me */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-gray-700">About Me (Optional)</label>
          <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-medium">✨ AI can write this</span>
        </div>
        <textarea
          value={personal.aboutMe}
          onChange={(e) => update('aboutMe', e.target.value)}
          placeholder="A brief introduction about yourself, your interests, values and what you're looking for..."
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
