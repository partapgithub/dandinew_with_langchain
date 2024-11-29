import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  const { apiKey } = await request.json();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // Query the api_keys table without .single()
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ valid: false });
    }

    // Check if we got any matching rows
    return Response.json({ valid: data && data.length > 0 });
  } catch (error) {
    console.error('Validation error:', error);
    return Response.json({ valid: false });
  }
} 