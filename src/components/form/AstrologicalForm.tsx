'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { RASHIS, NAKSHATRAS } from '@/lib/constants';

const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
const manglikOptions = ['No', 'Yes', 'Partial', 'Not Sure'];
const ganOptions = ['Dev', 'Manav', 'Rakshasa'];
export function AstrologicalForm() {
  const { data, updateSection } = useBiodataStore();
  const { astrological } = data;
  const update = (field: string, value: string) => updateSection('astrological', { [field]: value });

  return (
    <div className="space-y-5">
      <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700">
        💡 Astrological details help with matching. Fill what applies to you — all fields are optional.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Religion</label>
          <select value={astrological.religion} onChange={(e) => update('religion', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            {religions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Caste</label>
          <input type="text" value={astrological.caste} onChange={(e) => update('caste', e.target.value)}
            placeholder="e.g. Brahmin, Kshatriya..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub-Caste</label>
          <input type="text" value={astrological.subCaste} onChange={(e) => update('subCaste', e.target.value)}
            placeholder="Sub-caste or community"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gotra</label>
          <input type="text" value={astrological.gotra} onChange={(e) => update('gotra', e.target.value)}
            placeholder="e.g. Kashyap, Bharadwaj..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rashi (Moon Sign)</label>
          <select value={astrological.rashi} onChange={(e) => update('rashi', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            <option value="">Select Rashi</option>
            {RASHIS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nakshatra</label>
          <select value={astrological.nakshatra} onChange={(e) => update('nakshatra', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            <option value="">Select Nakshatra</option>
            {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Manglik</label>
          <div className="flex gap-2 flex-wrap">
            {manglikOptions.map(m => (
              <button key={m} type="button" onClick={() => update('manglik', m)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${astrological.manglik === m ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gan</label>
          <select value={astrological.gan} onChange={(e) => update('gan', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            <option value="">Select Gan</option>
            {ganOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nadi</label>
          <input type="text" value={astrological.nadi} onChange={(e) => update('nadi', e.target.value)}
            placeholder="e.g. Aadi, Madhya, Antya"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
      </div>
    </div>
  );
}
