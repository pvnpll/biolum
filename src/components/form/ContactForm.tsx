'use client';
import { useBiodataStore } from '@/lib/store/biodata';
import { INDIAN_STATES } from '@/lib/constants';

export function ContactForm() {
  const { data, updateSection } = useBiodataStore();
  const { contact } = data;
  const update = (field: string, value: string) => updateSection('contact', { [field]: value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Person</label>
        <input type="text" value={contact.contactPerson} onChange={e => update('contactPerson', e.target.value)} placeholder="e.g. Self, Father, Mother"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
        <input type="tel" value={contact.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
        <input type="tel" value={contact.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="Same as phone or different"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
        <input type="email" value={contact.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
        <textarea value={contact.address} onChange={e => update('address', e.target.value)} placeholder="House / flat no., street, locality..."
          rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
        <input type="text" value={contact.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Pune"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
        <select value={contact.state} onChange={e => update('state', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white">
          <option value="">Select state</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
