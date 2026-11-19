export const dynamic = "force-dynamic";
import { supabase } from '@/lib/supabase';
import { formatDate, calculateAge } from '@/lib/utils';
import { TEMPLATES, DEITY_SYMBOLS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Share2, ShieldCheck, Heart, Sparkles, Download, Check } from 'lucide-react';
import type { Metadata } from 'next';
import { ShareableActions } from './ShareableActions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: profile } = await supabase
    .from('biolum_profiles')
    .select('data, title')
    .eq('slug', slug)
    .single();

  if (!profile) {
    return { title: 'Biodata Not Found — BioLum' };
  }

  const name = profile.data?.personal?.fullName || 'Candidate';
  const role = profile.data?.education?.occupation ? ` • ${profile.data.education.occupation}` : '';
  const city = profile.data?.contact?.city ? ` in ${profile.data.contact.city}` : '';

  return {
    title: `${name} — Marriage Biodata | BioLum`,
    description: `Official matrimonial biodata profile for ${name}${role}${city}. View verified family, career, and astrological details.`,
    openGraph: {
      title: `${name} — Marriage Biodata`,
      description: `Matrimonial profile for ${name}. View education, family background, and contact details.`,
    },
  };
}

export default async function PublicBiodataPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch biodata profile
  const { data: profile, error } = await supabase
    .from('biolum_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Increment views count via RPC (fire and forget)
  supabase.rpc('biolum_increment_views', { profile_slug: slug }).then(() => {});

  const data = profile.data;
  const { personal = {}, astrological = {}, education = {}, family = {}, contact = {}, partnerExpectations = {} } = data;
  const template = TEMPLATES.find(t => t.id === profile.template_id) || TEMPLATES[0];
  const deity = DEITY_SYMBOLS.find(d => d.id === astrological.deitySymbol);
  const age = personal.dateOfBirth ? calculateAge(personal.dateOfBirth) : '';

  const bg = template.primaryColor;
  const accent = template.accentColor;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6 flex flex-col items-center">
      {/* Top Floating Header */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-3 sm:p-4 mb-5 shadow-sm flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
            BioLum
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified Link
          </span>
        </Link>

        <ShareableActions
          candidateName={personal.fullName || 'Candidate'}
          slug={slug}
          phone={contact.phone}
          whatsapp={contact.whatsapp}
        />
      </div>

      {/* Main Biodata Profile Document */}
      <div
        id="biodata-view"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200"
        style={{ fontFamily: template.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif' }}
      >
        {/* Auspicious Header Banner */}
        <div style={{ backgroundColor: bg }} className="text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="text-4xl mb-2">{deity?.emoji || '🕉️'}</div>
          <div className="text-xs uppercase tracking-widest opacity-80 font-bold mb-1">
            {data.title || 'Marriage Biodata'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {personal.fullName || 'Candidate Profile'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs opacity-90 mt-2 font-medium">
            {age && <span>{age}</span>}
            {personal.height && <span>• {personal.height}</span>}
            {education.occupation && <span>• {education.occupation}</span>}
          </div>

          {/* Accent Line */}
          <div style={{ backgroundColor: accent }} className="h-1 absolute bottom-0 left-0 right-0" />
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Top Row: Photo + Quick Bio */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt={personal.fullName}
                className="w-36 h-48 sm:w-40 sm:h-52 object-cover rounded-2xl shadow-md flex-none"
                style={{ border: `3px solid ${accent}` }}
              />
            ) : (
              <div
                className="w-32 h-44 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-200 flex-none"
              >
                <span className="text-4xl mb-1">👤</span>
                <span className="text-[11px]">No Photo</span>
              </div>
            )}

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  About Candidate
                </span>
                <p className="text-sm text-gray-700 leading-relaxed mt-2 font-normal">
                  {personal.aboutMe || 'Looking for an alliance with a compatible and understanding life partner.'}
                </p>
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    Call
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste, regarding the matrimonial biodata of ${personal.fullName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section: Personal Information */}
          <SectionBlock title="Personal Details" color={bg} accent={accent}>
            <DataGrid>
              <InfoRow label="Date of Birth" value={formatDate(personal.dateOfBirth)} />
              {personal.timeOfBirth && <InfoRow label="Time of Birth" value={personal.timeOfBirth} />}
              {personal.placeOfBirth && <InfoRow label="Place of Birth" value={personal.placeOfBirth} />}
              {personal.height && <InfoRow label="Height" value={personal.height} />}
              {personal.weight && <InfoRow label="Weight" value={personal.weight} />}
              {personal.complexion && <InfoRow label="Complexion" value={personal.complexion} />}
              {personal.bloodGroup && <InfoRow label="Blood Group" value={personal.bloodGroup} />}
              {personal.diet && <InfoRow label="Diet" value={personal.diet} />}
              {personal.maritalStatus && <InfoRow label="Marital Status" value={personal.maritalStatus} />}
            </DataGrid>
          </SectionBlock>

          {/* Section: Astrological Background */}
          {(astrological.rashi || astrological.caste || astrological.religion) && (
            <SectionBlock title="Astrological & Religious Details" color={bg} accent={accent}>
              <DataGrid>
                {astrological.religion && <InfoRow label="Religion" value={astrological.religion} />}
                {astrological.caste && <InfoRow label="Caste" value={astrological.caste} />}
                {astrological.subCaste && <InfoRow label="Sub-Caste" value={astrological.subCaste} />}
                {astrological.gotra && <InfoRow label="Gotra" value={astrological.gotra} />}
                {astrological.rashi && <InfoRow label="Rashi (Moon Sign)" value={astrological.rashi} />}
                {astrological.nakshatra && <InfoRow label="Nakshatra" value={astrological.nakshatra} />}
                {astrological.manglik && <InfoRow label="Manglik Status" value={astrological.manglik} />}
                {astrological.gan && <InfoRow label="Gan" value={astrological.gan} />}
                {astrological.nadi && <InfoRow label="Nadi" value={astrological.nadi} />}
              </DataGrid>
            </SectionBlock>
          )}

          {/* Section: Education & Profession */}
          {(education.highestEducation || education.occupation) && (
            <SectionBlock title="Education & Professional Background" color={bg} accent={accent}>
              <DataGrid>
                {education.highestEducation && <InfoRow label="Highest Degree" value={education.highestEducation} />}
                {education.educationDetails && <InfoRow label="Specialization" value={education.educationDetails} />}
                {education.college && <InfoRow label="University / College" value={education.college} />}
                {education.occupation && <InfoRow label="Occupation" value={education.occupation} />}
                {education.employer && <InfoRow label="Employer" value={education.employer} />}
                {education.annualIncome && <InfoRow label="Annual Income" value={education.annualIncome} />}
                {education.workCity && (
                  <InfoRow
                    label="Work Location"
                    value={`${education.workCity}${education.workCountry && education.workCountry !== 'India' ? ', ' + education.workCountry : ''}`}
                  />
                )}
              </DataGrid>
            </SectionBlock>
          )}

          {/* Section: Family Information */}
          {(family.fatherName || family.motherName) && (
            <SectionBlock title="Family Background" color={bg} accent={accent}>
              <DataGrid>
                {family.fatherName && (
                  <InfoRow
                    label="Father"
                    value={`${family.fatherName}${family.fatherOccupation ? ` (${family.fatherOccupation})` : ''}`}
                  />
                )}
                {family.motherName && (
                  <InfoRow
                    label="Mother"
                    value={`${family.motherName}${family.motherOccupation ? ` (${family.motherOccupation})` : ''}`}
                  />
                )}
                {(family.brothers !== '0' || family.sisters !== '0') && (
                  <InfoRow
                    label="Siblings"
                    value={`${family.brothers || 0} Brother(s) (${family.marriedBrothers || 0} married), ${family.sisters || 0} Sister(s) (${family.marriedSisters || 0} married)`}
                  />
                )}
                {family.nativePlace && <InfoRow label="Native Place" value={family.nativePlace} />}
                {family.familyType && <InfoRow label="Family Type" value={`${family.familyType} Family`} />}
                {family.familyValues && <InfoRow label="Family Values" value={family.familyValues} />}
                {family.familyStatus && <InfoRow label="Family Status" value={family.familyStatus} />}
              </DataGrid>
            </SectionBlock>
          )}

          {/* Section: Partner Preferences */}
          {partnerExpectations.preferences && (
            <SectionBlock title="Partner Expectations" color={bg} accent={accent}>
              <DataGrid>
                {(partnerExpectations.ageFrom || partnerExpectations.ageTo) && (
                  <InfoRow
                    label="Preferred Age"
                    value={`${partnerExpectations.ageFrom || 21} to ${partnerExpectations.ageTo || 35} years`}
                  />
                )}
                {partnerExpectations.education && <InfoRow label="Preferred Education" value={partnerExpectations.education} />}
                {partnerExpectations.occupation && <InfoRow label="Preferred Career" value={partnerExpectations.occupation} />}
              </DataGrid>
              <div className="mt-3 p-3.5 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-100">
                {partnerExpectations.preferences}
              </div>
            </SectionBlock>
          )}

          {/* Section: Contact & Residence */}
          {(contact.phone || contact.city) && (
            <SectionBlock title="Contact & Address Details" color={bg} accent={accent}>
              <DataGrid>
                {contact.contactPerson && <InfoRow label="Contact Person" value={contact.contactPerson} />}
                {contact.phone && <InfoRow label="Phone Number" value={contact.phone} />}
                {contact.whatsapp && <InfoRow label="WhatsApp" value={contact.whatsapp} />}
                {contact.email && <InfoRow label="Email" value={contact.email} />}
                {contact.address && <InfoRow label="Residential Address" value={contact.address} />}
                {contact.city && <InfoRow label="City & State" value={`${contact.city}, ${contact.state || 'India'}`} />}
              </DataGrid>
            </SectionBlock>
          )}
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: bg }} className="py-4 px-6 text-center text-white text-xs opacity-90">
          <p>This verified matrimonial biodata is published via BioLum.</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 mb-12 text-center text-xs text-gray-500">
        <p>Want to create a biodata link for yourself or your family?</p>
        <Link
          href="/create"
          className="inline-block mt-2 font-bold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Create Free Marriage Biodata with BioLum →
        </Link>
      </div>
    </div>
  );
}

function SectionBlock({ title, color, accent, children }: { title: string; color: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 sm:p-5 bg-white shadow-xs">
      <div className="flex items-center gap-2 mb-3.5">
        <h3 style={{ color }} className="font-extrabold text-sm uppercase tracking-wide">
          {title}
        </h3>
        <div style={{ backgroundColor: accent }} className="flex-1 h-0.5 opacity-40 rounded" />
      </div>
      {children}
    </div>
  );
}

function DataGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">{children}</div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-gray-400 font-medium w-32 flex-none">{label}:</span>
      <span className="text-gray-900 font-semibold flex-1 leading-normal">{value}</span>
    </div>
  );
}
