import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BiodataFormData, FormStep, TemplateId } from '@/types/biodata';

const defaultData: BiodataFormData = {
  id: '',
  title: 'Marriage Biodata',
  templateId: 'traditional-red',
  primaryColor: '#8B0000',
  accentColor: '#D4AF37',
  fontPair: 'classic',

  personal: {
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    height: '',
    weight: '',
    complexion: '',
    bloodGroup: '',
    diet: 'Vegetarian',
    maritalStatus: 'Never Married',
    profilePhoto: null,
    aboutMe: '',
  },
  astrological: {
    religion: 'Hindu',
    caste: '',
    subCaste: '',
    gotra: '',
    rashi: '',
    nakshatra: '',
    manglik: 'No',
    gan: '',
    nadi: '',
    deitySymbol: 'om',
  },
  education: {
    highestEducation: '',
    educationDetails: '',
    college: '',
    occupation: '',
    employer: '',
    annualIncome: '',
    workCity: '',
    workCountry: 'India',
  },
  family: {
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    brothers: '0',
    marriedBrothers: '0',
    sisters: '0',
    marriedSisters: '0',
    nativePlace: '',
    familyType: 'Nuclear',
    familyValues: 'Moderate',
    familyStatus: '',
  },
  contact: {
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
  },
  partnerExpectations: {
    ageFrom: '',
    ageTo: '',
    heightFrom: '',
    heightTo: '',
    education: '',
    occupation: '',
    maritalStatus: 'Never Married',
    preferences: '',
  },
  customFields: [],

  showAstrological: true,
  showPartnerExpectations: true,
  showCustomFields: false,

  createdAt: '',
  updatedAt: '',
};

interface BiodataStore {
  data: BiodataFormData;
  currentStep: FormStep;
  isPremium: boolean;
  
  // Actions
  updateData: (updates: Partial<BiodataFormData>) => void;
  updateSection: <K extends keyof BiodataFormData>(section: K, updates: Partial<BiodataFormData[K]>) => void;
  setStep: (step: FormStep) => void;
  setTemplate: (templateId: TemplateId) => void;
  resetData: () => void;
  setIsPremium: (val: boolean) => void;
  addCustomField: (section: string) => void;
  removeCustomField: (id: string) => void;
  updateCustomField: (id: string, label: string, value: string) => void;
}

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set, get) => ({
      data: {
        ...defaultData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      currentStep: 'personal',
      isPremium: false,

      updateData: (updates) =>
        set((state) => ({
          data: { ...state.data, ...updates, updatedAt: new Date().toISOString() },
        })),

      updateSection: (section, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            [section]: { ...(state.data[section] as object), ...updates },
            updatedAt: new Date().toISOString(),
          },
        })),

      setStep: (step) => set({ currentStep: step }),

      setTemplate: (templateId) =>
        set((state) => ({
          data: { ...state.data, templateId, updatedAt: new Date().toISOString() },
        })),

      resetData: () =>
        set({
          data: {
            ...defaultData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          currentStep: 'personal',
        }),

      setIsPremium: (val) => set({ isPremium: val }),

      addCustomField: (section) =>
        set((state) => ({
          data: {
            ...state.data,
            customFields: [
              ...state.data.customFields,
              { id: crypto.randomUUID(), label: '', value: '', section },
            ],
          },
        })),

      removeCustomField: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            customFields: state.data.customFields.filter((f) => f.id !== id),
          },
        })),

      updateCustomField: (id, label, value) =>
        set((state) => ({
          data: {
            ...state.data,
            customFields: state.data.customFields.map((f) =>
              f.id === id ? { ...f, label, value } : f
            ),
          },
        })),
    }),
    {
      name: 'biolum-biodata',
      partialize: (state) => ({ data: state.data, isPremium: state.isPremium }),
    }
  )
);
