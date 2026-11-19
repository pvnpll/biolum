import type { BiodataTemplate, StepConfig } from '@/types/biodata';

export const TEMPLATES: BiodataTemplate[] = [
  {
    id: 'traditional-red',
    name: 'Royal Tradition',
    category: 'traditional',
    primaryColor: '#8B0000',
    accentColor: '#D4AF37',
    fontFamily: 'serif',
    previewImage: '/templates/traditional-red.jpg',
    isPremium: false,
  },
  {
    id: 'traditional-blue',
    name: 'Sacred Blue',
    category: 'traditional',
    primaryColor: '#1B3A6B',
    accentColor: '#C9A84C',
    fontFamily: 'serif',
    previewImage: '/templates/traditional-blue.jpg',
    isPremium: false,
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'modern',
    primaryColor: '#2D2D2D',
    accentColor: '#6366F1',
    fontFamily: 'sans',
    previewImage: '/templates/modern-minimal.jpg',
    isPremium: false,
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    category: 'elegant',
    primaryColor: '#1A1A2E',
    accentColor: '#E8B84B',
    fontFamily: 'serif',
    previewImage: '/templates/elegant-gold.jpg',
    isPremium: true,
  },
  {
    id: 'floral-pink',
    name: 'Floral Bliss',
    category: 'traditional',
    primaryColor: '#9B2335',
    accentColor: '#F9C6CF',
    fontFamily: 'serif',
    previewImage: '/templates/floral-pink.jpg',
    isPremium: true,
  },
  {
    id: 'royal-maroon',
    name: 'Royal Maroon',
    category: 'traditional',
    primaryColor: '#6B0F1A',
    accentColor: '#FFD700',
    fontFamily: 'serif',
    previewImage: '/templates/royal-maroon.jpg',
    isPremium: true,
  },
  {
    id: 'pastel-green',
    name: 'Nature Fresh',
    category: 'modern',
    primaryColor: '#2D6A4F',
    accentColor: '#95D5B2',
    fontFamily: 'sans',
    previewImage: '/templates/pastel-green.jpg',
    isPremium: true,
  },
  {
    id: 'classic-navy',
    name: 'Classic Navy',
    category: 'elegant',
    primaryColor: '#0D1B2A',
    accentColor: '#E2C97E',
    fontFamily: 'serif',
    previewImage: '/templates/classic-navy.jpg',
    isPremium: true,
  },
  {
    id: 'sunrise-orange',
    name: 'Sunrise',
    category: 'modern',
    primaryColor: '#CC4A1C',
    accentColor: '#FFC947',
    fontFamily: 'sans',
    previewImage: '/templates/sunrise-orange.jpg',
    isPremium: true,
  },
  {
    id: 'zen-white',
    name: 'Zen White',
    category: 'minimal',
    primaryColor: '#374151',
    accentColor: '#6B7280',
    fontFamily: 'sans',
    previewImage: '/templates/zen-white.jpg',
    isPremium: true,
  },
];

export const STEPS: StepConfig[] = [
  { id: 'personal', label: 'Personal Details', shortLabel: 'Personal', icon: '👤', description: 'Basic information about you' },
  { id: 'astrological', label: 'Astrological Details', shortLabel: 'Astrology', icon: '⭐', description: 'Religion, caste & horoscope' },
  { id: 'education', label: 'Education & Career', shortLabel: 'Education', icon: '🎓', description: 'Your qualifications & work' },
  { id: 'family', label: 'Family Background', shortLabel: 'Family', icon: '🏠', description: 'Your family details' },
  { id: 'contact', label: 'Contact Details', shortLabel: 'Contact', icon: '📞', description: 'How to reach you' },
  { id: 'expectations', label: 'Partner Expectations', shortLabel: 'Expectations', icon: '💫', description: 'What you are looking for' },
];

export const RASHIS = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const HEIGHTS = Array.from({ length: 24 }, (_, i) => {
  const totalInches = 48 + i;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const cm = Math.round(totalInches * 2.54);
  return `${feet}'${inches}" (${cm} cm)`;
});

export const INCOME_RANGES = [
  'Below ₹2 LPA', '₹2–4 LPA', '₹4–6 LPA', '₹6–10 LPA', '₹10–15 LPA',
  '₹15–25 LPA', '₹25–50 LPA', 'Above ₹50 LPA', 'Not Disclosed',
];

export const DEITY_SYMBOLS = [
  { id: 'om', label: 'Om (ॐ)', emoji: '🕉️' },
  { id: 'ganesha', label: 'Ganesha', emoji: '🐘' },
  { id: 'cross', label: 'Cross', emoji: '✝️' },
  { id: 'crescent', label: 'Crescent & Star', emoji: '☪️' },
  { id: 'khanda', label: 'Khanda (Sikh)', emoji: '☬' },
  { id: 'star-david', label: 'Star of David', emoji: '✡️' },
  { id: 'dharma', label: 'Dharma Wheel', emoji: '☸️' },
  { id: 'none', label: 'None', emoji: '—' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Other',
];
