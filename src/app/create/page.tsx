'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { STEPS } from '@/lib/constants';
import { StepperNav } from '@/components/form/StepperNav';
import { PersonalForm } from '@/components/form/PersonalForm';
import { AstrologicalForm } from '@/components/form/AstrologicalForm';
import { EducationForm } from '@/components/form/EducationForm';
import { FamilyForm } from '@/components/form/FamilyForm';
import { ContactForm } from '@/components/form/ContactForm';
import { ExpectationsForm } from '@/components/form/ExpectationsForm';
import { LivePreview } from '@/components/preview/LivePreview';
import { TemplatePicker } from '@/components/templates/TemplatePicker';
import { ExportPanel } from '@/components/preview/ExportPanel';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STEP_IDS = STEPS.map(s => s.id);

function FormContent({ step }: { step: string }) {
  switch (step) {
    case 'personal': return <PersonalForm />;
    case 'astrological': return <AstrologicalForm />;
    case 'education': return <EducationForm />;
    case 'family': return <FamilyForm />;
    case 'contact': return <ContactForm />;
    case 'expectations': return <ExpectationsForm />;
    default: return null;
  }
}

export default function CreatePage() {
  const { currentStep, setStep, data, updateData, updateSection } = useBiodataStore();
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const stepConfig = STEPS.find(s => s.id === currentStep);
  const currentIndex = STEP_IDS.indexOf(currentStep as any);
  const isLast = currentIndex === STEP_IDS.length - 1;
  const isFirst = currentIndex === 0;

  const goNext = () => {
    if (!isLast) setStep(STEP_IDS[currentIndex + 1] as any);
  };
  const goPrev = () => {
    if (!isFirst) setStep(STEP_IDS[currentIndex - 1] as any);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent flex-none">
            BioLum
          </Link>

          {/* Stepper */}
          <div className="flex-1 overflow-hidden">
            <StepperNav />
          </div>

          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowPreviewMobile(v => !v)}
            className="lg:hidden flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            {showPreviewMobile ? 'Form' : 'Preview'}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">
        {/* LEFT: Form */}
        <div className={`flex-1 min-w-0 ${showPreviewMobile ? 'hidden' : 'block'} lg:block`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Step Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="text-2xl">{stepConfig?.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{stepConfig?.label}</div>
                <div className="text-xs text-gray-400">{stepConfig?.description}</div>
              </div>
              <div className="ml-auto text-xs text-gray-400">Step {currentIndex + 1} of {STEPS.length}</div>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <FormContent step={currentStep} />
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {!isLast ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-all shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowPreviewMobile(true)}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-all shadow-sm"
                >
                  View Preview <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* AI Bio Writer hint */}
          {currentStep === 'personal' && !data.personal.aboutMe && (
            <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-xl flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-600 flex-none mt-0.5" />
              <div>
                <div className="text-sm font-medium text-violet-800">AI Bio Writer</div>
                <div className="text-xs text-violet-600 mt-0.5">Fill in your details first, then let Gemini AI write a beautiful "About Me" paragraph for you.</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Preview + Controls */}
        <div className={`w-80 flex-none space-y-4 ${showPreviewMobile ? 'block w-full' : 'hidden'} lg:block lg:w-80`}>
          {/* Template Picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <TemplatePicker />
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              Live Preview
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">● Live</span>
            </div>
            <div className="scale-[0.75] origin-top -mb-16">
              <LivePreview />
            </div>
          </div>

          {/* Export */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
