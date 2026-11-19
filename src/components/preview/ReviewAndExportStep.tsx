'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { LivePreview } from '@/components/preview/LivePreview';
import { TemplatePicker } from '@/components/templates/TemplatePicker';
import { ExportPanel } from '@/components/preview/ExportPanel';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function ReviewAndExportStep() {
  const { setStep } = useBiodataStore();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
            <Sparkles className="w-5 h-5 text-rose-600" />
            Your Biodata is Ready!
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Choose your preferred template design, preview it, and download as image, PDF, or share instantly on WhatsApp.
          </p>
        </div>
        <button
          onClick={() => setStep('personal')}
          className="text-xs font-semibold text-rose-700 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 flex-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
        </button>
      </div>

      {/* Main Grid: Left is Full Biodata Card, Right is Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Real Preview Card */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span>📄</span> High-Resolution Preview
            </h3>
            <span className="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-medium">
              Ready to Export
            </span>
          </div>

          <div className="w-full flex justify-center overflow-x-auto py-2">
            <div className="w-full max-w-[480px]">
              <LivePreview />
            </div>
          </div>
        </div>

        {/* Right: Template Selector & Export Suite */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <TemplatePicker />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
