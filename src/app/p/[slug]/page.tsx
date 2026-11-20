export const dynamic = "force-dynamic";

import { supabase } from '@/lib/supabase';
import { calculateAge } from '@/lib/utils';
import { TEMPLATES, DEITY_SYMBOLS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import InteractiveBiodata from './InteractiveBiodata';

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
    description: `Matrimonial biodata profile for ${name}${role}${city}. View verified family, career, and astrological details.`,
    openGraph: {
      title: `${name} — Marriage Biodata`,
      description: `Matrimonial profile for ${name}. View education, family background, and contact details.`,
      type: 'profile',
    },
  };
}

export default async function PublicBiodataPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: profile, error } = await supabase
    .from('biolum_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Increment views (fire and forget)
  supabase.rpc('biolum_increment_views', { profile_slug: slug }).then(() => {});

  const data = profile.data;
  const template = TEMPLATES.find(t => t.id === profile.template_id) || TEMPLATES[0];
  const deity = DEITY_SYMBOLS.find(d => d.id === data?.astrological?.deitySymbol);
  const age = data?.personal?.dateOfBirth ? calculateAge(data.personal.dateOfBirth) : '';

  return (
    <InteractiveBiodata
      profile={{
        slug,
        data,
        template_id: profile.template_id,
        views_count: profile.views_count,
      }}
      template={{
        primaryColor: template.primaryColor,
        accentColor: template.accentColor,
        fontFamily: template.fontFamily,
      }}
      deity={deity ? { emoji: deity.emoji, name: deity.label } : undefined}
      age={age}
    />
  );
}
