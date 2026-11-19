import Link from 'next/link';
import { TEMPLATES } from '@/lib/constants';
import { ArrowRight, Lock } from 'lucide-react';

export const metadata = {
  title: 'Biodata Templates — BioLum',
  description: 'Choose from 10+ beautiful matrimonial biodata templates. Traditional, modern, elegant and minimal styles.',
};

const categories = ['All', 'Traditional', 'Modern', 'Elegant', 'Minimal'];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">BioLum</Link>
          <Link href="/create" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-1.5">
            Create Biodata <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Biodata Templates</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Choose your favorite design. All data you fill transfers automatically when you switch templates.</p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all">
              {/* Preview */}
              <div className="relative h-48" style={{ backgroundColor: tpl.primaryColor }}>
                {/* Simulated layout */}
                <div className="absolute inset-0 p-4 opacity-60">
                  <div className="w-full h-3 rounded mb-2" style={{ backgroundColor: tpl.accentColor }} />
                  <div className="flex gap-2">
                    <div className="w-10 h-14 rounded bg-white/30" />
                    <div className="flex-1 space-y-1.5 pt-1">
                      <div className="h-2 bg-white/50 rounded w-3/4" />
                      <div className="h-1.5 bg-white/30 rounded w-1/2" />
                      <div className="h-1.5 bg-white/30 rounded w-2/3" />
                      <div className="h-1.5 bg-white/30 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 bg-white/20 rounded" />
                    <div className="h-1.5 bg-white/20 rounded w-4/5" />
                  </div>
                </div>

                {tpl.isPremium && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </div>
                )}
                {!tpl.isPremium && (
                  <div className="absolute top-2 right-2 bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    Free
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href="/create"
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Use Template
                  </Link>
                </div>
              </div>

              <div className="p-3">
                <div className="font-semibold text-sm text-gray-900">{tpl.name}</div>
                <div className="text-xs text-gray-400 capitalize mt-0.5">{tpl.category}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to create yours?</h2>
          <p className="text-gray-500 mb-6">Start for free — no sign up needed. Choose template later in the editor.</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors">
            Create My Biodata <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
