import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BiodataFormData, FormStep, TemplateId } from '@/types/biodata';

const sampleData: BiodataFormData = {
  id: '',
  title: 'Marriage Biodata',
  templateId: 'traditional-red',
  primaryColor: '#8B0000',
  accentColor: '#D4AF37',
  fontPair: 'classic',

  personal: {
    fullName: 'Priya Sharma',
    dateOfBirth: '1998-07-15',
    timeOfBirth: '08:30 AM',
    placeOfBirth: 'Pune, Maharashtra',
    height: '5\'4" (163 cm)',
    weight: '56 kg',
    complexion: 'Fair',
    bloodGroup: 'B+',
    diet: 'Vegetarian',
    maritalStatus: 'Never Married',
    profilePhoto: null,
    aboutMe: 'I am an open-minded and family-oriented individual who balances modern professional aspirations with deeply rooted traditional Indian values. Looking for a compassionate partner with mutual respect.',
  },
  astrological: {
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Deshastha',
    gotra: 'Kashyap',
    rashi: 'Mesh (Aries)',
    nakshatra: 'Ashwini',
    manglik: 'No',
    gan: 'Dev',
    nadi: 'Aadi',
    deitySymbol: 'ganesha',
  },
  education: {
    highestEducation: 'B.Tech / B.E.',
    educationDetails: 'B.Tech in Computer Science',
    college: 'Pune University (COEP)',
    occupation: 'Senior Software Engineer',
    employer: 'Top Tech MNC',
    annualIncome: '₹15–25 LPA',
    workCity: 'Bangalore / Pune',
    workCountry: 'India',
  },
  family: {
    fatherName: 'Dr. Ramesh Sharma',
    fatherOccupation: 'Senior Medical Practitioner',
    motherName: 'Sunita Sharma',
    motherOccupation: 'High School Teacher',
    brothers: '1',
    marriedBrothers: '0',
    sisters: '0',
    marriedSisters: '0',
    nativePlace: 'Satara, Maharashtra',
    familyType: 'Nuclear',
    familyValues: 'Moderate',
    familyStatus: 'Upper Middle Class, Own Residential Property in Pune',
  },
  contact: {
    contactPerson: 'Father (Dr. Ramesh Sharma)',
    phone: '+91 98220 12345',
    whatsapp: '+91 98220 12345',
    email: 'sharma.family.alliance@gmail.com',
    address: 'Flat 402, Ganga Heights, Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
  },
  partnerExpectations: {
    ageFrom: '26',
    ageTo: '31',
    heightFrom: '5\'7"',
    heightTo: '6\'2"',
    education: 'Post Graduate / Engineer / Doctor / CA',
    occupation: 'Well-settled professional or progressive entrepreneur',
    maritalStatus: 'Never Married',
    preferences: 'Seeking a respectful, emotionally mature life partner with good family values and positive outlook towards career and family.',
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
        ...sampleData,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'b-' + Date.now(),
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
            ...sampleData,
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'b-' + Date.now(),
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
              { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cf-' + Date.now(), label: '', value: '', section },
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
      name: 'biolum-biodata-v2',
      partialize: (state) => ({ data: state.data, isPremium: state.isPremium }),
    }
  )
);
