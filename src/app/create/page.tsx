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
import { ReviewAndExportStep } from '@/components/preview/ReviewAndExportStep';
import { LivePreview } from '@/components/preview/LivePreview';
import { TemplatePicker } from '@/components/templates/TemplatePicker';
import { ExportPanel } from '@/components/preview/ExportPanel';
import { ChevronLeft, ChevronRight, Eye, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { FormStep } from '@/types/biodata';

const STEP_IDS = STEPS.map(s => s.id);

function FormContent({ step }: { step: FormStep }) {
  switch (step) {
    case 'personal': return <PersonalForm />;
    case 'astrological': return <AstrologicalForm />;
    case 'education': return <EducationForm />;
    case 'family': return <FamilyForm />;
    case 'contact': return <ContactForm />;
    case 'expectations': return <ExpectationsForm />;
    case 'preview': return <ReviewAndExportStep />;
    default: return null;
  }
}

export default function CreatePage() {
  const { currentStep, setStep } = useBiodataStore();
  const [showSidePreviewMobile, setShowSidePreviewMobile] = useState(false);
  const stepConfig = STEPS.find(s => s.id === currentStep) || STEPS[0];
  const currentIndex = STEP_IDS.indexOf(currentStep);
  const isPreviewStep = currentStep === 'preview';
  const isLast = currentIndex === STEP_IDS.length - 1;
  const isFirst = currentIndex === 0;

  const goNext = () => {
    if (!isLast) {
      const nextStep = STEP_IDS[currentIndex + 1] as FormStep;
      setStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      const prevStep = STEP_IDS[currentIndex - 1] as FormStep;
      setStep(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jumpToPreview = () => {
    setStep('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-none">
            <span className="text-2xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
              BioLum
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              MAKER
            </span>
          </Link>

          {/* Stepper Navigation */}
          <div className="flex-1 overflow-hidden">
            <StepperNav />
          </div>

          {/* Action button */}
          {!isPreviewStep ? (
            <button
              onClick={jumpToPreview}
              className="flex items-center gap-1.5 bg-rose-600 text-white px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-700 transition-all shadow-sm flex-none"
            >
              <Eye className="w-4 h-4" />
              <span>Preview & Export</span>
            </button>
          ) : (
            <button
              onClick={() => setStep('personal')}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all flex-none"
            >
              Edit Form
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* If user is on the dedicated Preview & Download Step, render full width */}
        {isPreviewStep ? (
          <div className="w-full">
            <ReviewAndExportStep />
          </div>
        ) : (
          /* Split layout during editing steps */
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Form Column */}
            <div className={`flex-1 min-w-0 w-full ${showSidePreviewMobile ? 'hidden lg:block' : 'block'}`}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Step Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-rose-50 rounded-xl">{stepConfig.icon}</span>
                    <div>
                      <h2 className="font-bold text-gray-900 text-base">{stepConfig.label}</h2>
                      <p className="text-xs text-gray-500">{stepConfig.description}</p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                    Step {currentIndex + 1} of {STEPS.length}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="p-6">
                  <FormContent step={currentStep} />
                </div>

                {/* Bottom Navigation Toolbar */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <button
                    onClick={goPrev}
                    disabled={isFirst}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {/* Always visible View Preview shortcut */}
                    <button
                      type="button"
                      onClick={jumpToPreview}
                      className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-500" /> Jump to Preview
                    </button>

                    {currentIndex === STEP_IDS.length - 2 ? (
                      <button
                        onClick={jumpToPreview}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold hover:opacity-95 transition-all shadow-md shadow-rose-200"
                      >
                        <span>View Full Biodata Preview</span>
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={goNext}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all shadow-sm"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column: Live Preview & Template Bar */}
            <div className={`w-full lg:w-96 flex-none space-y-5 ${showSidePreviewMobile ? 'block' : 'hidden lg:block'}`}>
              {/* Live Preview Card */}
              <div id="live-preview-box" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Mini-Preview
                  </div>
                  <button
                    onClick={jumpToPreview}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    Full Screen <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full flex justify-center overflow-hidden scale-[0.80] origin-top -mb-16">
                  <LivePreview />
                </div>
              </div>

              {/* Template Picker */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <TemplatePicker />
              </div>

              {/* Quick Export Panel */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <ExportPanel />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
