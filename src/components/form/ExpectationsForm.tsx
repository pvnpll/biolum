'use client';
import { useBiodataStore } from '@/lib/store/biodata';

const ageOptions = Array.from({ length: 30 }, (_, i) => String(i + 18));
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Any'];

export function ExpectationsForm() {
  const { data, updateSection } = useBiodataStore();
  const { partnerExpectations } = data;
  const update = (field: string, value: string) => updateSection('partnerExpectations', { [field]: value });
  return (
    <div className="space-y-5">
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
        💡 This section is optional. Add your partner preferences if you'd like to include them in the biodata.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age Range — From</label>
          <select value={partnerExpectations.ageFrom} onChange={e => update('ageFrom', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            <option value="">Select</option>
            {ageOptions.map(a => <option key={a} value={a}>{a} years</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age Range — To</label>
          <select value={partnerExpectations.ageTo} onChange={e => update('ageTo', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
            <option value="">Select</option>
            {ageOptions.map(a => <option key={a} value={a}>{a} years</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Education Preference</label>
          <input type="text" value={partnerExpectations.education} onChange={e => update('education', e.target.value)} placeholder="e.g. Graduate and above"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Occupation Preference</label>
          <input type="text" value={partnerExpectations.occupation} onChange={e => update('occupation', e.target.value)} placeholder="e.g. Any well-settled job"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marital Status</label>
          <div className="flex flex-wrap gap-2">
            {maritalStatuses.map(m => (
              <button key={m} type="button" onClick={() => update('maritalStatus', m)}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${partnerExpectations.maritalStatus === m ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{m}</button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Preferences</label>
        <textarea value={partnerExpectations.preferences} onChange={e => update('preferences', e.target.value)}
          placeholder="Describe what you're looking for in a life partner — values, lifestyle, family background..."
          rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none" />
      </div>
    </div>
  );
}
