'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Lock, Check } from 'lucide-react';
import type { TemplateId } from '@/types/biodata';

export function TemplatePicker() {
  const { data, setTemplate, isPremium } = useBiodataStore();

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-700 mb-3">Choose Template</div>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => {
          const isLocked = tpl.isPremium && !isPremium;
          const isSelected = data.templateId === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => !isLocked && setTemplate(tpl.id as TemplateId)}
              className={cn(
                'relative rounded-xl border-2 transition-all text-left overflow-hidden group',
                isSelected ? 'border-rose-500 shadow-md shadow-rose-100' : 'border-gray-200 hover:border-gray-300',
                isLocked && 'opacity-70 cursor-not-allowed',
              )}
            >
              {/* Color swatch */}
              <div
                className="h-20 w-full relative"
                style={{ backgroundColor: tpl.primaryColor }}
              >
                {/* Template layout preview */}
                <div className="absolute inset-0 p-2 opacity-50">
                  <div className="w-full h-2 rounded mb-1" style={{ backgroundColor: tpl.accentColor }} />
                  <div className="w-3/4 h-1.5 rounded mb-1 bg-white/40" />
                  <div className="w-1/2 h-1 rounded bg-white/30" />
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                      <Lock className="w-3 h-3" /> Premium
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-800">{tpl.name}</div>
                <div className="text-xs text-gray-400 capitalize">{tpl.category}</div>
              </div>
            </button>
          );
        })}
      </div>

      {!isPremium && (
        <div className="mt-3 p-3 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-xl text-sm">
          <div className="font-semibold text-gray-800 mb-1">🔓 Unlock all templates</div>
          <div className="text-gray-500 text-xs mb-2">Get all 10 templates + clean PDF without watermark</div>
          <button className="w-full bg-rose-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors">
            Upgrade for ₹49
          </button>
        </div>
      )}
    </div>
  );
}
