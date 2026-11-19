'use client';
import { useBiodataStore } from '@/lib/store/biodata';

const familyTypes = ['Nuclear', 'Joint', 'Extended'];
const familyValues = ['Traditional', 'Moderate', 'Liberal'];
const counts = Array.from({ length: 6 }, (_, i) => String(i));

export function FamilyForm() {
  const { data, updateSection } = useBiodataStore();
  const { family } = data;
  const update = (field: string, value: string) => updateSection('family', { [field]: value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Father's Name</label>
        <input type="text" value={family.fatherName} onChange={e => update('fatherName', e.target.value)} placeholder="Father's full name"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Father's Occupation</label>
        <input type="text" value={family.fatherOccupation} onChange={e => update('fatherOccupation', e.target.value)} placeholder="e.g. Retired Teacher"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mother's Name</label>
        <input type="text" value={family.motherName} onChange={e => update('motherName', e.target.value)} placeholder="Mother's full name"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mother's Occupation</label>
        <input type="text" value={family.motherOccupation} onChange={e => update('motherOccupation', e.target.value)} placeholder="e.g. Homemaker"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brothers</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <select value={family.brothers} onChange={e => update('brothers', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
              {counts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-gray-400 mt-0.5 block">Total</span>
          </div>
          <div className="flex-1">
            <select value={family.marriedBrothers} onChange={e => update('marriedBrothers', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
              {counts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-gray-400 mt-0.5 block">Married</span>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sisters</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <select value={family.sisters} onChange={e => update('sisters', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
              {counts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-gray-400 mt-0.5 block">Total</span>
          </div>
          <div className="flex-1">
            <select value={family.marriedSisters} onChange={e => update('marriedSisters', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
              {counts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-gray-400 mt-0.5 block">Married</span>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Native Place</label>
        <input type="text" value={family.nativePlace} onChange={e => update('nativePlace', e.target.value)} placeholder="Ancestral hometown"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Family Type</label>
        <div className="flex gap-2">
          {familyTypes.map(t => (
            <button key={t} type="button" onClick={() => update('familyType', t)}
              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${family.familyType === t ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Family Values</label>
        <div className="flex gap-2">
          {familyValues.map(v => (
            <button key={v} type="button" onClick={() => update('familyValues', v)}
              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${family.familyValues === v ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{v}</button>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Family Status / Additional Info</label>
        <textarea value={family.familyStatus} onChange={e => update('familyStatus', e.target.value)}
          placeholder="e.g. Well-settled business family, own house..."
          rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none" />
      </div>
    </div>
  );
}
