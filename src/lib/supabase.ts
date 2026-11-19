import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://shfkfqdfahnxodewxupi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmtmcWRmYWhueG9kZXd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MjU4ODEsImV4cCI6MjEwNjUwMTg4MX0.zDNgpjOujoXgVUH_T88QMxK7PnA1VEI7ZEQFt0iiaC8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
