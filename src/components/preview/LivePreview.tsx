'use client';

import { useBiodataStore } from '@/lib/store/biodata';
import { formatDate, calculateAge } from '@/lib/utils';
import { TEMPLATES, DEITY_SYMBOLS } from '@/lib/constants';

export function LivePreview() {
  const { data } = useBiodataStore();
  const { personal, astrological, education, family, contact, partnerExpectations } = data;
  const template = TEMPLATES.find(t => t.id === data.templateId) || TEMPLATES[0];
  const deity = DEITY_SYMBOLS.find(d => d.id === astrological.deitySymbol);
  const age = personal.dateOfBirth ? calculateAge(personal.dateOfBirth) : '';

  const bg = template.primaryColor;
  const accent = template.accentColor;

  return (
    <div
      id="biodata-preview"
      className="w-full bg-white shadow-xl rounded-lg overflow-hidden"
      style={{ fontFamily: template.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif', maxWidth: '420px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ backgroundColor: bg, color: 'white' }} className="p-4 text-center relative">
        <div className="text-2xl mb-1">{deity?.emoji || '🕉️'}</div>
        <div className="text-xs tracking-widest uppercase opacity-75 mb-1">{data.title}</div>
        <div className="text-xl font-bold">{personal.fullName || 'Your Name Here'}</div>
        {age && <div className="text-xs opacity-75 mt-0.5">{age}</div>}
        {/* Accent border */}
        <div style={{ backgroundColor: accent }} className="h-0.5 absolute bottom-0 left-0 right-0" />
      </div>

      <div className="flex gap-0">
        {/* Photo Column */}
        {personal.profilePhoto && (
          <div style={{ backgroundColor: `${bg}15` }} className="w-28 p-3 flex-none">
            <img
              src={personal.profilePhoto}
              alt={personal.fullName}
              className="w-full aspect-[3/4] object-cover rounded-lg"
              style={{ border: `2px solid ${accent}` }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-3 space-y-3 text-xs">
          {/* Personal */}
          {(personal.dateOfBirth || personal.height || personal.complexion) && (
            <Section title="Personal Details" color={bg} accent={accent}>
              <Row label="Date of Birth" value={formatDate(personal.dateOfBirth)} />
              {personal.timeOfBirth && <Row label="Time of Birth" value={personal.timeOfBirth} />}
              {personal.placeOfBirth && <Row label="Place of Birth" value={personal.placeOfBirth} />}
              {personal.height && <Row label="Height" value={personal.height} />}
              {personal.complexion && <Row label="Complexion" value={personal.complexion} />}
              {personal.bloodGroup && <Row label="Blood Group" value={personal.bloodGroup} />}
              {personal.diet && <Row label="Diet" value={personal.diet} />}
              {personal.maritalStatus && <Row label="Marital Status" value={personal.maritalStatus} />}
            </Section>
          )}

          {/* About Me */}
          {personal.aboutMe && (
            <Section title="About Me" color={bg} accent={accent}>
              <p className="text-gray-600 leading-relaxed">{personal.aboutMe}</p>
            </Section>
          )}

          {/* Astrological */}
          {data.showAstrological && (astrological.rashi || astrological.caste || astrological.gotra) && (
            <Section title="Astrological Details" color={bg} accent={accent}>
              {astrological.religion && <Row label="Religion" value={astrological.religion} />}
              {astrological.caste && <Row label="Caste" value={astrological.caste} />}
              {astrological.subCaste && <Row label="Sub-Caste" value={astrological.subCaste} />}
              {astrological.gotra && <Row label="Gotra" value={astrological.gotra} />}
              {astrological.rashi && <Row label="Rashi" value={astrological.rashi} />}
              {astrological.nakshatra && <Row label="Nakshatra" value={astrological.nakshatra} />}
              {astrological.manglik && <Row label="Manglik" value={astrological.manglik} />}
            </Section>
          )}

          {/* Education */}
          {(education.highestEducation || education.occupation) && (
            <Section title="Education & Career" color={bg} accent={accent}>
              {education.highestEducation && <Row label="Education" value={education.highestEducation} />}
              {education.educationDetails && <Row label="Specialization" value={education.educationDetails} />}
              {education.college && <Row label="College" value={education.college} />}
              {education.occupation && <Row label="Occupation" value={education.occupation} />}
              {education.employer && <Row label="Employer" value={education.employer} />}
              {education.annualIncome && <Row label="Annual Income" value={education.annualIncome} />}
              {education.workCity && <Row label="Work Location" value={`${education.workCity}${education.workCountry && education.workCountry !== 'India' ? ', ' + education.workCountry : ''}`} />}
            </Section>
          )}

          {/* Family */}
          {(family.fatherName || family.motherName) && (
            <Section title="Family Details" color={bg} accent={accent}>
              {family.fatherName && <Row label="Father" value={`${family.fatherName}${family.fatherOccupation ? ` (${family.fatherOccupation})` : ''}`} />}
              {family.motherName && <Row label="Mother" value={`${family.motherName}${family.motherOccupation ? ` (${family.motherOccupation})` : ''}`} />}
              {(family.brothers !== '0' || family.sisters !== '0') && (
                <Row label="Siblings" value={`${family.brothers} Brother(s), ${family.sisters} Sister(s)`} />
              )}
              {family.nativePlace && <Row label="Native Place" value={family.nativePlace} />}
              {family.familyType && <Row label="Family Type" value={`${family.familyType} Family`} />}
            </Section>
          )}

          {/* Contact */}
          {(contact.phone || contact.city) && (
            <Section title="Contact Details" color={bg} accent={accent}>
              {contact.contactPerson && <Row label="Contact" value={contact.contactPerson} />}
              {contact.phone && <Row label="Phone" value={contact.phone} />}
              {contact.whatsapp && contact.whatsapp !== contact.phone && <Row label="WhatsApp" value={contact.whatsapp} />}
              {contact.email && <Row label="Email" value={contact.email} />}
              {contact.city && <Row label="Location" value={`${contact.city}${contact.state ? ', ' + contact.state : ''}`} />}
            </Section>
          )}

          {/* Expectations */}
          {data.showPartnerExpectations && partnerExpectations.preferences && (
            <Section title="Partner Expectations" color={bg} accent={accent}>
              {(partnerExpectations.ageFrom || partnerExpectations.ageTo) && (
                <Row label="Age" value={`${partnerExpectations.ageFrom || '?'} – ${partnerExpectations.ageTo || '?'} years`} />
              )}
              {partnerExpectations.education && <Row label="Education" value={partnerExpectations.education} />}
              {partnerExpectations.occupation && <Row label="Occupation" value={partnerExpectations.occupation} />}
              {partnerExpectations.preferences && <p className="text-gray-600 mt-1 leading-relaxed">{partnerExpectations.preferences}</p>}
            </Section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: bg }} className="px-4 py-2 text-center">
        <div style={{ color: accent }} className="text-xs opacity-75">Created with BioLum</div>
      </div>
    </div>
  );
}

function Section({ title, color, accent, children }: { title: string; color: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div style={{ color, fontWeight: 700 }} className="text-xs uppercase tracking-wide">{title}</div>
        <div style={{ backgroundColor: accent }} className="flex-1 h-px opacity-50" />
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-1">
      <span className="text-gray-400 w-24 flex-none">{label}:</span>
      <span className="text-gray-700 font-medium flex-1">{value}</span>
    </div>
  );
}
