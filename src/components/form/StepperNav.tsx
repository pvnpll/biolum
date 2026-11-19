'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { STEPS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { FormStep } from '@/types/biodata';

const STEP_IDS = STEPS.map(s => s.id);

export function StepperNav() {
  const { currentStep, setStep, data } = useBiodataStore();
  const currentIndex = STEP_IDS.indexOf(currentStep);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max px-2 py-3 gap-1">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = i <= currentIndex + 1;

          return (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => isClickable && setStep(step.id as FormStep)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isCurrent && 'bg-rose-600 text-white shadow-sm',
                  isCompleted && 'bg-rose-50 text-rose-700 hover:bg-rose-100',
                  !isCurrent && !isCompleted && 'text-gray-400 cursor-not-allowed',
                  isClickable && !isCurrent && isCompleted && 'cursor-pointer',
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold',
                  isCurrent && 'bg-white text-rose-600',
                  isCompleted && 'bg-rose-200 text-rose-700',
                  !isCurrent && !isCompleted && 'bg-gray-100 text-gray-400',
                )}>
                  {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="hidden sm:block">{step.shortLabel}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn('h-0.5 w-4 rounded', isCompleted ? 'bg-rose-300' : 'bg-gray-200')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
