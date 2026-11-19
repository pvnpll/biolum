'use client';
import { useBiodataStore } from '@/lib/store/biodata';
import { INCOME_RANGES } from '@/lib/constants';

const educationLevels = ['10th', '12th', 'Diploma', 'B.A.', 'B.Com', 'B.Sc', 'B.Tech / B.E.', 'BCA', 'BBA', 'M.A.', 'M.Com', 'M.Sc', 'M.Tech / M.E.', 'MCA', 'MBA', 'MBBS', 'MD / MS', 'PhD', 'CA', 'CS', 'LLB / LLM', 'Other'];

export function EducationForm() {
  const { data, updateSection } = useBiodataStore();
  const { education } = data;
  const update = (field: string, value: string) => updateSection('education', { [field]: value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Highest Education</label>
        <select value={education.highestEducation} onChange={e => update('highestEducation', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
          <option value="">Select qualification</option>
          {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Education Details</label>
        <input type="text" value={education.educationDetails} onChange={e => update('educationDetails', e.target.value)}
          placeholder="e.g. B.Tech in Computer Science"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">College / University</label>
        <input type="text" value={education.college} onChange={e => update('college', e.target.value)}
          placeholder="e.g. IIT Bombay"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Occupation / Job Title</label>
        <input type="text" value={education.occupation} onChange={e => update('occupation', e.target.value)}
          placeholder="e.g. Software Engineer"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employer / Company</label>
        <input type="text" value={education.employer} onChange={e => update('employer', e.target.value)}
          placeholder="e.g. TCS, Own Business"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Annual Income</label>
        <select value={education.annualIncome} onChange={e => update('annualIncome', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
          <option value="">Select range</option>
          {INCOME_RANGES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work City</label>
        <input type="text" value={education.workCity} onChange={e => update('workCity', e.target.value)}
          placeholder="e.g. Bangalore"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
    </div>
  );
}
