import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateRandomSlug(name: string): string {
  const cleanName = (name || 'profile')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanName}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, accessPin } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing biodata content' }, { status: 400 });
    }

    const candidateName = data.personal?.fullName || 'biodata';
    const slug = generateRandomSlug(candidateName);
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'bp-' + Date.now();
    const resolvedPin = accessPin || data.privacySettings?.accessPin || null;

    const { error } = await supabase.from('biolum_profiles').insert({
      id,
      slug,
      title: data.title || 'Marriage Biodata',
      template_id: data.templateId || 'traditional-red',
      data,
      access_pin: resolvedPin,
      is_active: true,
      views_count: 0,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug,
      id,
      url: `/p/${slug}`,
    });
  } catch (error: any) {
    console.error('API publish error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
