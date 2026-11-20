import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (!slug || typeof pin !== 'string') {
      return NextResponse.json({ error: 'Slug and passcode are required' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('biolum_profiles')
      .select('access_pin, data')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const storedPin = (profile.access_pin || '').trim().toLowerCase();
    const enteredPin = pin.trim().toLowerCase();

    if (!storedPin) {
      // Profile has no pin lock
      return NextResponse.json({ success: true, unlockedData: profile.data });
    }

    if (storedPin !== enteredPin) {
      return NextResponse.json(
        { error: 'Incorrect passcode. Please verify with the candidate or family.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      unlockedData: profile.data,
      message: 'Profile unlocked successfully',
    });
  } catch (err: any) {
    console.error('Unlock bio error:', err);
    return NextResponse.json({ error: 'Failed to verify passcode' }, { status: 500 });
  }
}
