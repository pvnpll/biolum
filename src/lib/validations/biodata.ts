import { z } from 'zod';

export const personalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  complexion: z.string().optional(),
  bloodGroup: z.string().optional(),
  diet: z.string().optional(),
  maritalStatus: z.string().optional(),
  profilePhoto: z.string().nullable().optional(),
  aboutMe: z.string().optional(),
});

export const astrologicalSchema = z.object({
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  gotra: z.string().optional(),
  rashi: z.string().optional(),
  nakshatra: z.string().optional(),
  manglik: z.string().optional(),
  gan: z.string().optional(),
  nadi: z.string().optional(),
  deitySymbol: z.string().optional(),
});

export const educationSchema = z.object({
  highestEducation: z.string().optional(),
  educationDetails: z.string().optional(),
  college: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  annualIncome: z.string().optional(),
  workCity: z.string().optional(),
  workCountry: z.string().optional(),
});

export const familySchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  brothers: z.string().optional(),
  marriedBrothers: z.string().optional(),
  sisters: z.string().optional(),
  marriedSisters: z.string().optional(),
  nativePlace: z.string().optional(),
  familyType: z.string().optional(),
  familyValues: z.string().optional(),
  familyStatus: z.string().optional(),
});

export const contactSchema = z.object({
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const expectationsSchema = z.object({
  ageFrom: z.string().optional(),
  ageTo: z.string().optional(),
  heightFrom: z.string().optional(),
  heightTo: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  preferences: z.string().optional(),
});
