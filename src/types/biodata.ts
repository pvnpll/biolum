// Core biodata types for BioLum

export type Religion = 'Hindu' | 'Muslim' | 'Christian' | 'Sikh' | 'Jain' | 'Buddhist' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Separated';
export type Diet = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain Vegetarian' | 'Vegan';
export type FamilyType = 'Nuclear' | 'Joint' | 'Extended';
export type FamilyValues = 'Traditional' | 'Moderate' | 'Liberal';
export type Manglik = 'Yes' | 'No' | 'Partial' | 'Not Sure';
export type TemplateId = 'traditional-red' | 'traditional-blue' | 'modern-minimal' | 'elegant-gold' | 'floral-pink' | 'royal-maroon' | 'pastel-green' | 'classic-navy' | 'sunrise-orange' | 'zen-white';
export type ExportFormat = 'pdf' | 'image';

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  diet: Diet;
  maritalStatus: MaritalStatus;
  profilePhoto: string | null; // base64 or URL
  aboutMe: string;
}

export interface AstrologicalDetails {
  religion: Religion;
  caste: string;
  subCaste: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  manglik: Manglik;
  gan: string;
  nadi: string;
  deitySymbol: string; // e.g. 'ganesha', 'om', 'cross', 'crescent', etc.
}

export interface EducationCareerDetails {
  highestEducation: string;
  educationDetails: string;
  college: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  workCity: string;
  workCountry: string;
}

export interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  marriedBrothers: string;
  sisters: string;
  marriedSisters: string;
  nativePlace: string;
  familyType: FamilyType;
  familyValues: FamilyValues;
  familyStatus: string;
}

export interface ContactDetails {
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface PartnerExpectations {
  ageFrom: string;
  ageTo: string;
  heightFrom: string;
  heightTo: string;
  education: string;
  occupation: string;
  maritalStatus: string;
  preferences: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  section: string;
}

export interface BiodataTemplate {
  id: TemplateId;
  name: string;
  category: 'traditional' | 'modern' | 'elegant' | 'minimal';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  previewImage: string;
  isPremium: boolean;
}

export interface BiodataFormData {
  // Meta
  id: string;
  title: string;
  templateId: TemplateId;
  primaryColor: string;
  accentColor: string;
  fontPair: string;

  // Sections
  personal: PersonalDetails;
  astrological: AstrologicalDetails;
  education: EducationCareerDetails;
  family: FamilyDetails;
  contact: ContactDetails;
  partnerExpectations: PartnerExpectations;
  customFields: CustomField[];

  // Expressive profile additions
  personalityTags?: string[];
  interests?: string[];
  lifestyleChoices?: Record<string, string>;

  // Section visibility
  showAstrological: boolean;
  showPartnerExpectations: boolean;
  showCustomFields: boolean;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface ExportOptions {
  format: ExportFormat;
  includeWatermark: boolean;
  quality: 'standard' | 'high';
}

export type FormStep = 
  | 'personal'
  | 'astrological'
  | 'education'
  | 'family'
  | 'contact'
  | 'expectations'
  | 'preview';

export interface StepConfig {
  id: FormStep;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}
